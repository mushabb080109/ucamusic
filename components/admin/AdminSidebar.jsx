"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, X, Music2 } from "lucide-react";
import { cx } from "@/lib/format";

const MENU = [
  {
    items: [{ href: "/admin", exact: true, icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    section: "Komunitas",
    items: [{ href: "/admin/users", icon: Users, label: "Member" }],
  },
  {
    section: "Sistem",
    items: [{ href: "/admin/settings", icon: Settings, label: "Pengaturan" }],
  },
];

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={cx(
          "fixed top-0 left-0 bottom-0 w-64 bg-base-card border-r border-white/8 z-50 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center shrink-0">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Admin Panel</div>
              <div className="font-display font-bold text-base text-white leading-none mt-0.5">ucamusic</div>
            </div>
          </div>
          <button className="lg:hidden text-white/50" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-3 no-scrollbar">
          {MENU.map((group, gi) => (
            <div key={gi} className="mb-1">
              {group.section && <div className="text-[10px] font-bold uppercase tracking-wider text-white/30 px-3 pt-4 pb-1.5">{group.section}</div>}
              {group.items.map((item) => {
                const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-0.5 transition-colors",
                      active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
