import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendar, FaEnvelope, FaPlus, FaShieldHalved,
  FaUserTie, FaMagnifyingGlass, FaTrash,
} from "react-icons/fa6";

import EmptyState  from "../components/common/EmptyState";
import ModuleShell from "../components/common/ModuleShell";
import { useBusiness } from "../hooks/useBusiness";
import { createEmployee, deleteEmployee, getEmployees } from "../services/module.service";
import { shortDate } from "../utils/formatters";

const FIELD =
  "h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

const avatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];
const initials    = (name) => name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const Employees = () => {
  const { currentBusiness } = useBusiness();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch]       = useState("");
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId]   = useState(null);
  const [formData, setFormData]   = useState({ name: "", email: "", password: "" });

  const set = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  const load = useCallback(async () => {
    if (!currentBusiness?.id) return;
    const r = await getEmployees(currentBusiness.id);
    setEmployees(r.data || []);
  }, [currentBusiness]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createEmployee({ ...formData, business_id: currentBusiness.id });
      setFormData({ name: "", email: "", password: "" });
      await load();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteEmployee(id, currentBusiness.id);
      await load();
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const filtered = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModuleShell
      eyebrow="Team"
      title="Employees"
      description="Manage staff accounts and business access for your team."
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <StatPill label="Team size" value={employees.length} color="blue" />
        <StatPill label="Active" value={employees.length} color="emerald" />
        <StatPill
          label="Added this month"
          value={employees.filter((e) => {
            const d = new Date(e.created_at);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length}
          color="violet"
          className="hidden sm:flex"
        />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            <span>✓</span> Employee account created. Share credentials securely.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <FaUserTie className="text-sm" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Add employee</h2>
              <p className="text-xs text-slate-400">Create a staff account for this business.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Full name <span className="text-rose-500">*</span>
              </label>
              <input required placeholder="e.g. Priya Sharma" value={formData.name} onChange={set("name")} className={FIELD} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Email address <span className="text-rose-500">*</span>
              </label>
              <input required type="email" placeholder="priya@yourcompany.com" value={formData.email} onChange={set("email")} className={FIELD} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Temporary password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={set("password")}
                  className={FIELD + " pr-14"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">Ask the employee to change this after first login.</p>
            </div>

            <div className="border-t border-slate-100 pt-1">
              <motion.button
                whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                disabled={!currentBusiness || saving}
                type="submit"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <FaPlus className="text-xs" />
                {saving ? "Creating…" : "Create employee"}
              </motion.button>
            </div>
          </div>
        </motion.form>

        {/* Directory */}
        <section>
          <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FaUserTie className="text-sm text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">Team directory</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                {filtered.length}
              </span>
            </div>
            {employees.length > 0 && (
              <div className="relative">
                <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                <input
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-52"
                />
              </div>
            )}
          </div>

          {filtered.length ? (
            <motion.div
              initial="hidden" animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
            >
              {filtered.map((emp) => (
                <motion.article
                  key={emp.id}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${avatarColor(emp.id)}`}>
                      {initials(emp.name)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        Active
                      </span>

                      {/* Delete button */}
                      {confirmId === emp.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(emp.id)}
                            disabled={deletingId === emp.id}
                            className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                          >
                            {deletingId === emp.id ? "…" : "Confirm"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="rounded-md border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(emp.id)}
                          className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-400 opacity-0 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                          title="Delete employee"
                        >
                          <FaTrash className="text-[10px]" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="mt-3 truncate text-sm font-semibold text-slate-900">{emp.name}</h3>

                  {/* Meta */}
                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-500">
                    <p className="flex items-center gap-2">
                      <FaEnvelope className="shrink-0 text-slate-400" />
                      <span className="truncate">{emp.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaShieldHalved className="shrink-0 text-slate-400" />
                      Employee
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendar className="shrink-0 text-slate-400" />
                      Joined {shortDate(emp.created_at)}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              title={search ? "No results found" : "No employees yet"}
              description={search ? `No employee matched "${search}".` : "Add your first team member to get started."}
            />
          )}
        </section>
      </div>
    </ModuleShell>
  );
};

const StatPill = ({ label, value, color, className = "" }) => {
  const colors = {
    blue:    "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    violet:  "bg-violet-50 text-violet-700 border-violet-100",
  };
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${colors[color]} ${className}`}>
      <span className="text-xl font-bold">{value}</span>
      <span className="text-xs font-medium leading-tight">{label}</span>
    </div>
  );
};

export default Employees;