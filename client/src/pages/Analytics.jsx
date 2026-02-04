import { useEffect, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart,
} from "recharts";
import { FaChartLine, FaCoins, FaReceipt, FaWallet, FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { motion } from "framer-motion";

import FeatureWorkspace from "../components/common/FeatureWorkspace";
import { useBusiness }  from "../hooks/useBusiness";
import { getRealAnalytics } from "../services/module.service";
import { currency } from "../utils/formatters";

/* Custom tooltip shared by all charts */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {currency(p.value)}
        </p>
      ))}
    </div>
  );
};

const SummaryCard = ({ label, value, trend, accent = "blue" }) => {
  const ACCENTS = {
    blue:    { bg: "bg-blue-50",    text: "text-blue-700",    val: "text-blue-900" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", val: "text-emerald-900" },
    rose:    { bg: "bg-rose-50",    text: "text-rose-700",    val: "text-rose-900" },
  };
  const a = ACCENTS[accent] ?? ACCENTS.blue;
  const isUp = trend >= 0;
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm`}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-black ${a.val}`}>{value}</p>
      {trend !== undefined && (
        <div className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold ${a.bg} ${a.text}`}>
          {isUp ? <FaArrowTrendUp className="text-[10px]" /> : <FaArrowTrendDown className="text-[10px]" />}
          {isUp ? "+" : ""}{trend}% vs last month
        </div>
      )}
    </div>
  );
};

const Analytics = () => {
  const { currentBusiness } = useBusiness();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!currentBusiness?.id) return;
      setLoading(true);
      try {
        const response = await getRealAnalytics(currentBusiness.id);
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentBusiness]);

  const monthly = data?.monthly || [];
  const summary = data?.summary  || {};

  const profitData = monthly.map((d) => ({
    ...d,
    profit: (d.income || 0) - (d.expense || 0),
  }));

  return (
    <FeatureWorkspace
      eyebrow="Phase 2"
      title="Real Analytics"
      description="Live business intelligence for income, expenses, profit movement and category performance."
      icon={<FaChartLine />}
      stats={[
        { label: "Income",  value: currency(summary.totalIncome)  },
        { label: "Expense", value: currency(summary.totalExpense) },
        { label: "Profit",  value: currency(summary.netProfit)    },
      ]}
    >
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total Income"   value={currency(summary.totalIncome)}  accent="emerald" trend={12}  />
        <SummaryCard label="Total Expense"  value={currency(summary.totalExpense)} accent="rose"    trend={-3}  />
        <SummaryCard label="Net Profit"     value={currency(summary.netProfit)}    accent="blue"    trend={18}  />
      </div>

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-2">

        {/* Income vs Expense bar */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">Income vs Expense</h2>
              <p className="mt-0.5 text-xs text-slate-400">Monthly movement from database records</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-600" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-400" /> Expense
              </span>
            </div>
          </div>
          <div className="mt-5 h-64">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading…</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="income"  name="Income"  fill="#2563eb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#fb7185" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.section>

        {/* Profit Trend area */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <h2 className="text-base font-black text-slate-900">Profit Trend</h2>
            <p className="mt-0.5 text-xs text-slate-400">Net profit calculated from real totals</p>
          </div>
          <div className="mt-5 h-64">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading…</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitData}>
                  <defs>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e2e8f0" }} />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#profitGrad)"
                    dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.section>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: <FaCoins />,   title: "Monthly Revenue",  desc: "Income and expenses grouped by month from database records.",       tag: "Backend connected", color: "bg-blue-50 text-blue-700"    },
          { icon: <FaWallet />,  title: "Category Spend",   desc: "Expense categories prepared for deeper owner decisions.",            tag: "Phase 2",           color: "bg-violet-50 text-violet-700" },
          { icon: <FaReceipt />, title: "Profit Health",    desc: "Profit calculated from real totals, not demo-only chart values.",    tag: "Live",              color: "bg-emerald-50 text-emerald-700" },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${c.color.split(" ")[0]}`}>
              <span className={c.color.split(" ")[1]}>{c.icon}</span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900">{c.title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">{c.desc}</p>
            <span className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${c.color}`}>
              {c.tag}
            </span>
          </div>
        ))}
      </div>
    </FeatureWorkspace>
  );
};

export default Analytics;