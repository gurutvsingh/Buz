import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLocationDot, FaPhone, FaPlus, FaUser, FaUsers, FaMagnifyingGlass } from "react-icons/fa6";

import EmptyState  from "../components/common/EmptyState";
import ModuleShell from "../components/common/ModuleShell";
import { useBusiness } from "../hooks/useBusiness";
import { createCustomer, getCustomers } from "../services/module.service";

const FIELD =
  "h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

const avatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];
const initials    = (name) => name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const Customers = () => {
  const { currentBusiness } = useBusiness();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch]       = useState("");
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);
  const [formData, setFormData]   = useState({ name: "", phone: "", address: "" });

  const set = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  const load = useCallback(async () => {
    if (!currentBusiness?.id) return;
    const r = await getCustomers(currentBusiness.id);
    setCustomers(r.data || []);
  }, [currentBusiness]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCustomer({ ...formData, business_id: currentBusiness.id });
      setFormData({ name: "", phone: "", address: "" });
      await load();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <ModuleShell
      eyebrow="Khata"
      title="Customers"
      description="Manage customer records, billing relationships and digital khata accounts."
    >
      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatPill label="Total Customers" value={customers.length} color="blue" />
        <StatPill label="With Phone" value={customers.filter((c) => c.phone).length} color="emerald" />
        <StatPill label="With Address" value={customers.filter((c) => c.address).length} color="violet" className="hidden sm:flex" />
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
          >
            <span className="text-base">✓</span> Customer added successfully.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">

        {/* ── Form ── */}
        <motion.form
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
          onSubmit={handleSubmit}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
              <FaUser className="text-sm" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add Customer</h2>
              <p className="text-xs text-slate-500">Create profile for billing and khata.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Full Name <span className="text-rose-500">*</span></label>
              <input required placeholder="e.g. Rahul Mehta" value={formData.name} onChange={set("name")} className={FIELD} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Phone Number</label>
              <input placeholder="+91 98765 43210" value={formData.phone} onChange={set("phone")} className={FIELD} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Address</label>
              <textarea
                placeholder="Street, city, state…"
                value={formData.address} onChange={set("address")}
                className="min-h-[72px] w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <motion.button
              whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
              disabled={!currentBusiness || saving} type="submit"
              className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <FaPlus className="text-xs" />
              {saving ? "Saving…" : "Add Customer"}
            </motion.button>
          </div>
        </motion.form>

        {/* ── List ── */}
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FaUsers className="text-sm text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">Customer List</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                {filtered.length}
              </span>
            </div>
            {customers.length > 0 && (
              <div className="relative">
                <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                <input
                  placeholder="Search by name or phone…"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-56"
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
              {filtered.map((c) => (
                <motion.article
                  key={c.id}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${avatarColor(c.id)}`}>
                      {initials(c.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900">{c.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        <FaPhone className="shrink-0 text-[10px]" />
                        {c.phone || <span className="text-slate-400">No phone</span>}
                      </p>
                    </div>
                  </div>
                  {c.address && (
                    <p className="mt-3 flex gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-xs text-slate-500">
                      <FaLocationDot className="mt-0.5 shrink-0 text-slate-400" />
                      <span className="line-clamp-2">{c.address}</span>
                    </p>
                  )}
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              title={search ? "No results found" : "No customers yet"}
              description={search ? `No customer matched "${search}".` : "Add your first customer to start billing and digital khata."}
            />
          )}
        </section>
      </div>
    </ModuleShell>
  );
};

/* ── Sub-components ── */

const StatPill = ({ label, value, color, className = "" }) => {
  const colors = {
    blue:    "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    violet:  "bg-violet-50 text-violet-700 border-violet-100",
  };
  return (
    <div className={`flex items-center gap-3 rounded-xl border ${colors[color]} px-4 py-3 ${className}`}>
      <span className="text-2xl font-black">{value}</span>
      <span className="text-xs font-semibold leading-tight">{label}</span>
    </div>
  );
};

export default Customers;