import React from "react";
import { NavLink } from "react-router-dom";

function DashboardNavbar() {

  const navStyle = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      isActive
        ? "sidebar-active font-semibold bg-gray-100 dark:bg-gray-800"
        : "text-neutral-muted hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <aside className="w-[260px] bg-white dark:bg-gray-900 border-r border-neutral-border dark:border-gray-800 flex flex-col shrink-0">
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-border dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-1 rounded">
            <span className="material-symbols-outlined text-2xl">domain</span>
          </div>
          <span className="font-bold text-lg tracking-tight">HospitalityOS</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-3">

          <NavLink to="/dashboard" className={navStyle}>
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </NavLink>

          <NavLink to="/analytics" className={navStyle}>
            <span className="material-symbols-outlined text-[22px]">analytics</span>
            <span className="text-sm">Analytics</span>
          </NavLink>

          <NavLink to="/events" className={navStyle}>
            <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            <span className="text-sm">Events</span>
          </NavLink>

        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-neutral-border dark:border-gray-800">

        <NavLink to="/settings" className={navStyle}>
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <span className="text-sm">Settings</span>
        </NavLink>

        <div className="mt-4 flex items-center gap-3 px-3">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">help</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Support Center</span>
            <span className="text-[10px] text-neutral-muted">24/7 Assistance</span>
          </div>
        </div>

      </div>
    </aside>
  );
}

export default DashboardNavbar;