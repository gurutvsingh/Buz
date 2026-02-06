import { useState } from "react";
import { FaDownload, FaFileInvoice, FaFilePdf, FaPrint } from "react-icons/fa";

import FeatureWorkspace from "../components/common/FeatureWorkspace";
import {
  getInvoicePdfData,
  getBills,
} from "../services/module.service";

import { useBusiness } from "../hooks/useBusiness";
import { useEffect } from "react";
import { currency, shortDate } from "../utils/formatters";

const InvoicePdf = () => {
  const [billId, setBillId] = useState("");
  const [invoice, setInvoice] = useState(null);
  const { currentBusiness } = useBusiness();
  const [bills, setBills] = useState([]);
  useEffect(() => {
  const loadBills = async () => {
    if (!currentBusiness?.id) return;

    const response = await getBills(
      currentBusiness.id
    );

    setBills(response.data || []);
  };

  loadBills();
}, [currentBusiness]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await getInvoicePdfData(billId);
    setInvoice(response.data);
  };

  const buildInvoiceHtml = () => {
    if (!invoice?.bill) return "";

    const rows = invoice.items
      .map(
        (item) => `
          <tr>
            <td>${item.item_name}</td>
            <td>${item.quantity}</td>
            <td>${currency(item.price)}</td>
            <td>${currency(item.subtotal)}</td>
          </tr>
        `
      )
      .join("");
      
    return `
      <!doctype html>
      <html>
        <head>
          <title>${invoice.bill.bill_number}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #0f172a; margin: 40px; }
            header { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px; }
            h1 { margin: 0; font-size: 32px; }
            .muted { color: #64748b; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 32px; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            th { background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; }
            .total { margin-top: 24px; text-align: right; font-size: 28px; font-weight: 800; }
            @media print { button { display: none; } body { margin: 24px; } }
          </style>
        </head>
        <body>
          <header>
            <div>
              <p class="muted">Invoice</p>
              <h1>${invoice.bill.bill_number}</h1>
              <p class="muted">${shortDate(invoice.bill.bill_date)}</p>
            </div>
            <div style="text-align:right">
              <h2>${invoice.bill.business_name}</h2>
              <p class="muted">${invoice.bill.business_type || ""}</p>
              <p>${invoice.bill.customer_name || "Walk-in customer"}</p>
              <p class="muted">${invoice.bill.customer_phone || ""}</p>
              <p class="muted">${invoice.bill.customer_address || ""}</p>
            </div>
          </header>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="4">No line items attached.</td></tr>`}</tbody>
          </table>
          <div class="total">Total: ${currency(invoice.bill.total_amount)}</div>
        </body>
      </html>
    `;
  };

  const printInvoice = () => {
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) return;
    printWindow.document.write(buildInvoiceHtml());
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const downloadInvoice = () => {
    const blob = new Blob([buildInvoiceHtml()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${invoice.bill.bill_number || "invoice"}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <FeatureWorkspace
      eyebrow="Phase 2"
      title="Invoice PDF"
      description="Generate print-ready invoice payloads with business, customer and line item details."
      icon={<FaFilePdf />}
      tone="blue"
      stats={[
        { label: "Template", value: "Ready" },
        { label: "Items", value: invoice?.items?.length || 0 },
        { label: "Export", value: "API" },
      ]}
      cards={[
        {
          icon: <FaFileInvoice />,
          title: "Invoice Preview",
          description:
            "Backend endpoint returns structured invoice data for rendering a PDF or print page.",
          tag: "Bill items",
        },
        {
          icon: <FaDownload />,
          title: "Download Ready",
          description:
            "The frontend can plug this payload into a PDF library or browser print flow.",
          tag: "PDF",
        },
        {
          icon: <FaPrint />,
          title: "Print Layout",
          description:
            "Business and customer metadata are returned together for a professional invoice.",
          tag: "Invoice",
        },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-2xl font-black">Load Invoice</h2>
          <select
  required
  value={billId}
  onChange={(e) => setBillId(e.target.value)}
  className="mt-6 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
>
  <option value="">
    Select Invoice
  </option>

  {bills.map((bill) => (
    <option
      key={bill.id}
      value={bill.id}
    >
      {bill.bill_number}
    </option>
  ))}
</select>
          <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700">
            <FaFilePdf />
            Preview Data
          </button>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {invoice?.bill ? (
            <div>
              <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                    Invoice
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {invoice.bill.bill_number}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {shortDate(invoice.bill.bill_date)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-black">{invoice.bill.business_name}</p>
                  <p className="text-sm text-slate-500">
                    {invoice.bill.customer_name || "Walk-in customer"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {invoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm"
                  >
                    <span className="font-bold">{item.item_name}</span>
                    <span>{currency(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-blue-50 p-4 text-right">
                <p className="text-sm font-semibold text-blue-700">Total</p>
                <p className="text-3xl font-black text-blue-900">
                  {currency(invoice.bill.total_amount)}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={printInvoice}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800"
                >
                  <FaPrint />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={downloadInvoice}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <FaDownload />
                  Download Invoice
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Enter a bill ID to preview invoice PDF data.
            </p>
          )}
        </section>
      </div>
    </FeatureWorkspace>
  );
};

export default InvoicePdf;
