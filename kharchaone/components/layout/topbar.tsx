"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
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
  const [dark, setDark] = useState(false);

  const title = PAGE_TITLES[pathname] ?? PAGE_TITLES[Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k)) ?? ""] ?? "KharchaOne";

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("kharchaone-dark") : null;
    const initial = saved === "1";
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("kharchaone-dark", dark ? "1" : "0");
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 h-14 px-4 bg-background/95 backdrop-blur border-b border-border">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="w-5 h-5" /></Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64"><Sidebar /></SheetContent>
      </Sheet>

      <h2 className="flex-1 text-lg font-semibold text-foreground">{title}</h2>

      <Badge variant="outline" className="hidden sm:flex">JSON Store</Badge>

      <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode">
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="w-4 h-4" /></Button>
    </header>
  );
}
