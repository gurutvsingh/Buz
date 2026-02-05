import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileInvoiceDollar, FaPlus, FaReceipt,
  FaTrash, FaXmark, FaUser,
} from "react-icons/fa6";

import ModuleShell from "../components/common/ModuleShell";
import RecordTable from "../components/common/RecordTable";
import StatsCard   from "../components/dashboard/StatsCard";
import { useBusiness } from "../hooks/useBusiness";
import {
  createBill, deleteBill, getBills,
  getCustomers, getInventoryItems,
} from "../services/module.service";
import { currency, shortDate } from "../utils/formatters";

const FIELD = "h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

const blankItem = () => ({
  item_source: "INVENTORY",
  inventory_item_id: "",
  item_name: "",
  quantity: 1,
  price: 0,
  unit: "pcs",
});

const autoInvNumber = () => {
  const now = new Date();
  return `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
};

/* ── Bill Detail Drawer ── */
const BillDrawer = ({ bill, onClose }) => {
  if (!bill) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600">Invoice</p>
              <h2 className="text-base font-semibold text-slate-900">{bill.bill_number}</h2>
            </div>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            >
              <FaXmark className="text-xs" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Customer</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {bill._displayName || bill.customer_name || bill.custom_customer_name || "Walk-in"}
                </p>
                {bill.custom_customer_phone && (
                  <p className="mt-0.5 text-xs text-slate-500">{bill.custom_customer_phone}</p>
                )}
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Date</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{shortDate(bill.bill_date)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Status</p>
                <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  ISSUED
                </span>
              </div>
              <div className="rounded-xl bg-slate-900 p-4 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Total</p>
                <p className="mt-1 text-lg font-bold">{currency(bill.total_amount)}</p>
              </div>
            </div>

            {bill.items?.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Line items</h3>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50">
                      <tr>
                        {["Item", "Qty", "Rate", "Total"].map((h) => (
                          <th key={h} className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${h === "Total" ? "text-right" : ""}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bill.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-900">{item.item_name || "—"}</p>
                            <p className="text-[11px] text-slate-400">{item.unit}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-slate-600">{currency(item.price)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-900">
                            {currency(item.quantity * item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200 bg-slate-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-slate-700">Grand total</td>
                        <td className="px-4 py-3 text-right text-base font-bold text-slate-900">
                          {currency(bill.total_amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              🖨 Print invoice
            </button>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Item Card ── */
const ItemCard = ({ item, index, inventory, onUpdate, onRemove, canRemove }) => {
  const stockInfo =
    item.item_source === "INVENTORY" && item.inventory_item_id
      ? inventory.find((p) => p.id === Number(item.inventory_item_id))
      : null;

  const lineTotal = Number(item.quantity || 0) * Number(item.price || 0);

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
        {["INVENTORY", "CUSTOM"].map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => onUpdate(index, "item_source", src)}
            className={`rounded-md py-1.5 text-xs font-semibold transition ${
              item.item_source === src
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {src === "INVENTORY" ? "📦 Inventory" : "✏️ Custom"}
          </button>
        ))}
      </div>

      {item.item_source === "INVENTORY" ? (
        <select
          value={item.inventory_item_id}
          onChange={(e) => onUpdate(index, "inventory_item_id", e.target.value)}
          className={FIELD}
        >
          <option value="">Select product</option>
          {inventory.map((p) => (
            <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
              {p.name} — Stock: {p.quantity} {p.quantity <= 0 ? "(Out)" : ""}
            </option>
          ))}
        </select>
      ) : (
        <input
          placeholder="Custom item name (e.g. Labour charge)"
          value={item.item_name}
          onChange={(e) => onUpdate(index, "item_name", e.target.value)}
          className={FIELD}
        />
      )}

      {stockInfo && (
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
            stockInfo.quantity <= 0
              ? "bg-red-50 text-red-700"
              : stockInfo.quantity <= 5
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {stockInfo.quantity <= 0
            ? "Out of stock"
            : `${stockInfo.quantity} ${stockInfo.unit || "pcs"} available`}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "QTY", field: "quantity", type: "number", placeholder: "1" },
          { label: "PRICE ₹", field: "price", type: "number", placeholder: "0" },
          { label: "UNIT", field: "unit", type: "text", placeholder: "pcs" },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field}>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={item[field]}
              onChange={(e) => onUpdate(index, field, e.target.value)}
              className={FIELD}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-sm font-semibold text-blue-600">{currency(lineTotal)}</span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-rose-500 transition hover:bg-rose-50"
          >
            <FaTrash className="text-[10px]" /> Remove
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Main Component ── */
const Bills = () => {
  const { currentBusiness } = useBusiness();
  const [rows, setRows]           = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [success, setSuccess]     = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [deletingId, setDeletingId]     = useState(null);
  const [confirmId, setConfirmId]       = useState(null);

  const [customerMode, setCustomerMode] = useState("walkin");
  const [walkinName,   setWalkinName]   = useState("");
  const [walkinPhone,  setWalkinPhone]  = useState("");
  const [existingId,   setExistingId]   = useState("");

  const [formData, setFormData] = useState({
    bill_number: autoInvNumber(),
    bill_date:   new Date().toISOString().split("T")[0],
    items:       [blankItem()],
  });

  const load = useCallback(async () => {
    if (!currentBusiness?.id) return;
    const [billRes, custRes, invRes] = await Promise.all([
      getBills(currentBusiness.id),
      getCustomers(currentBusiness.id),
      getInventoryItems(currentBusiness.id),
    ]);
    setRows(billRes.data || []);
    setCustomers(custRes.data || []);
    setInventory(invRes.data || []);
  }, [currentBusiness]);

  useEffect(() => { load(); }, [load]);

  const addItem = () =>
    setFormData((p) => ({ ...p, items: [...p.items, blankItem()] }));

  const removeItem = (idx) =>
    setFormData((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));

  const updateItem = (idx, field, value) => {
    setFormData((prev) => {
      const items = prev.items.map((it, i) => {
        if (i !== idx) return it;
        const updated = { ...it, [field]: value };
        if (field === "inventory_item_id") {
          const prod = inventory.find((p) => p.id === Number(value));
          if (prod) {
            updated.item_name = prod.name;
            updated.price     = Number(prod.selling_price || 0);
            updated.unit      = prod.unit || "pcs";
          }
        }
        if (field === "item_source") {
          updated.inventory_item_id = "";
          updated.item_name         = "";
          updated.price             = 0;
          updated.unit              = "pcs";
        }
        return updated;
      });
      return { ...prev, items };
    });
  };

  const grandTotal = formData.items.reduce(
    (s, it) => s + Number(it.quantity || 0) * Number(it.price || 0), 0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const item of formData.items) {
      if (item.item_source === "INVENTORY" && item.inventory_item_id) {
        const prod = inventory.find((p) => p.id === Number(item.inventory_item_id));
        if (prod && Number(item.quantity) > Number(prod.quantity)) {
          alert(`⚠️ Insufficient stock for "${prod.name}". Available: ${prod.quantity}`);
          return;
        }
      }
    }

    const isExisting  = customerMode === "existing" && existingId;
    const displayName = isExisting
      ? customers.find((c) => c.id === Number(existingId))?.name || "Walk-in"
      : walkinName.trim() || "Walk-in";

    const payload = {
      business_id:           currentBusiness.id,
      customer_id:           isExisting ? existingId : null,
      custom_customer_name:  !isExisting ? (walkinName.trim() || null) : null,
      custom_customer_phone: !isExisting ? (walkinPhone.trim() || null) : null,
      bill_number:           formData.bill_number,
      bill_date:             formData.bill_date,
      items:                 formData.items,
    };

    await createBill(payload);
    await load();

    setRows((prev) =>
      prev.map((r, i) =>
        i === 0 && !r.customer_name && !r.custom_customer_name
          ? { ...r, _displayName: displayName }
          : r
      )
    );

    setSuccess(true);
    setCustomerMode("walkin");
    setWalkinName("");
    setWalkinPhone("");
    setExistingId("");
    setFormData({
      bill_number: autoInvNumber(),
      bill_date:   new Date().toISOString().split("T")[0],
      items:       [blankItem()],
    });
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteBill(id, currentBusiness.id);
      await load();
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const totalRevenue = rows.reduce((s, r) => s + Number(r.total_amount || 0), 0);

  const getCustomerLabel = (r) => {
    const name = r._displayName || r.customer_name || r.custom_customer_name;
    if (name) return <span className="font-medium text-slate-800">{name}</span>;
    return <span className="italic text-slate-400 text-xs">Walk-in</span>;
  };

  return (
    <ModuleShell
      eyebrow="Billing"
      title="Bills"
      description="Generate invoices, manage bill history and track revenue."
    >
      {selectedBill && (
        <BillDrawer bill={selectedBill} onClose={() => setSelectedBill(null)} />
      )}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            ✓ Invoice created successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard label="Total bills"  value={rows.length}            icon={<FaFileInvoiceDollar />} accent="blue"    />
        <StatsCard label="Revenue"      value={currency(totalRevenue)} icon={<FaReceipt />}           accent="emerald" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-semibold text-slate-900">Create invoice</h2>
            <p className="mt-0.5 text-xs text-slate-400">Add items, select customer and generate bill.</p>
          </div>

          {/* Invoice number */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Invoice number
            </label>
            <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
              <span className="flex-1 text-sm font-medium text-slate-700">{formData.bill_number}</span>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, bill_number: autoInvNumber() }))}
                className="text-[10px] font-semibold text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Customer */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Customer
            </label>
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
              {[
                { key: "walkin",   label: "🚶 Walk-in / New" },
                { key: "existing", label: "👤 Existing" },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => { setCustomerMode(m.key); setWalkinName(""); setWalkinPhone(""); setExistingId(""); }}
                  className={`rounded-md py-2 text-xs font-semibold transition ${
                    customerMode === m.key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {customerMode === "walkin" && (
              <div className="space-y-2">
                <div className="relative">
                  <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                  <input
                    placeholder="Customer name (optional)"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <input
                  placeholder="Phone number (optional)"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  className={FIELD}
                />
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Will appear as:</span>
                  <span className="text-xs font-semibold text-slate-700">{walkinName.trim() || "Walk-in"}</span>
                </div>
              </div>
            )}

            {customerMode === "existing" && (
              <select value={existingId} onChange={(e) => setExistingId(e.target.value)} className={FIELD}>
                <option value="">Select customer…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.phone ? ` — ${c.phone}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Bill date */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Bill date
            </label>
            <input
              required
              type="date"
              value={formData.bill_date}
              onChange={(e) => setFormData((p) => ({ ...p, bill_date: e.target.value }))}
              className={FIELD}
            />
          </div>

          {/* Line items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Line items</label>
              <span className="text-[10px] text-slate-400">{formData.items.length} item{formData.items.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {formData.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  >
                    <ItemCard
                      item={item} index={idx} inventory={inventory}
                      onUpdate={updateItem} onRemove={removeItem}
                      canRemove={formData.items.length > 1}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 text-xs font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
            >
              <FaPlus className="text-[10px]" /> Add item
            </button>
          </div>

          {/* Grand total */}
          <div className="rounded-xl bg-slate-900 px-4 py-3 text-white">
            <p className="text-[11px] font-medium text-slate-400">Grand total</p>
            <p className="mt-0.5 text-xl font-bold">{currency(grandTotal)}</p>
          </div>

          <motion.button
            whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
            disabled={!currentBusiness}
            type="submit"
            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            <FaPlus className="text-xs" /> Create invoice
          </motion.button>
        </motion.form>

        {/* Table */}
        <RecordTable
          title="Billing records"
          searchable
          rows={rows}
          emptyText="No bills created yet."
          columns={[
            { key: "bill_number", label: "Invoice" },
            {
              key: "customer_name",
              label: "Customer",
              render: (r) => getCustomerLabel(r),
            },
            {
              key: "bill_date",
              label: "Date",
              render: (r) => shortDate(r.bill_date),
            },
            {
              key: "status",
              label: "Status",
              render: () => (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  Issued
                </span>
              ),
            },
            {
              key: "total_amount",
              label: "Amount",
              render: (r) => (
                <span className="font-semibold text-emerald-700">{currency(r.total_amount)}</span>
              ),
            },
            {
              key: "actions",
              label: "",
              render: (r) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBill(r)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                  >
                    View →
                  </button>

                  {confirmId === r.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        className="rounded-md bg-rose-600 px-2 py-1 text-[10px] font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                      >
                        {deletingId === r.id ? "…" : "Confirm"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(r.id)}
                      className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500"
                      title="Delete bill"
                    >
                      <FaTrash className="text-[10px]" />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </ModuleShell>
  );
};

export default Bills;