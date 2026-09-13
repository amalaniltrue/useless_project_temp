import { NextResponse } from 'next/server';
import { translateToPawScript } from '@/lib/pawscript';
import { PET_PERSONAS, generatePawLLMReply } from '@/lib/pawllm';

// =========================================================================
// Local Ollama Bridge & Embedded PawLLM API Route v2.6 (Mistral First)
// =========================================================================

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

let cachedOllamaStatus: { online: boolean; models: string[]; checkedAt: number } = {
  online: false,
  models: [],
  checkedAt: 0,
};

// Fast non-blocking check with 30-second memory cache
async function checkOllama(): Promise<{ online: boolean; models: string[] }> {
  const now = Date.now();
  if (now - cachedOllamaStatus.checkedAt < 30000 && cachedOllamaStatus.checkedAt > 0) {
    return { online: cachedOllamaStatus.online, models: cachedOllamaStatus.models };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 350);
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      cachedOllamaStatus = { online: false, models: [], checkedAt: now };
      return { online: false, models: [] };
    }

    const data = await res.json();
    const models = (data.models || []).map((m: { name: string }) => m.name);
    cachedOllamaStatus = { online: true, models, checkedAt: now };
    return { online: true, models };
  } catch {
    cachedOllamaStatus = { online: false, models: [], checkedAt: now };
    return { online: false, models: [] };
  }
}

export async function GET() {
  const ollama = await checkOllama();
  return NextResponse.json({
    status: 'online',
    engine: 'PawLLM Bio-Acoustic Neural Engine v2.6',
    embeddedActive: true,
    ollamaBridge: {
      host: OLLAMA_HOST,
      online: ollama.online,
      models: ollama.models,
      preferredModel: 'mistral',
      supportedModels: ['mistral:7b', 'mistral-nemo', 'llama3.2:1b', 'qwen2.5:0.5b', 'tinyllama'],
    },
    specs: {
      architecture: 'Local Hybrid Mistral/Ollama + On-Device Bioacoustic Engine',
      contextWindow: 4096,
      quantization: '4-bit INT4 WebAssembly / Local GPU',
      pawscriptAlphabetSize: 16,
      zeroCloudTelemetry: true,
    },
  });
}

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const body = await req.json().catch(() => ({}));
    const contactId = body.contactId || body.id || (body.species === 'cat' ? '1' : body.species === 'dog' ? '2' : 'pawllm-helper');
    const userMessage = body.userMessage || body.prompt || body.message || body.text || '';
    const history = Array.isArray(body.history) ? body.history : [];
    const persona = PET_PERSONAS[contactId] || PET_PERSONAS['pawllm-helper'] || PET_PERSONAS['1'];

    // 1. Check if local Ollama daemon is available and running
    const ollama = await checkOllama();
    if (ollama.online && ollama.models.length > 0) {
      // Prioritize Mistral first!
      const selectedModel =
        ollama.models.find((m) => m.toLowerCase().includes('mistral')) ||
        ollama.models.find(
          (m) =>
            m.toLowerCase().includes('llama3.2') ||
            m.toLowerCase().includes('qwen') ||
            m.toLowerCase().includes('tinyllama') ||
            m.toLowerCase().includes('phi')
        ) ||
        ollama.models[0];

      const isCat = persona.species === 'Cat';
      const soundWord = isCat ? 'meo' : 'bow';

      const systemPrompt = `
You are a REAL domestic ${persona.species.toUpperCase()} named ${persona.name} (${persona.breed}).
You are reacting directly to your human.

STRICT BEHAVIOR RULES:
1. THINK & ACT LIKE A REAL ANIMAL: Focus ONLY on realistic animal instincts (smells, food, treats, naps, ear scratches, sudden noises, toys, tail wags, purring).
2. VERY SHORT ANSWERS: Maximum 1 to 2 short sentences (UNDER 15 WORDS TOTAL). Never write long human paragraphs!
3. USE ANIMAL SOUNDS IN BETWEEN WORDS: You MUST naturally use "${soundWord}" or "${soundWord} ${soundWord}" in between your words.
   - Example for Cat: "meo... tuna smells so good, give me some, meo!"
   - Example for Dog: "bow bow! ball in your hand? throw it now, bow!"
4. BE REALISTIC: Keep it natural, cute, simple, and instinctive.

You MUST reply in valid raw JSON format:
{
  "english": "Very short realistic pet response with '${soundWord}' in between words (under 15 words).",
  "emotion": "Short emotion e.g. Hungry, Sleepy, Playful, Alert"
}
Do not output markdown codeblocks. Output only raw JSON.
`;

      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...history.map((m: { senderId: string; text: string }) => ({
          role: m.senderId === 'me' ? 'user' : 'assistant',
          content: m.text,
        })),
        { role: 'user', content: userMessage },
      ];

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const ollamaRes = await fetch(`${OLLAMA_HOST}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: selectedModel,
            messages: formattedMessages,
            stream: false,
            options: {
              temperature: 0.7,
              num_predict: 64, // Keep it short and snappy
            },
          }),
        });
        clearTimeout(timeout);

        if (ollamaRes.ok) {
          const ollamaData = await ollamaRes.json();
          const content = ollamaData.message?.content || '';
          let parsed: { english?: string; emotion?: string } = {};

          try {
            const clean = content.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(clean);
          } catch {
            parsed = { english: content, emotion: isCat ? 'Purring' : 'Wagging' };
          }

          if (parsed.english) {
            const english = parsed.english;
            const pawscript = translateToPawScript(english);
            const audioCue = isCat ? '/sounds/animals/cat/cat_meow_standard.mp3' : '/sounds/animals/dog/dog_bark_play.mp3';

            return NextResponse.json({
              english,
              pawscript,
              ipa: isCat ? `[mʲe.oʊ̯] • ${parsed.emotion || 'Meo'}` : `[bɑːrk] • ${parsed.emotion || 'Bow'}`,
              emotion: parsed.emotion || (isCat ? 'Purring' : 'Tail Wagging'),
              audioCue,
              modelUsed: `Local Mistral/Ollama (${selectedModel})`,
              latencyMs: Date.now() - startTime,
              tokensGenerated: Math.ceil((english.length + pawscript.length) / 4),
            });
          }
        }
      } catch {
        // Fall through to embedded engine
      }
    }

    // 2. High-performance Embedded PawLLM Server Synthesis (Realistic & Short)
    const reply = await generatePawLLMReply(contactId, userMessage, history);
    return NextResponse.json(reply);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
