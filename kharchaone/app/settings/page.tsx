"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [user, setUser] = useState<null | { darkMode: boolean; smallUpiThreshold: number }>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  const patch = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setUser(data.user);
  };

  if (!user) return <AppShell><div className="p-6">Loading settings...</div></AppShell>;

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Apply dark theme globally.</p>
              </div>
              <Switch id="dark-mode" checked={user.darkMode} onCheckedChange={(checked) => patch({ darkMode: checked })} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="threshold">Small UPI threshold (₹)</Label>
              <Input id="threshold" type="number" value={user.smallUpiThreshold} onChange={(e) => setUser({ ...user, smallUpiThreshold: Number(e.target.value) })} onBlur={() => patch({ smallUpiThreshold: Number(user.smallUpiThreshold) })} />
              <p className="text-sm text-muted-foreground">Used for micro-spend analytics and what-if savings.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
