// Sends confirmation + notification emails via Resend.
// Needs RESEND_API_KEY, EMAIL_FROM, ADMIN_NOTIFICATION_EMAIL in .env.
import { Resend } from "resend";
import { BUSINESS } from "./business";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || `${BUSINESS.name} <no-reply@noblefurnituregallery.com>`;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || BUSINESS.email;

export async function sendQuoteConfirmation(to: string, name: string) {
  return resend.emails.send({
    from: FROM, to,
    subject: `We've received your quote request — ${BUSINESS.name}`,
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#0B3D2E;">Thank you, ${name}.</h2>
      <p style="color:#1E1E1E;">We've received your quote request and our team will reach out within one business day.</p>
      <p style="color:#1E1E1E;">— ${BUSINESS.name}</p></div>`,
  });
}

export async function notifyAdminNewQuote(q: { fullName: string; email: string; phone: string; furnitureType: string; description: string }) {
  return resend.emails.send({
    from: FROM, to: ADMIN_EMAIL,
    subject: `New quote request: ${q.fullName}`,
    html: `<div style="font-family:sans-serif;"><h3>New quote request</h3>
      <p><b>Name:</b> ${q.fullName}</p><p><b>Email:</b> ${q.email}</p><p><b>Phone:</b> ${q.phone}</p>
      <p><b>Furniture type:</b> ${q.furnitureType}</p><p><b>Description:</b> ${q.description}</p></div>`,
  });
}

export async function notifyAdminNewContact(m: { fullName: string; email: string; phone: string; message: string }) {
  return resend.emails.send({
    from: FROM, to: ADMIN_EMAIL,
    subject: `New contact message: ${m.fullName}`,
    html: `<div style="font-family:sans-serif;"><h3>New contact message</h3>
      <p><b>Name:</b> ${m.fullName}</p><p><b>Email:</b> ${m.email}</p><p><b>Phone:</b> ${m.phone}</p><p>${m.message}</p></div>`,
  });
}

export async function notifyAdminNewConsultation(c: { fullName: string; email: string; phone: string; preferredDate: string; notes?: string }) {
  return resend.emails.send({
    from: FROM, to: ADMIN_EMAIL,
    subject: `New consultation booking: ${c.fullName}`,
    html: `<div style="font-family:sans-serif;"><h3>New consultation request</h3>
      <p><b>Name:</b> ${c.fullName}</p><p><b>Email:</b> ${c.email}</p><p><b>Phone:</b> ${c.phone}</p>
      <p><b>Preferred date:</b> ${c.preferredDate}</p><p><b>Notes:</b> ${c.notes || "—"}</p></div>`,
  });
}

export async function sendConsultationConfirmation(to: string, name: string) {
  return resend.emails.send({
    from: FROM, to,
    subject: `Consultation request received — ${BUSINESS.name}`,
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#0B3D2E;">Thanks, ${name}.</h2>
      <p style="color:#1E1E1E;">We've received your consultation request and will confirm a time with you shortly.</p>
      <p style="color:#1E1E1E;">— ${BUSINESS.name}</p></div>`,
  });
}
