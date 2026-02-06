import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendar, FaPlus } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";

import ModuleShell  from "../components/common/ModuleShell";
import MoneyBurst   from "../components/common/MoneyBurst";
import RecordTable  from "../components/common/RecordTable";
import StatsCard    from "../components/dashboard/StatsCard";
import { useBusiness } from "../hooks/useBusiness";
import { createIncome, getIncome } from "../services/module.service";
import { currency, shortDate } from "../utils/formatters";

const FIELD = "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white bg-slate-50";

const Income = () => {
  const { currentBusiness } = useBusiness();
  const [rows, setRows]           = useState([]);
  const [burst, setBurst]         = useState(false);
  const [lastAmount, setLastAmount] = useState("");
  const [formData, setFormData]   = useState({ amount: "", category: "", description: "", income_date: "" });

  const load = useCallback(async () => {
    if (!currentBusiness?.id) return;
    const r = await getIncome(currentBusiness.id);
    setRows(r.data || []);
  }, [currentBusiness]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createIncome({ ...formData, business_id: currentBusiness.id });
    setLastAmount(Number(formData.amount).toLocaleString("en-IN"));
    setBurst(true);
    setTimeout(() => setBurst(false), 1500);
    setFormData({ amount: "", category: "", description: "", income_date: "" });
    load();
  };

  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <ModuleShell
      eyebrow="Finance"
      title="Income"
      description="Record sales, service payments and all money entering your business."
    >
      <MoneyBurst show={burst} tone="green" amount={lastAmount} label="Income Added" />

      <div className="grid grid-cols-2 gap-3">
        <StatsCard label="Total Income"   value={currency(total)}  icon={<FaArrowTrendUp />} accent="emerald" />
        <StatsCard label="Transactions"   value={rows.length}       icon={<FaCalendar />}     accent="blue"    />
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-base font-bold text-slate-900">Add Income</h2>
          <p className="mt-1 text-xs text-slate-500">Record money received from customers or sales.</p>
          <div className="mt-4 space-y-3">
            <input required type="number" placeholder="Amount (₹)" value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={FIELD} />
            <input placeholder="Category (Sales, Service…)" value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={FIELD} />
            <input required type="date" value={formData.income_date}
              onChange={(e) => setFormData({ ...formData, income_date: e.target.value })} className={FIELD} />
            <textarea placeholder="Description (optional)" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-20 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-500 focus:bg-white" />
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
              disabled={!currentBusiness} type="submit"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              <FaPlus className="text-xs" /> Add Income
            </motion.button>
          </div>
        </motion.form>

        {/* Table */}
        <RecordTable
          title="Income Records"
          searchable
          rows={rows}
          emptyText="No income records yet."
          columns={[
            { key: "category",    label: "Category" },
            { key: "description", label: "Description" },
            { key: "income_date", label: "Date",   render: (r) => shortDate(r.income_date) },
            { key: "amount",      label: "Amount", render: (r) => <span className="font-bold text-emerald-700">{currency(r.amount)}</span> },
          ]}
        />
      </div>
    </ModuleShell>
  );
};

export default Income;