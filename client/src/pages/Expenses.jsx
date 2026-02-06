import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendar, FaPlus, FaWallet } from "react-icons/fa6";

import ModuleShell from "../components/common/ModuleShell";
import MoneyBurst from "../components/common/MoneyBurst";
import RecordTable from "../components/common/RecordTable";
import StatsCard from "../components/dashboard/StatsCard";
import { useBusiness } from "../hooks/useBusiness";
import { createExpense, getExpenses } from "../services/module.service";
import { currency, shortDate } from "../utils/formatters";

const Expenses = () => {
  const { currentBusiness } = useBusiness();
  const [rows, setRows] = useState([]);
  const [moneyBurst, setMoneyBurst] = useState(false);
  const [lastAmount, setLastAmount] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    expense_date: "",
  });

  const loadRows = useCallback(async () => {
    if (!currentBusiness?.id) return;
    const response = await getExpenses(currentBusiness.id);
    setRows(response.data || []);
  }, [currentBusiness]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createExpense({ ...formData, business_id: currentBusiness.id });
    setLastAmount(Number(formData.amount).toLocaleString("en-IN"));
    setMoneyBurst(true);
    setTimeout(() => setMoneyBurst(false), 1500);
    setFormData({ amount: "", category: "", description: "", expense_date: "" });
    await loadRows();
  };

  const totalExpense = rows.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <ModuleShell
      eyebrow="Finance"
      title="Expense Management"
      description="Track rent, salaries, purchases, utilities and every outgoing payment."
    >
      <MoneyBurst show={moneyBurst} tone="rose" amount={lastAmount} label="Expense Added" />

      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Total Expenses"
          value={currency(totalExpense)}
          note="Recorded spend"
          icon={<FaWallet />}
          tone="rose"
        />
        <StatsCard
          title="Transactions"
          value={rows.length}
          note="Expense records"
          icon={<FaCalendar />}
          tone="blue"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-base font-bold text-slate-900">Add Expense</h2>
<p className="mt-0.5 text-xs text-slate-400">Record outgoing business payments.</p>

          <div className="mt-5 space-y-4">
            <input
              type="number"
              required
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
            />
            <input
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
            />
            <input
              type="date"
              required
              value={formData.expense_date}
              onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-20 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={!currentBusiness}
              type="submit"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <FaPlus />
              Add Expense
            </motion.button>
          </div>
        </motion.form>

        <RecordTable
          title="Expense Records"
          searchable
          rows={rows}
          emptyText="No expense records found."
          columns={[
            { key: "category", label: "Category" },
            { key: "description", label: "Description" },
            {
              key: "expense_date",
              label: "Date",
              render: (row) => shortDate(row.expense_date),
            },
            {
              key: "amount",
              label: "Amount",
              render: (row) => (
                <span className="font-black text-slate-900">{currency(row.amount)}</span>
              ),
            },
          ]}
        />
      </div>
    </ModuleShell>
  );
};

export default Expenses;
