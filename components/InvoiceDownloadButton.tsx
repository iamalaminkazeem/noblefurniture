"use client";
import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { InvoicePDF } from "@/lib/invoice-pdf";

export function InvoiceDownloadButton({ invoice }: { invoice: any }) {
  const [generating, setGenerating] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    try {
      // Runs entirely in the browser — no server route, no Vercel bundling
      // issue to fight. The logo is just a normal relative URL the browser
      // resolves itself, same as any <img> tag would.
      const logoSrc = `${window.location.origin}/logo.png`;
      const blob = await pdf(InvoicePDF({ invoice, logoSrc })).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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