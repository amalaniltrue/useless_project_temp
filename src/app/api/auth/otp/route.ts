import { NextResponse } from 'next/server';

// In-memory OTP cache with 5-minute TTL (for local/server validation)
const otpStore = new Map<string, { code: string; expiresAt: number; destination: string; type: 'phone' | 'email' }>();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action = 'send', destination = '', type = 'phone', code = '' } = body;

    const cleanDest = destination.trim().toLowerCase();
    if (!cleanDest) {
      return NextResponse.json({ success: false, error: 'Destination (phone or email) is required' }, { status: 400 });
    }

    if (action === 'send') {
      // Generate a dynamic 4-digit code
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

      otpStore.set(cleanDest, {
        code: generatedCode,
        expiresAt,
        destination: cleanDest,
        type: type === 'email' ? 'email' : 'phone',
      });

      // If production environment variables for real SMS/Email are set, integrate here
      // (e.g. RESEND_API_KEY for emails, TWILIO_ACCOUNT_SID for SMS)
      // Otherwise, returns the code for live-simulated carrier delivery
      return NextResponse.json({
        success: true,
        message: type === 'email' ? `Verification code sent to ${cleanDest}` : `SMS sent to ${cleanDest}`,
        destination: cleanDest,
        type,
        code: generatedCode, // Available for client simulation / auto-fill
        expiresInSeconds: 300,
      });
    }

    if (action === 'verify') {
      const record = otpStore.get(cleanDest);
      const cleanCode = code.trim();

      if (!record) {
        return NextResponse.json({ success: false, error: 'Verification code expired or not found. Please request a new code.' }, { status: 400 });
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(cleanDest);
        return NextResponse.json({ success: false, error: 'Verification code has expired. Please request a new code.' }, { status: 400 });
      }

      if (record.code !== cleanCode) {
        return NextResponse.json({ success: false, error: 'Incorrect verification code. Please check and try again.' }, { status: 400 });
      }

      // Successful verification
      otpStore.delete(cleanDest);
      return NextResponse.json({
        success: true,
        verified: true,
        destination: cleanDest,
        type: record.type,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
