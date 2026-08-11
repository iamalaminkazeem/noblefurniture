// Verifies a Google reCAPTCHA v3 token server-side.
// Needs RECAPTCHA_SECRET_KEY in .env (site key is public, goes in NEXT_PUBLIC_RECAPTCHA_SITE_KEY).
export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("RECAPTCHA_SECRET_KEY not set — skipping verification.");
    return true;
  }
  if (!token) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // don't hang forever if Google is slow/unreachable

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await res.json();
    return data.success === true && (data.score === undefined || data.score >= 0.5);
  } catch (err) {
    // Google unreachable or timed out — fail OPEN, not closed. Honeypot + rate
    // limiting still guard the form; blocking real customers because Google's
    // servers had a blip is worse than occasionally missing a bot.
    console.error("reCAPTCHA verification failed (network issue), allowing submission:", err);
    return true;
  }
}