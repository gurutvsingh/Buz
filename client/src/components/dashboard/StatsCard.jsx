import { motion } from "framer-motion";

const ACCENTS = {
  blue:    { icon: "bg-blue-100 text-blue-600"      },
  emerald: { icon: "bg-emerald-100 text-emerald-600" },
  rose:    { icon: "bg-rose-100 text-rose-500"       },
  amber:   { icon: "bg-amber-100 text-amber-600"     },
  green:   { icon: "bg-emerald-100 text-emerald-600" },
};

const StatsCard = ({ label, title, value, icon, accent, tone, trend }) => {
  const key = accent || tone || "blue";
  const a   = ACCENTS[key] ?? ACCENTS.blue;
  const displayLabel = label || title || "";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            {displayLabel}
          </p>
          <p className="mt-1.5 text-xl font-black tracking-tight text-slate-900">
            {value ?? "—"}
          </p>
          {trend && (
            <p className={`mt-1 text-[11px] font-semibold ${trend.up ? "text-emerald-600" : "text-rose-500"}`}>
              {trend.up ? "▲" : "▼"} {trend.label}
            </p>
          )}
        </div>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${a.icon}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;