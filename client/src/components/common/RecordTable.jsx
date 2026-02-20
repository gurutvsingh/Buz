import { useState } from "react";
import { motion } from "framer-motion";
import { FaDatabase, FaSearch } from "react-icons/fa";

const RecordTable = ({
  columns,
  rows,
  emptyText,
  title = "Records",
  searchable = false,
}) => {
  const [query, setQuery] = useState("");

  const filtered = searchable && query.trim()
    ? rows.filter((row) =>
        columns.some((col) => {
          const val = col.render ? null : row[col.key];
          return val && String(val).toLowerCase().includes(query.toLowerCase());
        })
      )
    : rows;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        {searchable && (
          <div className="flex h-8 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-400 md:w-56 focus-within:border-blue-500 focus-within:bg-white transition">
            <FaSearch className="shrink-0 text-[10px]" />
            <input
              type="search"
              placeholder="Search records…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((row, rowIndex) => (
                <motion.tr
                  key={row.id || rowIndex}
                  whileHover={{ backgroundColor: "#f8fafc" }}
                  className="border-b border-slate-100 last:border-0 transition"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-[13px] text-slate-700"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-14">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-400">
                      <FaDatabase size={18} />
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-900">No Records Found</h3>
                    <p className="mt-1.5 max-w-xs text-[12px] leading-5 text-slate-400">
                      {emptyText}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecordTable;