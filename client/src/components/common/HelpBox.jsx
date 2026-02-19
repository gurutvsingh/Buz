import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaQuestion, FaTimes, FaMoneyBillWave,
  FaWallet, FaFileInvoice, FaUsers, FaBell,
} from "react-icons/fa";

const tips = [
  { icon: <FaMoneyBillWave />, title: "Income",    description: "Add all money coming into your business — sales, payments, refunds."   },
  { icon: <FaWallet />,         title: "Expenses",  description: "Record rent, salary, electricity and other recurring business costs."   },
  { icon: <FaUsers />,          title: "Customers", description: "Store customer details and manage relationships in one place."          },
  { icon: <FaFileInvoice />,    title: "Bills",     description: "Generate invoices and track outstanding customer payments."             },
  { icon: <FaBell />,           title: "Reminders", description: "Never miss payments, due dates or important business tasks."            },
];

const HelpBox = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="mb-4 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">BUZ Assistant</h3>
                <p className="mt-0.5 text-xs text-slate-400">Quick guide for business owners</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Tips */}
            <div className="p-4">
              <div className="space-y-2">
                {tips.map((tip) => (
                  <div
                    key={tip.title}
                    className="flex gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-xs text-blue-600">
                      {tip.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{tip.title}</h4>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip box */}
              <div className="mt-3 rounded-xl bg-blue-50 p-3.5">
                <p className="text-xs font-bold text-blue-800">Pro tip</p>
                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Start by creating a business, then add income and expenses to unlock analytics.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/30"
      >
        <FaQuestion size={16} />
        <span className="absolute inset-0 animate-ping rounded-full border-4 border-blue-400 opacity-25" />
      </motion.button>
    </div>
  );
};

export default HelpBox;