"use client";
import React, { useState } from "react";
import { Download } from "lucide-react";
import { generateInvoicePDF } from "@/lib/generate-invoice-pdf";

async function loadLogoAsDataUrl(): Promise<string | undefined> {
  try {
    const res = await fetch("/logo.png");
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined; // no logo is better than a broken PDF
  }
}

export function InvoiceDownloadButton({ invoice }: { invoice: any }) {
  const [generating, setGenerating] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    try {
      const logoDataUrl = await loadLogoAsDataUrl();
      const doc = await generateInvoicePDF(invoice, logoDataUrl);
      doc.save(`${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Could not generate the PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="border border-[#0B3D2E] text-[#0B3D2E] px-4 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60"
    >
      <Download size={16} /> {generating ? "Generating…" : "Download PDF"}
    </button>
  );
} 