"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  TrendingUp,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  DatabaseBackup,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_BG } from "@/lib/ui-classes";
import { apiFetch } from "@/lib/api-client";
import { adminRoleLabel } from "@/lib/admin-roles";
import type { AdminRole } from "@/types";

type NavLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** If set, only these roles see the link. */
  roles?: AdminRole[];
};

const links: NavLink[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  {
    href: "/admin/inventory",
    label: "Products",
    icon: Package,
    roles: ["owner", "admin"],
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    roles: ["owner", "admin"],
  },
  {
    href: "/admin/products",
    label: "Top Products",
    icon: TrendingUp,
    roles: ["owner", "admin"],
  },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  {
    href: "/admin/team",
    label: "Team",
    icon: ShieldCheck,
    roles: ["owner"],
  },
];

function visibleLinks(role: AdminRole) {
  return links.filter((link) => !link.roles || link.roles.includes(role));
}

export function AdminTopNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = visibleLinks(role);
  const canBackup = role === "owner" || role === "admin";

  async function logout() {
    await apiFetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <header
      className={cn(
        "safe-top sticky top-0 z-50 border-b border-gold/15 shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
        ADMIN_NAV_BG,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
        <Link href="/admin" className="flex shrink-0 items-center gap-3">
          <div className="relative h-9 w-[4.5rem]">
            <Image
              src="/logo-vg.png"
              alt="VG"
              fill
              sizes="72px"
              className="object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] tracking-[0.2em] text-gold/70 uppercase">
              {adminRoleLabel(role)}
            </p>
            <p className="text-sm font-semibold text-white">
              Virtue <span className="text-gold">Gems</span>
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition",
                  active
                    ? "bg-gold/15 text-gold"
                    : "text-white/50 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-1 rounded-lg border border-gold/20 px-3 py-1.5 text-xs text-gold/80 transition hover:bg-gold/10 sm:flex"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Site
          </Link>
          {canBackup && (
            <a
              href="/api/admin/export?type=backup"
              className="hidden items-center gap-1 rounded-lg border border-light/10 px-3 py-1.5 text-xs text-light/55 transition hover:border-gold/30 hover:text-gold xl:flex"
            >
              <DatabaseBackup className="h-3.5 w-3.5" />
              Backup
            </a>
          )}
          <button
            type="button"
            onClick={logout}
            className="hidden items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/60 transition hover:bg-red-500/20 hover:text-red-400 lg:flex"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-white/70 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gold/10 lg:hidden"
          >
            <div className="space-y-1 p-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm",
                      active
                        ? "bg-gold/15 text-gold"
                        : "text-white/60 hover:bg-white/5",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400/80 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
