import { useCallback, useEffect, useState } from "react";
import {
  FaBook,
  FaCreditCard,
  FaIndianRupeeSign,
  FaPlus,
  FaUsers,
} from "react-icons/fa6";

import FeatureWorkspace from "../components/common/FeatureWorkspace";
import RecordTable from "../components/common/RecordTable";
import { useBusiness } from "../hooks/useBusiness";
import {
  createLedgerEntry,
  getKhataSummary,
  getCustomers,
} from "../services/module.service";
import { currency } from "../utils/formatters";

const FIELD =
  "h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

const Khata = () => {
  const { currentBusiness } = useBusiness();
  const [rows, setRows] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: "",
    entry_type: "CREDIT",
    amount: "",
    description: "",
    entry_date: "",
  });

  const loadRows = useCallback(async () => {
    if (!currentBusiness?.id) return;
    const [khataResponse, customerResponse] = await Promise.all([
      getKhataSummary(currentBusiness.id),
      getCustomers(currentBusiness.id),
    ]);
    setRows(khataResponse.data || []);
    setCustomers(customerResponse.data || []);
  }, [currentBusiness]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createLedgerEntry({
        ...formData,
        customer_id: Number(formData.customer_id),
        amount: Number(formData.amount),
        business_id: currentBusiness.id,
      });
      setFormData({
        customer_id: "",
        entry_type: "CREDIT",
        amount: "",
        description: "",
        entry_date: "",
      });
      await loadRows();
    } catch (error) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.message || "Failed to create ledger entry");
    }
  };

  const set = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  const totalBalance = rows.reduce(
    (sum, row) => sum + Number(row.balance || 0),
    0
  );

  return (
    <FeatureWorkspace
      eyebrow="Khata"
      title="Customer Khata"
      description="Track credit, debit, and running balance across all customers from one clean ledger."
      icon={<FaBook />}
      stats={[
        { label: "Customers", value: rows.length },
        { label: "Balance", value: currency(totalBalance) },
        { label: "Ledger", value: "Live" },
      ]}
      cards={[
        {
          icon: <FaUsers />,
          title: "Customer-wise ledger",
          description:
            "Every entry links to a customer so pending amounts stay easy to track.",
          tag: "Backend API",
        },
        {
          icon: <FaCreditCard />,
          title: "Credit and debit",
          description:
            "Record money given and money received with clear entry type labels.",
          tag: "Khata",
        },
      ]}
    >
      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 border-b border-slate-100 pb-3.5 text-sm font-semibold text-slate-900">
            Add ledger entry
          </h2>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Customer <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.customer_id}
                onChange={set("customer_id")}
                className={FIELD}
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                    {customer.phone ? ` (${customer.phone})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Entry type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["CREDIT", "DEBIT"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, entry_type: type }))}
                    className={`h-9 rounded-lg border text-xs font-semibold transition ${
                      formData.entry_type === type
                        ? type === "CREDIT"
                          ? "border-emerald-500 bg-emerald-600 text-white"
                          : "border-rose-500 bg-rose-600 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {type === "CREDIT" ? "Credit (received)" : "Debit (given)"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Amount <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="number"
                placeholder="₹0"
                value={formData.amount}
                onChange={set("amount")}
                className={FIELD}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="date"
                value={formData.entry_date}
                onChange={set("entry_date")}
                className={FIELD}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                placeholder="Optional note about this entry"
                value={formData.description}
                onChange={set("description")}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="border-t border-slate-100 pt-1">
              <button
                disabled={!currentBusiness}
                type="submit"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <FaPlus className="text-xs" />
                Add entry
              </button>
            </div>
          </div>
        </form>

        {/* Table */}
        <RecordTable
          rows={rows}
          emptyText="No khata records yet."
          columns={[
            { key: "name", label: "Customer" },
            { key: "phone", label: "Phone" },
            {
              key: "credit",
              label: "Credit",
              render: (row) => (
                <span className="font-medium text-emerald-600">{currency(row.credit)}</span>
              ),
            },
            {
              key: "debit",
              label: "Debit",
              render: (row) => (
                <span className="font-medium text-rose-500">{currency(row.debit)}</span>
              ),
            },
            {
              key: "balance",
              label: "Balance",
              render: (row) => (
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                  <FaIndianRupeeSign className="text-[11px]" />
                  {currency(row.balance)}
                </span>
              ),
            },
          ]}
        />
      </div>
    </FeatureWorkspace>
  );
};

export default Khata;