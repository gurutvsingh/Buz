import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBell, FaBolt, FaBoxOpen, FaBuilding, FaChartLine,
  FaChevronLeft, FaChevronRight, FaClipboardList,
  FaFileInvoice, FaFilePdf, FaMoneyBillWave,
  FaPlus, FaRobot, FaTimes, FaUserTie, FaUsers, FaWallet,
} from "react-icons/fa";

const SECTIONS = [
  {
    title: "Core",
    items: [
      { name: "Dashboard",  path: "/dashboard",  icon: <FaChartLine /> },
      { name: "Businesses", path: "/businesses", icon: <FaBuilding /> },
      { name: "Income",     path: "/income",     icon: <FaMoneyBillWave /> },
      { name: "Expenses",   path: "/expenses",   icon: <FaWallet /> },
    ],
  },
  {
    title: "People",
    items: [
      { name: "Customers", path: "/customers", icon: <FaUsers /> },
      { name: "Employees", path: "/employees", icon: <FaUserTie /> },
    ],
  },
  {
    title: "Operations",
    items: [
      { name: "Bills",      path: "/bills",      icon: <FaFileInvoice /> },
      { name: "Reminders",  path: "/reminders",  icon: <FaBell /> },
      { name: "Checklists", path: "/checklists", icon: <FaClipboardList /> },
    ],
  },
  {
    title: "Phase 2",
    items: [
      { name: "Analytics",    path: "/analytics",    icon: <FaChartLine /> },
      { name: "Khata",        path: "/khata",        icon: <FaUsers /> },
      { name: "Invoice PDF",  path: "/invoice-pdf",  icon: <FaFilePdf /> },
      { name: "Inventory",    path: "/inventory",    icon: <FaBoxOpen /> },
      { name: "AI Assistant", path: "/ai-assistant", icon: <FaRobot /> },
    ],
  },
];

const NavItem = ({ item, onClose, collapsed }) => (
  <NavLink
    to={item.path}
    onClick={onClose}
    title={collapsed ? item.name : undefined}
    className={({ isActive }) =>
      `group relative flex items-center rounded-lg px-2 py-1.5 text-sm font-semibold transition-all duration-150
      ${collapsed ? "justify-center" : "gap-2.5"}
      ${isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-blue-600" />
        )}
        <span
          className={`flex shrink-0 items-center justify-center rounded-md text-xs transition-colors
            ${collapsed ? "h-8 w-8" : "h-7 w-7"}
            ${isActive
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
            }`}
        >
          {item.icon}
        </span>
        {!collapsed && <span className="truncate">{item.name}</span>}
      </>
    )}
  </NavLink>
);

const SidebarBody = ({ collapsed, onClose, isMobile }) => {
  const navigate = useNavigate();
  const handleQuickAdd = () => {
    navigate("/income");
    onClose();
  };

  return (
  <div className="flex h-full flex-col overflow-hidden">

    {/* Logo */}
    <div
      className={`flex h-16 shrink-0 items-center border-b border-slate-100
        ${collapsed ? "justify-center px-3" : "justify-between px-4"}`}
    >
      <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <FaBolt className="text-sm" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-[14px] font-black tracking-tight text-slate-900">BUZ</p>
            <p className="text-[10px] font-medium leading-none text-slate-400">Business OS</p>
          </div>
        )}
      </div>
      {isMobile && !collapsed && (
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
          aria-label="Close sidebar"
        >
          <FaTimes className="text-xs" />
        </button>
      )}
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
      <div className="space-y-3">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            {collapsed
              ? <div className="mx-2 mb-2 border-t border-slate-100" />
              : (
                <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {section.title}
                </p>
              )
            }
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  onClose={onClose}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>

    {/* Footer */}
    <div className="shrink-0 border-t border-slate-100 p-2">
      {collapsed ? (
        <button
          title="Quick Add"
          onClick={handleQuickAdd}
          className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5 text-white transition hover:bg-blue-700"
        >
          <FaPlus className="text-xs" />
        </button>
      ) : (
        <button
          onClick={handleQuickAdd}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          <FaPlus className="text-xs" />
          Quick Add
        </button>
      )}
    </div>
  </div>
  );
};

const Sidebar = ({ isOpen, onClose, collapsed, onToggle }) => (
  <>
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex lg:flex-col"
      style={{ width: collapsed ? 68 : 260 }}
    >
      <SidebarBody
        collapsed={collapsed}
        onClose={() => {}}
        isMobile={false}
      />
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
      >
        {collapsed
          ? <FaChevronRight className="text-[9px]" />
          : <FaChevronLeft  className="text-[9px]" />
        }
      </button>
    </aside>

    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative h-full w-[260px] bg-white shadow-2xl"
          >
            <SidebarBody
              collapsed={false}
              onClose={onClose}
              isMobile={true}
            />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  </>
);

export default Sidebar;
