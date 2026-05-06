"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/use-app-store";

export default function SettingsPage() {
  const { isDemoMode, setDemoMode } = useAppStore();

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="demo-mode" className="text-base">Demo Mode</Label>
                <p className="text-sm text-muted-foreground">Use sample data instead of live database</p>
              </div>
              <Switch id="demo-mode" checked={isDemoMode} onCheckedChange={setDemoMode} />
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Data Source</p>
              <p className="text-sm text-muted-foreground">
                {isDemoMode
                  ? "Using in-memory demo data (40 sample transactions)"
                  : "Using Prisma + SQLite database (dev.db)"}
              </p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium">Version</p>
              <p className="text-sm text-muted-foreground">KharchaOne v0.1.0 · MVP</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
