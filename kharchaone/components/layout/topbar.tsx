"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useAppStore } from "@/store/use-app-store";
import { useEffect, useState } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/cashback": "Cashback & Rewards",
  "/wallets": "Wallets",
  "/subscriptions": "Subscriptions",
  "/rules": "Auto-Categorisation Rules",
  "/import": "Import Data",
  "/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const { isDemoMode } = useAppStore();
  const [dark, setDark] = useState(false);

  const title = PAGE_TITLES[pathname] ?? PAGE_TITLES[Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k)) ?? ""] ?? "KharchaOne";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 h-14 px-4 bg-background/95 backdrop-blur border-b border-border">
      {/* Mobile hamburger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Title */}
      <h2 className="flex-1 text-lg font-semibold text-foreground">{title}</h2>

      {/* Demo badge */}
      {isDemoMode && (
        <Badge variant="warning" className="hidden sm:flex">
          Demo Mode
        </Badge>
      )}

      {/* Dark mode toggle */}
      <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)}>
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      <Button variant="ghost" size="icon">
        <Bell className="w-4 h-4" />
      </Button>
    </header>
  );
}
