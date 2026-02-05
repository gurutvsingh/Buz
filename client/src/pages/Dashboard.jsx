import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  FaArrowTrendUp, FaBell, FaMoneyBillWave,
  FaReceipt, FaUsers, FaWallet, FaBuilding, FaArrowRight,
} from "react-icons/fa6";
import { motion } from "framer-motion";

import StatsCard  from "../components/dashboard/StatsCard";
import EmptyState from "../components/common/EmptyState";
import { useBusiness } from "../hooks/useBusiness";
import { getDashboard } from "../services/module.service";
import { currency } from "../utils/formatters";

const DEMO_CHART = [
  { month: "Jan", income: 42000, expense: 19000 },
  { month: "Feb", income: 52000, expense: 26000 },
  { month: "Mar", income: 61000, expense: 28000 },
  { month: "Apr", income: 72000, expense: 31000 },
  { month: "May", income: 84000, expense: 36000 },
];

const QUICK_ACTIONS = [
  { title: "Add Income",   icon: <FaMoneyBillWave />, iconBg: "bg-emerald-100 text-emerald-700", path: "/income"    },
  { title: "Add Expense",  icon: <FaWallet />,         iconBg: "bg-rose-100 text-rose-600",       path: "/expenses"  },
  { title: "Set Reminder", icon: <FaBell />,            iconBg: "bg-amber-100 text-amber-600",     path: "/reminders" },
  { title: "Add Customer", icon: <FaUsers />,           iconBg: "bg-blue-100 text-blue-600",       path: "/customers" },
];

const TAG = "rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white";

const Dashboard = () => {
  const { currentBusiness } = useBusiness();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!currentBusiness?.id) return;
    getDashboard(currentBusiness.id)
      .then((r) => setSummary(r.data))
      .catch(() => setSummary(null));
  }, [currentBusiness]);

  const cards = useMemo(() => [
    { label: "Total Income",    value: currency(summary?.totalIncome),    icon: <FaArrowTrendUp />, accent: "emerald", trend: { up: true,  label: "12% this month"   } },
    { label: "Total Expenses",  value: currency(summary?.totalExpense),   icon: <FaWallet />,        accent: "rose",    trend: { up: false, label: "3% vs last month"  } },
    { label: "Net Profit",      value: currency(summary?.netProfit),      icon: <FaReceipt />,       accent: "blue",    trend: { up: true,  label: "18% vs last month" } },
    { label: "Customers",       value: summary?.totalCustomers ?? 0,      icon: <FaUsers />,          accent: "amber",   trend: { up: true,  label: "4 new this week"   } },
  ], [summary]);

  if (!currentBusiness) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-blue-700 p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">Welcome to BUZ</p>
          <h2 className="mt-2 text-xl font-black tracking-tight">Your Business Command Center</h2>
          <p className="mt-1.5 max-w-lg text-[13px] leading-6 text-blue-200">
            Create a business to unlock income, expenses, billing, reminders and analytics.
          </p>
          <button
            onClick={() => navigate("/businesses")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[13px] font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Create Business <FaArrowRight />
          </button>
        </div>
        <EmptyState
          title="No Business Selected"
          description="Create or select a business from the navbar to get started."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Hero */}
      <div className="rounded-2xl bg-blue-700 p-5 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">
              Business Command Center
            </p>
            <h2 className="text-xl font-black tracking-tight lg:text-2xl">
              {currentBusiness.name}
            </h2>
            <p className="mt-1.5 max-w-lg text-[13px] leading-6 text-blue-200">
              Track income, expenses, billing, reminders and customers from one clean dashboard.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["BUZ Cloud", "JWT Protected", "MySQL Live"].map((tag) => (
                <span key={tag} className={TAG}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-row gap-2 lg:w-44 lg:flex-col">
            <button
              onClick={() => navigate("/income")}
              className="flex flex-1 lg:flex-none items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-[13px] font-bold text-blue-700 transition hover:bg-blue-50 whitespace-nowrap"
            >
              <FaMoneyBillWave className="shrink-0" /> Add Income
            </button>
            <button
              onClick={() => navigate("/businesses")}
              className="flex flex-1 lg:flex-none items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-white/20 whitespace-nowrap"
            >
              <FaBuilding className="shrink-0" /> Manage
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((card) => <StatsCard key={card.label} {...card} />)}
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-2.5 text-[13px] font-bold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <motion.button
              key={action.title}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition hover:shadow-sm"
            >
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[13px] ${action.iconBg}`}>
                {action.icon}
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-900">{action.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Quick entry</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-[13px] font-bold text-slate-900">Income vs Expense</h2>
          <p className="mt-0.5 text-[11px] text-slate-400">Monthly business movement</p>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_CHART} barCategoryGap="32%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => currency(v)} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="income"  fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#fca5a5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="inline-block h-2 w-2 rounded-sm bg-blue-600" /> Income
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="inline-block h-2 w-2 rounded-sm bg-red-300" /> Expense
            </span>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-[13px] font-bold text-slate-900">Profit Trend</h2>
          <p className="mt-0.5 text-[11px] text-slate-400">Profit growth overview</p>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMO_CHART.map((d) => ({ ...d, profit: d.income - d.expense }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => currency(v)} cursor={{ stroke: "#e2e8f0" }} />
                <Line type="monotone" dataKey="profit" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-[13px] font-bold text-slate-900">Recent Activity</h2>
        <div className="divide-y divide-slate-100">
          {[
            { text: "Dashboard summary refreshed",                              color: "bg-blue-500"    },
            { text: "Financial charts updated",                                 color: "bg-emerald-500" },
            { text: `Business workspace active — ${currentBusiness.name}`,     color: "bg-amber-400"   },
          ].map((item) => (
            <div key={item.text} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.color}`} />
                <p className="text-[13px] font-medium text-slate-700">{item.text}</p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Now</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;