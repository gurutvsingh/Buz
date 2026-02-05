import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBuilding,
  FaPlus,
  FaCircleCheck,
  FaChartPie,
  FaTableCells,
  FaInbox,
} from "react-icons/fa6";

import BusinessCard from "../components/business/BusinessCard";
import ModuleShell from "../components/common/ModuleShell";
import { useBusiness } from "../hooks/useBusiness";
import { createBusiness } from "../services/business.service";

const FIELD =
  "h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

const TYPE_CHIPS = ["Retail", "Agency", "Manufacturing", "Services", "Restaurant", "Other"];

const Businesses = () => {
  const { businesses, loadBusinesses, loadingBusinesses } = useBusiness();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", business_type: "", description: "" });

  const set = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createBusiness(formData);
      setFormData({ name: "", business_type: "", description: "" });
      await loadBusinesses();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const totalTypes = new Set(businesses.map((b) => b.business_type).filter(Boolean)).size;

  return (
    <ModuleShell
      eyebrow="Workspace"
      title="Businesses"
      description="Create and manage multiple businesses. Every record belongs to a business workspace."
    >
      {/* Stats */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <StatCard icon={<FaBuilding />} label="Total workspaces" value={businesses.length} color="blue" />
        <StatCard icon={<FaCircleCheck />} label="Active" value={businesses.filter((b) => b.status !== "inactive").length || businesses.length} color="emerald" />
        <StatCard icon={<FaChartPie />} label="Business types" value={totalTypes} color="violet" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
          >
            <FaCircleCheck className="shrink-0 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-700">Business workspace created.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout */}
      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <FaBuilding className="text-sm" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">New business</h2>
              <p className="text-xs text-slate-400">Set up a workspace in seconds</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Business name <span className="text-rose-500">*</span>
              </label>
              <input required placeholder="e.g. Sharma Traders" value={formData.name} onChange={set("name")} className={FIELD} />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Business type
              </label>
              <input
                placeholder="Retail, Agency, Manufacturing…"
                value={formData.business_type}
                onChange={set("business_type")}
                className={FIELD}
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TYPE_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, business_type: chip }))}
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition ${
                      formData.business_type === chip
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                placeholder="Brief description of what this business does."
                value={formData.description}
                onChange={set("description")}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="border-t border-slate-100 pt-1">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={saving}
                type="submit"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <FaPlus className="text-xs" />
                {saving ? "Creating…" : "Create business"}
              </motion.button>
            </div>
          </div>
        </motion.form>

        {/* List */}
        <section className="min-w-0">
          <div className="mb-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FaTableCells className="shrink-0 text-sm text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">Your workspaces</h2>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-medium text-slate-500">
              {businesses.length} {businesses.length === 1 ? "workspace" : "workspaces"}
            </span>
          </div>

          {loadingBusinesses ? (
            <SkeletonGrid />
          ) : businesses.length ? (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
            >
              {businesses.map((b) => (
                <motion.div
                  key={b.id}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                >
                  <BusinessCard business={b} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <FaInbox className="text-lg" />
              </div>
              <p className="text-sm font-medium text-slate-700">No businesses yet</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                Create your first workspace to unlock income, expenses, customers, employees, and billing.
              </p>
            </div>
          )}
        </section>
      </div>
    </ModuleShell>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const palette = {
    blue:    { wrap: "bg-blue-50 border-blue-100",       icon: "bg-blue-100 text-blue-600",       val: "text-blue-700",    lbl: "text-blue-400"    },
    emerald: { wrap: "bg-emerald-50 border-emerald-100", icon: "bg-emerald-100 text-emerald-600", val: "text-emerald-700", lbl: "text-emerald-400" },
    violet:  { wrap: "bg-violet-50 border-violet-100",   icon: "bg-violet-100 text-violet-600",   val: "text-violet-700",  lbl: "text-violet-400"  },
  }[color];

  return (
    <div className={`flex items-center gap-3.5 rounded-xl border px-4 py-3 ${palette.wrap}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm ${palette.icon}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`text-xl font-bold leading-none ${palette.val}`}>{value}</p>
        <p className={`mt-1 truncate text-[11px] font-medium ${palette.lbl}`}>{label}</p>
      </div>
    </div>
  );
};

const SkeletonGrid = () => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />
    ))}
  </div>
);

export default Businesses;