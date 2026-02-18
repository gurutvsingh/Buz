import { motion } from "framer-motion";
import { FaArrowRight, FaBuilding, FaCheckCircle, FaStore } from "react-icons/fa";

import { useBusiness } from "../../hooks/useBusiness";

const BusinessCard = ({ business }) => {
  const { currentBusiness, selectBusiness } = useBusiness();
  const active = String(currentBusiness?.id) === String(business.id);

  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => selectBusiness(business.id)}
      type="button"
      className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:shadow-lg ${
        active ? "border-blue-300 ring-4 ring-blue-100" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <FaStore />
        </div>

        {active ? (
          <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            <FaCheckCircle />
            Active
          </span>
        ) : (
          <FaArrowRight className="text-slate-300 transition group-hover:text-blue-600" />
        )}
      </div>

      <h3 className="mt-4 truncate text-base font-bold text-slate-900">
        {business.name}
      </h3>

      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        <FaBuilding size={10} />
        {business.business_type || "Business"}
      </div>

      <p className="mt-4 min-h-16 text-sm leading-6 text-slate-600">
        {business.description ||
          "This workspace is ready for income, expenses, employees, billing and customer management."}
      </p>
    </motion.button>
  );
};

export default BusinessCard;
