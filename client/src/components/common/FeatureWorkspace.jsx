import { motion } from "framer-motion";

const FeatureWorkspace = ({ eyebrow, title, description, icon, stats = [], cards = [], children }) => (
  <section className="space-y-5">
    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">{eyebrow}</p>
        <h1 className="mt-1.5 break-words text-2xl font-black tracking-tight text-slate-950">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-slate-500">{description}</p>
      </div>
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-lg text-blue-600 shrink-0">
        {icon}
      </div>
    </div>

    {stats.length > 0 && (
      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -3 }}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-md"
          >
            <p className="text-[11px] font-semibold text-slate-500">{stat.label}</p>
            <p className="mt-1.5 truncate text-2xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    )}

    {children}

    {cards.length > 0 && (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-md"
          >
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600">
              {card.icon}
            </div>
            <h3 className="mt-3 text-[15px] font-black text-slate-950">{card.title}</h3>
            <p className="mt-1.5 text-[13px] leading-6 text-slate-500">{card.description}</p>
            {card.tag && (
              <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                {card.tag}
              </span>
            )}
          </motion.article>
        ))}
      </div>
    )}
  </section>
);

export default FeatureWorkspace;