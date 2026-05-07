"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, Gift, Wallet, RefreshCw, Settings, Upload, BookOpen, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/cashback", label: "Cashback", icon: Gift },
  { href: "/wallets", label: "Wallets", icon: Wallet },
  { href: "/subscriptions", label: "Subscriptions", icon: RefreshCw },
  { href: "/rules", label: "Rules", icon: BookOpen },
  { href: "/import", label: "Import", icon: Upload },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-r border-border">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary"><IndianRupee className="w-4 h-4 text-primary-foreground" /></div>
        <div>
          <h1 className="text-lg font-bold text-foreground">KharchaOne</h1>
          <p className="text-xs text-muted-foreground">Money Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-border"><p className="text-xs text-muted-foreground">v1.0 · JSON NoSQL mode</p></div>
    </aside>
  );
}
