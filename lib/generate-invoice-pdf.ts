// Plain, imperative PDF builder using jsPDF — no JSX, no custom React
// renderer, no reconciler. This sidesteps the entire category of bug we
// hit with @react-pdf/renderer.
import jsPDF from "jspdf";
import { BUSINESS } from "./business";

type InvoiceData = {
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  issueDate: string | Date;
  dueDate?: string | Date | null;
  status: string;
  subtotalKobo: number;
  discountKobo: number;
  deliveryKobo: number;
  installationKobo: number;
  totalKobo: number;
  notes?: string | null;
  items: { description: string; quantity: number; unitPriceKobo: number; amountKobo: number }[];
};

const formatNaira = (kobo: number) => `NGN ${(kobo / 100).toLocaleString("en-NG")}`;
const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "2-digit", year: "numeric" });

const GREEN: [number, number, number] = [11, 61, 46]; // #0B3D2E
const GOLD: [number, number, number] = [200, 169, 81]; // #C8A951
const GREY: [number, number, number] = [85, 85, 85];

export async function generateInvoicePDF(invoice: InvoiceData, logoDataUrl?: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 50;

  // ---- Header: logo + company info (left), invoice title/meta (right) ----
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", margin, y - 10, 70, 47);
    } catch {
      // If the logo fails to embed for any reason, just skip it — never
      // block the whole PDF over a decorative image.
    }
  }

  const infoX = margin + 85;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...GREEN);
  doc.text(BUSINESS.legalName, infoX, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...GOLD);
  doc.text("CRAFTING LUXURY. DEFINING SPACES.", infoX, y + 12);

  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text(BUSINESS.address, infoX, y + 26);
  doc.text(`Tel: ${BUSINESS.phoneNumbers.join(" | ")}`, infoX, y + 37);
  doc.text(`WhatsApp: ${BUSINESS.phoneDisplay}`, infoX, y + 48);
  doc.text(`Email: ${BUSINESS.email}`, infoX, y + 59);
  doc.text(`CAC No.: ${BUSINESS.cacNumber}`, infoX, y + 70);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...GREEN);
  doc.text("INVOICE", pageWidth - margin, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text(`Invoice No.: ${invoice.invoiceNumber}`, pageWidth - margin, y + 16, { align: "right" });
  doc.text(`Date: ${formatDate(invoice.issueDate)}`, pageWidth - margin, y + 27, { align: "right" });
  doc.text(`Due: ${invoice.dueDate ? formatDate(invoice.dueDate) : "—"}`, pageWidth - margin, y + 38, { align: "right" });

  y += 95;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 25;

  // ---- Bill To ----
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text("BILL TO", margin, y);
  y += 12;
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(invoice.customerName, margin, y);
  y += 12;
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  if (invoice.customerPhone) { doc.text(`Phone: ${invoice.customerPhone}`, margin, y); y += 11; }
  if (invoice.customerEmail) { doc.text(`Email: ${invoice.customerEmail}`, margin, y); y += 11; }
  if (invoice.customerAddress) { doc.text(`Address: ${invoice.customerAddress}`, margin, y); y += 11; }

  y += 15;

  // ---- Items table ----
  const colDesc = margin;
  const colQty = pageWidth - margin - 220;
  const colPrice = pageWidth - margin - 150;
  const colAmount = pageWidth - margin - 60;
  const tableWidth = pageWidth - margin * 2;

  doc.setFillColor(...GREEN);
  doc.rect(margin, y, tableWidth, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("DESCRIPTION", colDesc + 6, y + 14);
  doc.text("QTY", colQty, y + 14);
  doc.text("UNIT PRICE", colPrice, y + 14);
  doc.text("AMOUNT", colAmount, y + 14);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  for (const item of invoice.items) {
    y += 18;
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, pageWidth - margin, y);
    doc.text(item.description, colDesc + 6, y - 6, { maxWidth: colQty - colDesc - 12 });
    doc.text(String(item.quantity), colQty, y - 6);
    doc.text(formatNaira(item.unitPriceKobo), colPrice, y - 6);
    doc.text(formatNaira(item.amountKobo), colAmount, y - 6);
  }
  y += 25;

  // ---- Totals ----
  const totalsX = pageWidth - margin - 200;
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  const totalRow = (label: string, value: string) => {
    doc.text(label, totalsX, y);
    doc.text(value, pageWidth - margin, y, { align: "right" });
    y += 14;
  };
  totalRow("Subtotal", formatNaira(invoice.subtotalKobo));
  totalRow("Delivery", formatNaira(invoice.deliveryKobo));
  totalRow("Installation", formatNaira(invoice.installationKobo));
  totalRow("Discount", `-${formatNaira(invoice.discountKobo)}`);

  y += 6;
  doc.setFillColor(...GREEN);
  doc.rect(totalsX - 10, y - 12, pageWidth - margin - totalsX + 10, 26, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL DUE", totalsX, y + 5);
  doc.text(formatNaira(invoice.totalKobo), pageWidth - margin, y + 5, { align: "right" });
  y += 30;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(invoice.status === "PAID" ? GREEN[0] : GOLD[0], invoice.status === "PAID" ? GREEN[1] : GOLD[1], invoice.status === "PAID" ? GREEN[2] : GOLD[2]);
  doc.text(`Status: ${invoice.status}`, pageWidth - margin, y, { align: "right" });

  // ---- Payment Details / Terms & Notes (two columns) ----
  y += 35;
  const depositAmount = Math.round(invoice.totalKobo * 0.8);
  const balanceAmount = invoice.totalKobo - depositAmount;
  const colWidth = (pageWidth - margin * 2 - 20) / 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GREEN);
  doc.text("PAYMENT DETAILS", margin, y);
  doc.text("TERMS & NOTES", margin + colWidth + 20, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GREY);

  const leftLines = [
    `Bank: ${BUSINESS.bankName}`,
    `Account Name: ${BUSINESS.bankAccountName}`,
    `Account Number: ${BUSINESS.bankAccountNumber}`,
    `Paystack: [Payment Link]`,
  ];
  const rightLines = [
    `Payment terms: 80% deposit (${formatNaira(depositAmount)}), 20% balance due after delivery (${formatNaira(balanceAmount)}).`,
    `Adding further items to this invoice after issuance will incur additional charges.`,
    `Custom orders are subject to agreed specifications.`,
    `Please retain this invoice as proof of transaction.`,
    ...(invoice.notes ? [invoice.notes] : []),
  ];

  let leftY = y;
  for (const line of leftLines) {
    doc.text(line, margin, leftY, { maxWidth: colWidth });
    leftY += 13;
  }

  let rightY = y;
  for (const line of rightLines) {
    const wrapped = doc.splitTextToSize(`• ${line}`, colWidth);
    doc.text(wrapped, margin + colWidth + 20, rightY);
    rightY += wrapped.length * 11 + 3;
  }

  // ---- Footer ----
  const footerY = doc.internal.pageSize.getHeight() - 50;
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GREEN);
  doc.text(`Thank you for choosing ${BUSINESS.legalName}.`, pageWidth / 2, footerY, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text("Luxury furniture. Exceptional craftsmanship.", pageWidth / 2, footerY + 12, { align: "center" });

  return doc;
}