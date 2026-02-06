import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell, FaCircleCheck, FaClock,
  FaEnvelope, FaEnvelopeOpen, FaTrash,
} from "react-icons/fa6";

import ModuleShell from "../components/common/ModuleShell";
import EmptyState  from "../components/common/EmptyState";
import StatsCard   from "../components/dashboard/StatsCard";
import { useAuth } from "../hooks/useAuth";
import {
  deleteNotification,
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/module.service";
import { shortDate } from "../utils/formatters";

const TYPE_STYLE = {
  REMINDER: "bg-amber-50 text-amber-700 border-amber-100",
  BILL:     "bg-blue-50 text-blue-700 border-blue-100",
  SYSTEM:   "bg-slate-100 text-slate-600 border-slate-200",
};

const Notifications = () => {
  const { user } = useAuth();
  const [rows, setRows]     = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    getMyNotifications()
      .then((r) => setRows(r.data || []))
      .catch(() => {});
  }, [user]);

  const visible    = rows;
  const unreadCount = visible.filter((r) => !r.is_read).length;

  const markRead = async (id) => {
    setBusy(true);
    try {
      await markNotificationRead(id);
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, is_read: 1 } : row
        )
      );
    } finally {
      setBusy(false);
    }
  };

  const markAllRead = async () => {
    setBusy(true);
    try {
      await markAllNotificationsRead();
      setRows((prev) => prev.map((row) => ({ ...row, is_read: 1 })));
    } finally {
      setBusy(false);
    }
  };

  const removeRow = async (id) => {
    setBusy(true);
    try {
      await deleteNotification(id);
      setRows((prev) => prev.filter((row) => row.id !== id));
    } finally {
      setBusy(false);
    }
  };

  const isRead = (row) => Boolean(row.is_read);

  return (
    <ModuleShell
      eyebrow="Activity"
      title="Notifications"
      description="Stay updated on reminders, billing events and business activity."
      actions={
        unreadCount > 0 ? (
          <button
            onClick={markAllRead}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <FaCircleCheck className="text-emerald-500" /> Mark all read
          </button>
        ) : null
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatsCard label="Total"    value={visible.length}  icon={<FaBell />}         accent="blue"    />
        <StatsCard label="Unread"   value={unreadCount}     icon={<FaEnvelope />}     accent="amber"   />
        <StatsCard label="Read"     value={visible.length - unreadCount} icon={<FaEnvelopeOpen />} accent="emerald" />
      </div>

      {/* List */}
      {visible.length ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">All Notifications</h2>
              <p className="mt-0.5 text-xs text-slate-400">{visible.length} total · {unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            <AnimatePresence>
              {visible.map((row) => {
                const read_ = isRead(row);
                const typeKey = row.type || "SYSTEM";
                return (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.18 }}
                    className={`flex items-start gap-4 px-5 py-4 transition ${
                      read_ ? "bg-white" : "bg-blue-50/30"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-xs ${
                        TYPE_STYLE[typeKey] ?? TYPE_STYLE.SYSTEM
                      }`}
                    >
                      <FaBell />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={`text-sm font-bold ${read_ ? "text-slate-600" : "text-slate-900"}`}>
                          {row.title || "Notification"}
                        </p>
                        {!read_ && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        )}
                        {typeKey !== "SYSTEM" && (
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${TYPE_STYLE[typeKey]}`}>
                            {typeKey}
                          </span>
                        )}
                      </div>
                      {row.message && (
                        <p className="mt-1 text-xs leading-5 text-slate-500">{row.message}</p>
                      )}
                      <div className="mt-2 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <FaClock className="text-[10px]" />
                          {shortDate(row.created_at)}
                        </span>
                        {!read_ && (
                          <button
                            onClick={() => markRead(row.id)}
                            disabled={busy}
                            className="text-[11px] font-bold text-blue-600 hover:underline"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1">
                      {!read_ && (
                        <button
                          onClick={() => markRead(row.id)}
                          disabled={busy}
                          aria-label="Mark as read"
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 transition hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <FaCircleCheck className="text-sm" />
                        </button>
                      )}
                      <button
                        onClick={() => removeRow(row.id)}
                        disabled={busy}
                        aria-label="Dismiss"
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <FaTrash className="text-[10px]" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <EmptyState
          title="All caught up"
          description="No notifications yet. They'll appear here when reminders, bills or system events trigger."
        />
      )}
    </ModuleShell>
  );
};

export default Notifications;
