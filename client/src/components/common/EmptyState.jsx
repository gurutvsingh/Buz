import { FaPlus } from "react-icons/fa";

const EmptyState = ({ title, description, action, onAction }) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm min-h-[260px] grid place-items-center p-8">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50" />
    <div className="relative z-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
        <FaPlus className="text-base" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-slate-500">{description}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
        >
          <FaPlus className="text-[10px]" />
          {action}
        </button>
      )}
    </div>
  </div>
);

export default EmptyState;