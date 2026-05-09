"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Anomaly = { id: string; message: string; severity: string; status: string; transactionId: string; details?: Record<string, unknown> };

export default function AnomaliesPage() {
  const [items, setItems] = useState<Anomaly[]>([]);

  const load = () => fetch("/api/anomalies").then((r) => r.json()).then((d) => setItems(d.anomalies ?? []));

  useEffect(() => {
    load();
  }, []);

  const update = async (id: string, status: "acknowledged" | "dismissed") => {
    await fetch("/api/anomalies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Anomaly Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.length === 0 && <p className="text-sm text-muted-foreground">No anomalies found.</p>}
            {items.map((item) => (
              <div key={item.id} className="rounded border p-3 text-sm space-y-2">
                <p className="font-medium">{item.message}</p>
                <p className="text-muted-foreground">Severity: {item.severity} · Transaction: {item.transactionId}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => update(item.id, "acknowledged")}>Acknowledge</Button>
                  <Button variant="ghost" size="sm" onClick={() => update(item.id, "dismissed")}>Dismiss</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
