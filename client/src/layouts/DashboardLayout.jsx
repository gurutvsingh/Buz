import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useBusiness } from "../hooks/useBusiness";

const PAGE_TITLES = {
  "/dashboard":     "Dashboard",
  "/businesses":    "Businesses",
  "/income":        "Income",
  "/expenses":      "Expenses",
  "/customers":     "Customers",
  "/employees":     "Employees",
  "/bills":         "Bills",
  "/reminders":     "Reminders",
  "/checklists":    "Checklists",
  "/analytics":     "Analytics",
  "/khata":         "Digital Khata",
  "/invoice-pdf":   "Invoice PDF",
  "/inventory":     "Inventory",
  "/ai-assistant":  "AI Assistant",
  "/notifications": "Notifications",
};

const FULL = 280;
const MINI = 68;

const DashboardLayout = () => {
  const { loadBusinesses } = useBusiness();
  const location = useLocation();
  const mainRef = useRef(null);

  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pageTitle = PAGE_TITLES[location.pathname] ?? "BUZ";

  // Keep main area margin in sync with sidebar width
  const applyMargin = (collapsed) => {
    if (!mainRef.current) return;
    // Only apply on desktop (>= 1024px)
    if (window.innerWidth >= 1024) {
      mainRef.current.style.marginLeft = collapsed ? `${MINI}px` : `${FULL}px`;
    } else {
      mainRef.current.style.marginLeft = "0px";
    }
  };

  useEffect(() => { loadBusinesses(); }, [loadBusinesses]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Apply margin whenever collapsed state or viewport changes
  useEffect(() => {
    applyMargin(sidebarCollapsed);
    const handleResize = () => applyMargin(sidebarCollapsed);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarCollapsed]);

  const handleToggle = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      // Apply immediately so animation is instant
      if (mainRef.current && window.innerWidth >= 1024) {
        mainRef.current.style.marginLeft = next ? `${MINI}px` : `${FULL}px`;
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggle={handleToggle}
      />

      {/*
        ref-based margin: starts at FULL on desktop.
        transition-[margin] makes the shift smooth.
      */}
      <div
        ref={mainRef}
        className="flex min-h-screen flex-col transition-[margin] duration-200"
        style={{ marginLeft: typeof window !== "undefined" && window.innerWidth >= 1024 ? `${FULL}px` : "0px" }}
      >
        <Navbar
          pageTitle={pageTitle}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex-1 overflow-x-hidden px-4 py-6 md:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-[1200px] space-y-0">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;