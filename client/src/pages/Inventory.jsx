import { useCallback, useEffect, useState } from "react";
import {
  FaBoxesStacked,
  FaFloppyDisk,
  FaPen,
  FaPlus,
  FaTrash,
  FaTriangleExclamation,
  FaXmark,
} from "react-icons/fa6";

import FeatureWorkspace from "../components/common/FeatureWorkspace";
import RecordTable from "../components/common/RecordTable";
import { useBusiness } from "../hooks/useBusiness";

import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItems,
  updateInventoryItem,
} from "../services/module.service";

const FIELD =
  "h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

const Inventory = () => {
  const { currentBusiness } = useBusiness();

  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: "",
    low_stock_limit: "",
    unit: "pcs",
    selling_price: "",
    purchase_price: "",
  });

  const loadRows = useCallback(async () => {
    if (!currentBusiness?.id) return;
    const response = await getInventoryItems(currentBusiness.id);
    setRows(response.data || []);
  }, [currentBusiness]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...formData,
      business_id: currentBusiness.id,
      quantity: Number(formData.quantity || 0),
      low_stock_limit: Number(formData.low_stock_limit || 0),
      selling_price: Number(formData.selling_price || 0),
      purchase_price: Number(formData.purchase_price || 0),
    };
    if (editingId) {
      await updateInventoryItem(editingId, payload);
    } else {
      await createInventoryItem(payload);
    }
    resetForm();
    await loadRows();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      quantity: "",
      low_stock_limit: "",
      unit: "pcs",
      selling_price: "",
      purchase_price: "",
    });
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || "",
      sku: item.sku || "",
      quantity: item.quantity ?? "",
      low_stock_limit: item.low_stock_limit ?? "",
      unit: item.unit || "pcs",
      selling_price: item.selling_price ?? "",
      purchase_price: item.purchase_price ?? "",
    });
  };

  const removeItem = async (id) => {
    await deleteInventoryItem(id, currentBusiness.id);
    await loadRows();
  };

  const lowStock = rows.filter(
    (item) => Number(item.quantity) <= Number(item.low_stock_limit || 0)
  ).length;

  const set = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  return (
    <FeatureWorkspace
      eyebrow="Inventory"
      title="Inventory"
      description="Manage stock, units, purchase cost and selling price."
      icon={<FaBoxesStacked />}
      stats={[
        { label: "Items", value: rows.length },
        { label: "Low stock", value: lowStock },
        { label: "Status", value: "Live" },
      ]}
    >
      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 border-b border-slate-100 pb-3.5 text-sm font-semibold text-slate-900">
            {editingId ? "Update item" : "Add item"}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Item name <span className="text-rose-500">*</span>
              </label>
              <input required placeholder="e.g. Cotton shirt" value={formData.name} onChange={set("name")} className={FIELD} />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">SKU</label>
              <input placeholder="e.g. SKU-0042" value={formData.sku} onChange={set("sku")} className={FIELD} />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Quantity <span className="text-rose-500">*</span>
                </label>
                <input required type="number" placeholder="0" value={formData.quantity} onChange={set("quantity")} className={FIELD} />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Low stock alert</label>
                <input type="number" placeholder="5" value={formData.low_stock_limit} onChange={set("low_stock_limit")} className={FIELD} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Unit</label>
              <select value={formData.unit} onChange={set("unit")} className={FIELD}>
                <option value="pcs">Pieces</option>
                <option value="kg">Kilogram</option>
                <option value="ltr">Litre</option>
                <option value="box">Box</option>
                <option value="pack">Pack</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Selling price</label>
                <input type="number" placeholder="₹0" value={formData.selling_price} onChange={set("selling_price")} className={FIELD} />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Purchase price</label>
                <input type="number" placeholder="₹0" value={formData.purchase_price} onChange={set("purchase_price")} className={FIELD} />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-1">
              <button
                disabled={!currentBusiness}
                type="submit"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {editingId ? <FaFloppyDisk className="text-xs" /> : <FaPlus className="text-xs" />}
                {editingId ? "Save item" : "Add item"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <FaXmark className="text-xs" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Table */}
        <RecordTable
          rows={rows}
          emptyText="No inventory items yet."
          columns={[
            { key: "name", label: "Item" },
            { key: "sku", label: "SKU" },
            {
              key: "quantity",
              label: "Stock",
              render: (row) => {
                const isLow = Number(row.quantity) <= Number(row.low_stock_limit || 0);
                return (
                  <span className={isLow ? "font-medium text-amber-600" : "font-medium text-emerald-600"}>
                    {row.quantity} {row.unit || "pcs"}
                  </span>
                );
              },
            },
            {
              key: "selling_price",
              label: "Sell price",
              render: (row) => `₹${row.selling_price || 0}`,
            },
            {
              key: "purchase_price",
              label: "Buy price",
              render: (row) => `₹${row.purchase_price || 0}`,
            },
            {
              key: "low_stock_limit",
              label: "Alert",
              render: (row) => (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                  <FaTriangleExclamation className="text-[10px]" />
                  {row.low_stock_limit || 0}
                </span>
              ),
            },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => startEdit(row)}
                    className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <FaPen className="text-[11px]" />
                  </button>
                  <button
                    onClick={() => removeItem(row.id)}
                    className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <FaTrash className="text-[11px]" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </FeatureWorkspace>
  );
};

export default Inventory;