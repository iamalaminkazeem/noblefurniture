import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { BUSINESS } from "./business";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 9, fontFamily: "Helvetica", color: "#1E1E1E" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  logo: { width: 90, height: 60, objectFit: "contain" },
  companyBlock: { marginLeft: 12 },
  companyName: { fontSize: 14, color: "#0B3D2E", fontWeight: 700 },
  tagline: { fontSize: 7, color: "#C8A951", letterSpacing: 1, marginTop: 2, marginBottom: 6 },
  small: { fontSize: 8, color: "#555", marginBottom: 1.5 },
  invoiceTitle: { fontSize: 22, color: "#0B3D2E", textAlign: "right", fontWeight: 700 },
  invoiceMeta: { fontSize: 8, color: "#555", textAlign: "right", marginTop: 4 },
  divider: { borderBottom: "1.5 solid #C8A951", marginVertical: 14 },
  billTo: { marginBottom: 16 },
  label: { fontSize: 7, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 },
  table: { marginTop: 6 },
  tableHeader: { flexDirection: "row", backgroundColor: "#0B3D2E", paddingVertical: 6, paddingHorizontal: 6 },
  tableHeaderText: { fontSize: 8, color: "#FFFFFF", textTransform: "uppercase" },
  tableRow: { flexDirection: "row", borderBottom: "0.5 solid #eee", paddingVertical: 7, paddingHorizontal: 6 },
  colDesc: { width: "46%" },
  colQty: { width: "14%", textAlign: "center" },
  colPrice: { width: "20%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },
  totals: { marginTop: 16, alignSelf: "flex-end", width: 220 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4, fontSize: 9 },
  grandTotal: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#0B3D2E", padding: 8, marginTop: 6 },
  grandTotalText: { color: "#FFFFFF", fontSize: 11, fontWeight: 700 },
  bottomSection: { flexDirection: "row", justifyContent: "space-between", marginTop: 28 },
  bottomCol: { width: "48%" },
  bottomHeading: { fontSize: 9, color: "#0B3D2E", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" },
  bulletLine: { fontSize: 8, color: "#555", marginBottom: 4, lineHeight: 1.4 },
  statusBadge: { fontSize: 9, fontWeight: 700, marginTop: 10 },
  footer: { marginTop: 32, paddingTop: 14, borderTop: "0.5 solid #eee", fontSize: 8, color: "#999", textAlign: "center" },
  footerBrand: { fontSize: 9, color: "#0B3D2E", marginBottom: 3 },
});

const formatNaira = (kobo: number) => `NGN ${(kobo / 100).toLocaleString("en-NG")}`;

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

export function InvoicePDF({ invoice, logoSrc }: { invoice: InvoiceData; logoSrc?: Buffer | string }) {
  const issueDate = new Date(invoice.issueDate).toLocaleDateString("en-NG", { day: "2-digit", month: "2-digit", year: "numeric" });
  const dueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-NG", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
  const depositAmount = Math.round(invoice.totalKobo * 0.8);
  const balanceAmount = invoice.totalKobo - depositAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row" }}>
            {logoSrc && <Image src={logoSrc as any} style={styles.logo} />}
            <View style={styles.companyBlock}>
              <Text style={styles.companyName}>{BUSINESS.legalName}</Text>
              <Text style={styles.tagline}>CRAFTING LUXURY. DEFINING SPACES.</Text>
              <Text style={styles.small}>{BUSINESS.address}</Text>
              <Text style={styles.small}>Tel: {BUSINESS.phoneNumbers.join(" | ")}</Text>
              <Text style={styles.small}>WhatsApp: {BUSINESS.phoneDisplay}</Text>
              <Text style={styles.small}>Email: {BUSINESS.email}</Text>
              <Text style={styles.small}>CAC No.: {BUSINESS.cacNumber}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>Invoice No.: {invoice.invoiceNumber}</Text>
            <Text style={styles.invoiceMeta}>Date: {issueDate}</Text>
            <Text style={styles.invoiceMeta}>Due: {dueDate}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.billTo}>
          <Text style={styles.label}>Bill To</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>{invoice.customerName}</Text>
          {invoice.customerPhone && <Text style={styles.small}>Phone: {invoice.customerPhone}</Text>}
          {invoice.customerEmail && <Text style={styles.small}>Email: {invoice.customerEmail}</Text>}
          {invoice.customerAddress && <Text style={styles.small}>Address: {invoice.customerAddress}</Text>}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDesc, styles.tableHeaderText]}>Description</Text>
            <Text style={[styles.colQty, styles.tableHeaderText]}>Qty</Text>
            <Text style={[styles.colPrice, styles.tableHeaderText]}>Unit Price</Text>
            <Text style={[styles.colAmount, styles.tableHeaderText]}>Amount</Text>
          </View>
          {invoice.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatNaira(item.unitPriceKobo)}</Text>
              <Text style={styles.colAmount}>{formatNaira(item.amountKobo)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}><Text>Subtotal</Text><Text>{formatNaira(invoice.subtotalKobo)}</Text></View>
          <View style={styles.totalRow}><Text>Delivery</Text><Text>{formatNaira(invoice.deliveryKobo)}</Text></View>
          <View style={styles.totalRow}><Text>Installation</Text><Text>{formatNaira(invoice.installationKobo)}</Text></View>
          <View style={styles.totalRow}><Text>Discount</Text><Text>-{formatNaira(invoice.discountKobo)}</Text></View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalText}>TOTAL DUE</Text>
            <Text style={styles.grandTotalText}>{formatNaira(invoice.totalKobo)}</Text>
          </View>
          <Text style={[styles.statusBadge, { color: invoice.status === "PAID" ? "#0B3D2E" : "#C8A951" }]}>
            Status: {invoice.status}
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.bottomCol}>
            <Text style={styles.bottomHeading}>Payment Details</Text>
            <Text style={styles.bulletLine}>Bank: {BUSINESS.bankName}</Text>
            <Text style={styles.bulletLine}>Account Name: {BUSINESS.bankAccountName}</Text>
            <Text style={styles.bulletLine}>Account Number: {BUSINESS.bankAccountNumber}</Text>
            <Text style={styles.bulletLine}>Paystack: [Payment Link]</Text>
          </View>
          <View style={styles.bottomCol}>
            <Text style={styles.bottomHeading}>Terms & Notes</Text>
            <Text style={styles.bulletLine}>• Payment terms: 80% deposit ({formatNaira(depositAmount)}), 20% balance due after delivery ({formatNaira(balanceAmount)}).</Text>
            <Text style={styles.bulletLine}>• Adding further items to this invoice after issuance will incur additional charges.</Text>
            <Text style={styles.bulletLine}>• Custom orders are subject to agreed specifications.</Text>
            <Text style={styles.bulletLine}>• Please retain this invoice as proof of transaction.</Text>
            {invoice.notes && <Text style={styles.bulletLine}>• {invoice.notes}</Text>}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Thank you for choosing {BUSINESS.legalName}.</Text>
          <Text>Luxury furniture. Exceptional craftsmanship.</Text>
        </View>
      </Page>
    </Document>
  );
}