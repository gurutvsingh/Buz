import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaClock, FaPlus } from "react-icons/fa6";

import EmptyState  from "../components/common/EmptyState";
import ModuleShell from "../components/common/ModuleShell";
import { useBusiness } from "../hooks/useBusiness";
import { createReminder, getReminders } from "../services/module.service";
import { currency, shortDate } from "../utils/formatters";

const PRIORITY_STYLES = {
  LOW:    { badge: "bg-slate-100 text-slate-600",  card: "border-slate-200",  dot: "bg-slate-400"  },
  MEDIUM: { badge: "bg-blue-50  text-blue-700",    card: "border-blue-100",   dot: "bg-blue-500"   },
  HIGH:   { badge: "bg-red-50   text-red-700",     card: "border-red-100",    dot: "bg-red-500"    },
};

const FIELD = "h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white";

const Reminders = () => {
  const { currentBusiness } = useBusiness();
  const [rows, setRows]       = useState([]);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", due_date: "", priority: "MEDIUM", amount: "",
  });

  const load = useCallback(async () => {
    if (!currentBusiness?.id) return;
    const r = await getReminders(currentBusiness.id);
    setRows(r.data || []);
  }, [currentBusiness]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createReminder({ ...formData, business_id: currentBusiness.id });
    setFormData({ title: "", description: "", due_date: "", priority: "MEDIUM", amount: "" });
    await load();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
  };

  return (
    <ModuleShell
      eyebrow="Operations"
      title="Reminders"
      description="Never miss payments, follow-ups, due dates and business tasks."
    >
      {success && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
        >
          Reminder created
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-base font-bold text-slate-900">Create Reminder</h2>
          <p className="mt-1 text-xs text-slate-500">Set due dates, priority and amounts.</p>
          <div className="mt-4 space-y-3">
            <input required placeholder="Reminder title" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={FIELD} />
            <textarea placeholder="Description (optional)" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-16 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-500 focus:bg-white" />
            <input required type="date" value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} className={FIELD} />
            <select value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className={FIELD}
            >
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
            </select>
            <input type="number" placeholder="Amount (optional)" value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={FIELD} />
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
              disabled={!currentBusiness} type="submit"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              <FaPlus className="text-xs" /> Create Reminder
            </motion.button>
          </div>
        </motion.form>

        {/* Kanban columns */}
        <section>
          <h2 className="mb-4 text-base font-bold text-slate-900">
            Active Reminders
            <span className="ml-2 text-xs font-semibold text-slate-400">{rows.length} total</span>
          </h2>
          {rows.length ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {["LOW", "MEDIUM", "HIGH"].map((p) => {
                const s = PRIORITY_STYLES[p];
                const filtered = rows.filter((r) => r.priority === p);
                return (
                  <div key={p} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                    <div className={`mb-3 flex items-center gap-2 rounded-lg px-3 py-1.5 ${s.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      <span className="text-xs font-bold">{p}</span>
                      <span className="ml-auto text-xs font-semibold opacity-60">{filtered.length}</span>
                    </div>
                    <div className="space-y-2">
                      {filtered.length ? filtered.map((row) => (
                        <motion.article key={row.id} whileHover={{ y: -1 }}
                          className={`rounded-xl border bg-white p-3 shadow-sm ${s.card}`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 text-xs">
                              <FaBell />
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate text-xs font-bold text-slate-900">{row.title}</h3>
                              {row.description && (
                                <p className="mt-0.5 text-[11px] leading-4 text-slate-500 line-clamp-2">
                                  {row.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                            <FaClock className="text-[10px]" />
                            {shortDate(row.due_date)}
                            {row.amount && <span className="ml-auto">{currency(row.amount)}</span>}
                          </div>
                        </motion.article>
                      )) : (
                        <p className="py-4 text-center text-xs text-slate-400">No {p.toLowerCase()} reminders</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No Reminders Yet" description="Create your first reminder to track deadlines." />
          )}
        </section>
      </div>
    </ModuleShell>
  );
};

export default Reminders;