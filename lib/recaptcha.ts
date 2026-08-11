// Verifies a Google reCAPTCHA v3 token server-side.
// Needs RECAPTCHA_SECRET_KEY in .env (site key is public, goes in NEXT_PUBLIC_RECAPTCHA_SITE_KEY).
export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    // No key configured yet — don't block form submissions during setup,
    // but this means spam protection is effectively OFF until you add the key.
    console.warn("RECAPTCHA_SECRET_KEY not set — skipping verification.");
    return true;
  }
  if (!token) return false;

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });
  const data = await res.json();
  // v3 returns a 0–1 score; 0.5+ is Google's suggested threshold for legitimate traffic.
  return data.success === true && (data.score === undefined || data.score >= 0.5);
}
