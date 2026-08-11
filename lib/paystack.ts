// Server-side Paystack helpers. Needs PAYSTACK_SECRET_KEY in .env.
// Never expose the secret key to the client.
const PAYSTACK_BASE = "https://api.paystack.co";

export async function initializeTransaction({ email, amountKobo, reference, callback_url }: {
  email: string; amountKobo: number; reference: string; callback_url: string;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount: amountKobo, reference, callback_url }),
  });
  if (!res.ok) throw new Error(`Paystack initialize failed: ${res.status}`);
  return res.json();
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  if (!res.ok) throw new Error(`Paystack verify failed: ${res.status}`);
  return res.json();
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const crypto = require("crypto");
  const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY).update(rawBody).digest("hex");
  return hash === signature;
}
