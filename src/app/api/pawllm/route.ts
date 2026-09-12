import { NextResponse } from 'next/server';
import { translateToPawScript } from '@/lib/pawscript';
import { PET_PERSONAS } from '@/lib/pawllm';

// =========================================================================
// Local Ollama Bridge & Embedded PawLLM API Route
// =========================================================================

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

// Check if local Ollama daemon is running
async function checkOllama(): Promise<{ online: boolean; models: string[] }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });
    clearTimeout(timeout);
    if (!res.ok) return { online: false, models: [] };
    const data = await res.json();
    const models = (data.models || []).map((m: { name: string }) => m.name);
    return { online: true, models };
  } catch {
    return { online: false, models: [] };
  }
}

export async function GET() {
  const ollama = await checkOllama();
  return NextResponse.json({
    status: 'online',
    engine: 'PawLLM Bio-Acoustic Neural Engine v2.4',
    embeddedActive: true,
    ollamaBridge: {
      host: OLLAMA_HOST,
      online: ollama.online,
      models: ollama.models,
      recommendedLocalModels: ['llama3.2:1b', 'qwen2.5:0.5b', 'mistral', 'tinyllama', 'phi3'],
    },
    specs: {
      architecture: 'Local On-Device Hybrid Transformer + Local Ollama Daemon Bridge',
      contextWindow: 4096,
      quantization: '4-bit INT4 WebAssembly / Local GPU',
      pawscriptAlphabetSize: 23,
      zeroCloudTelemetry: true,
    },
  });
}

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { contactId, userMessage, history = [] } = body;
    const persona = PET_PERSONAS[contactId] || PET_PERSONAS['1'];

    // Check if local Ollama daemon is available
    const ollama = await checkOllama();
    if (ollama.online && ollama.models.length > 0) {
      const selectedModel =
        ollama.models.find((m) => m.includes('llama3.2') || m.includes('qwen') || m.includes('mistral') || m.includes('tinyllama')) ||
        ollama.models[0];

      const systemPrompt = `
${persona.systemPrompt}
You are chatting with your trusted human in the PawChat app on PawOS.
You know the ancient phonetic language of animals called "PawScript", which uses runic glyphs (such as ᛗᛖᐱ for meow, ᚱᚱᚱ for purr, ᛒᐱᚢ for bark, ᚹᚢᚠ for woof, ᚳᚱᛈ for chirp, ᚺᛁᛋ for hiss, ᚪᚹᚢ for howl).
Always stay completely in character.
You MUST output your reply in valid JSON format:
{
  "english": "Your conversational reply in English with natural animal vocal sounds included (purr, meow, bark, woof, etc.). Keep it fun, punchy, and affectionate (1-3 sentences).",
  "emotion": "Dominant emotion e.g. Joyful, Aristocratic, Zoomies, Mischief"
}
Do not output markdown codeblocks, just raw JSON.
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
        const timeout = setTimeout(() => controller.abort(), 4000);
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
              num_predict: 128,
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
            parsed = { english: content, emotion: 'Chatty' };
          }

          if (parsed.english) {
            const english = parsed.english;
            const pawscript = translateToPawScript(english);
            const isCat = persona.species === 'Cat';
            const audioCue = isCat ? '/sounds/animals/cat/cat_purr.mp3' : '/sounds/animals/dog/dog_play_bark.mp3';

            return NextResponse.json({
              english,
              pawscript,
              ipa: isCat ? '[mʲe.oʊ̯] • ' + (parsed.emotion || 'Content') : '[bɑːrk] • ' + (parsed.emotion || 'Excited'),
              emotion: parsed.emotion || (isCat ? 'Purring' : 'Tail Wagging'),
              audioCue,
              modelUsed: `Local Ollama (${selectedModel})`,
              latencyMs: Date.now() - startTime,
              tokensGenerated: Math.ceil((english.length + pawscript.length) / 4),
            });
          }
        }
      } catch {
        // Fall back to embedded engine if Ollama call failed or timed out
      }
    }

    // Return signal to use client-side embedded PawLLM engine
    return NextResponse.json({ fallbackToEmbedded: true });
  } catch (err) {
    return NextResponse.json({ error: String(err), fallbackToEmbedded: true }, { status: 500 });
  }
}
