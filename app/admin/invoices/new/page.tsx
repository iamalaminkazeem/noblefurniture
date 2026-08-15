import { InvoiceForm } from "@/components/InvoiceForm";

export default function NewInvoice() {
  return (
    <div>
      <h1 className="serif text-3xl font-light mb-8">New Invoice</h1>
      <InvoiceForm />
    </div>
  );
}