"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiBox,
  FiAlertTriangle,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/dashboard/suppliers", label: "Fournisseurs", icon: FiTruck },
  { href: "/dashboard/products", label: "Produits", icon: FiBox },
  { href: "/dashboard/lots", label: "Lots", icon: FiPackage },
  { href: "/dashboard/alerts", label: "Alertes", icon: FiAlertTriangle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-slate-200 rounded-xl shadow-sm"
      >
        <FiMenu size={20} />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-sidebar-bg flex flex-col transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SOS Hub</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <div className="px-4 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-3">Menu</p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-400 hover:text-white hover:bg-sidebar-hover"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 mt-auto border-t border-slate-700/50">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:text-red-400 hover:bg-sidebar-hover w-full transition-all"
          >
            <FiLogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
