import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt, FaCalendarDay, FaCalendarWeek,
  FaCheck, FaPlus, FaTrash,
} from "react-icons/fa";

import EmptyState  from "../components/common/EmptyState";
import ModuleShell from "../components/common/ModuleShell";
import StatsCard   from "../components/dashboard/StatsCard";
import { useBusiness } from "../hooks/useBusiness";
import { createChecklist, getChecklists } from "../services/module.service";
import { shortDate } from "../utils/formatters";

const FREQ_ICON  = {
  DAILY:   <FaCalendarDay />,
  WEEKLY:  <FaCalendarWeek />,
  MONTHLY: <FaCalendarAlt />,
};
const FREQ_COLOR = {
  DAILY:   "bg-blue-50 text-blue-700 border-blue-100",
  WEEKLY:  "bg-violet-50 text-violet-700 border-violet-100",
  MONTHLY: "bg-amber-50 text-amber-700 border-amber-100",
};

const FIELD = "h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white";

const Checklists = () => {
  const { currentBusiness } = useBusiness();
  const [rows, setRows]         = useState([]);
  const [checked, setChecked]   = useState({});   // { [id]: boolean }
  const [success, setSuccess]   = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", frequency: "DAILY",
  });

  const load = useCallback(async () => {
    if (!currentBusiness?.id) return;
    const r = await getChecklists(currentBusiness.id);
    setRows(r.data || []);
  }, [currentBusiness]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createChecklist({ ...formData, business_id: currentBusiness.id });
    setFormData({ title: "", description: "", frequency: "DAILY" });
    await load();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const toggleChecked = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const removeLocal = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setChecked((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const dailyPct = useMemo(() => {
    if (!rows.length) return 0;
    return Math.round(
      (rows.filter((r) => r.frequency === "DAILY").length / rows.length) * 100
    );
  }, [rows]);

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <ModuleShell
      eyebrow="Operations"
      title="Checklists"
      description="Standardize daily, weekly and monthly business operations."
    >
      {/* Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
          >
            ✓ Checklist created successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatsCard label="Total Tasks"    value={rows.length}    icon={<FaCheck />}       accent="blue"    />
        <StatsCard label="Completed"      value={doneCount}      icon={<FaCheck />}       accent="emerald" />
        <StatsCard label="Remaining"      value={rows.length - doneCount} icon={<FaCalendarDay />} accent="amber" />
        <StatsCard label="Daily Coverage" value={`${dailyPct}%`} icon={<FaCalendarAlt />} accent="rose"    />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">

        {/* ── Form ── */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <h2 className="text-base font-bold text-slate-900">Create Checklist</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Build recurring workflows for your team.
          </p>
          <div className="mt-4 space-y-3">
            <input
              required
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={FIELD}
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[72px] w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-500 focus:bg-white resize-none"
            />
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className={FIELD}
            >
              <option>DAILY</option>
              <option>WEEKLY</option>
              <option>MONTHLY</option>
            </select>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              disabled={!currentBusiness}
              type="submit"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <FaPlus className="text-xs" /> Add Task
            </motion.button>
          </div>

          {/* Progress bar */}
          {rows.length > 0 && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Session Progress
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {doneCount}/{rows.length}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="h-full rounded-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${rows.length ? (doneCount / rows.length) * 100 : 0}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              {doneCount === rows.length && rows.length > 0 && (
                <p className="mt-2 text-xs font-bold text-emerald-600">
                  ✓ All tasks completed!
                </p>
              )}
            </div>
          )}
        </motion.form>

        {/* ── Task list ── */}
        <section>
          {/* Frequency filter pills */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 mr-2">Task Workflows</h2>
            {["DAILY", "WEEKLY", "MONTHLY"].map((f) => {
              const count = rows.filter((r) => r.frequency === f).length;
              if (!count) return null;
              return (
                <span
                  key={f}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${FREQ_COLOR[f]}`}
                >
                  {FREQ_ICON[f]} {f} · {count}
                </span>
              );
            })}
          </div>

          {rows.length ? (
            <div className="space-y-2">
              <AnimatePresence>
                {rows.map((row) => {
                  const done = !!checked[row.id];
                  return (
                    <motion.article
                      key={row.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`flex items-start gap-3 rounded-xl border bg-white p-4 transition
                        ${done
                          ? "border-emerald-100 bg-emerald-50/40"
                          : "border-slate-200 hover:border-slate-300"
                        }`}
                    >
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleChecked(row.id)}
                        aria-label={done ? "Mark incomplete" : "Mark complete"}
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition
                          ${done
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 hover:border-blue-400"
                          }`}
                      >
                        {done && <FaCheck className="text-[9px]" />}
                      </button>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-sm font-bold transition ${
                              done ? "line-through text-slate-400" : "text-slate-900"
                            }`}
                          >
                            {row.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${FREQ_COLOR[row.frequency]}`}
                          >
                            {FREQ_ICON[row.frequency]} {row.frequency}
                          </span>
                          {done && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              Done
                            </span>
                          )}
                        </div>
                        {row.description && (
                          <p className={`mt-1 text-xs leading-5 ${done ? "text-slate-400" : "text-slate-500"}`}>
                            {row.description}
                          </p>
                        )}
                        <p className="mt-1.5 text-[11px] text-slate-400">
                          Created {shortDate(row.created_at)}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeLocal(row.id)}
                        aria-label="Remove task"
                        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <FaTrash className="text-[10px]" />
                      </button>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState
              title="No Tasks Yet"
              description="Create your first checklist task to standardize operations."
            />
          )}
        </section>
      </div>
    </ModuleShell>
  );
};

export default Checklists;