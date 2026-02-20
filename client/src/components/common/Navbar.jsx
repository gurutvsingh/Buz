import { FaBars, FaBell, FaChevronDown, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useBusiness } from "../../hooks/useBusiness";

const Navbar = ({ onOpenSidebar, pageTitle = "Dashboard" }) => {
  const { user, logout } = useAuth();
  const { businesses, currentBusiness, selectBusiness } = useBusiness();

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-full items-center gap-2.5 px-4 lg:px-5">

        {/* Left */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={onOpenSidebar}
            type="button"
            aria-label="Open sidebar"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 lg:hidden"
          >
            <FaBars className="text-[10px]" />
          </button>
          <h1 className="truncate text-[15px] font-bold text-slate-900 lg:text-base">
            {pageTitle}
          </h1>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Search */}
          <div className="relative hidden lg:block">
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400" />
            <input
              type="search"
              placeholder="Search records…"
              className="h-8 w-[180px] xl:w-[240px] rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-3 text-[13px] outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Business selector */}
          <div className="relative hidden lg:block">
            <select
              value={currentBusiness?.id || ""}
              onChange={(e) => selectBusiness(e.target.value)}
              className="h-8 w-[155px] appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-7 text-[13px] font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="">Select business</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <FaChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400" />
          </div>

          {/* Bell */}
          <button
            aria-label="Notifications"
            className="relative grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-400 transition hover:bg-slate-50"
          >
            <FaBell className="text-[11px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-[1.5px] ring-white" />
          </button>

          {/* Profile */}
          <div className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2">
            <div className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-blue-600 text-[9px] font-black text-white">
              {(user?.name || "Z").charAt(0).toUpperCase()}
            </div>
            <div className="hidden min-w-0 xl:block">
              <p className="max-w-[80px] truncate text-[12px] font-bold text-slate-900">
                {user?.name || "User"}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="grid h-5 w-5 place-items-center rounded text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              aria-label="Log out"
            >
              <FaSignOutAlt className="text-[10px]" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;