"use client";
import Script from "next/script";

// Loads Google reCAPTCHA v3. Needs NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.
// If the key isn't set, this script simply won't load anything meaningful —
// forms will still submit, but lib/recaptcha.ts will skip verification server-side too.
export function RecaptchaScript() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return null;
  return <Script src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`} strategy="afterInteractive" />;
}

// Call this inside a form submit handler to get a fresh token.
export async function getRecaptchaToken(action: string): Promise<string | undefined> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  // @ts-ignore
  if (!siteKey || typeof window === "undefined" || !window.grecaptcha) return undefined;
  return new Promise((resolve) => {
    // @ts-ignore
    window.grecaptcha.ready(() => {
      // @ts-ignore
      window.grecaptcha.execute(siteKey, { action }).then(resolve).catch(() => resolve(undefined));
    });
  });
}
