"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";

export default function RulesPage() {
  const [data, setData] = useState<{ rules: Array<{ id: string; field: string; operator: string; value: string; category?: string; enabled: boolean }>; suggestions: Array<{ message: string }> }>({ rules: [], suggestions: [] });
  const [value, setValue] = useState("");

  const load = () => fetch("/api/rules").then((r) => r.json()).then(setData);
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!value.trim()) return;
    await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field: "merchant", operator: "contains", value, category: "Miscellaneous", enabled: true }),
    });
    setValue("");
    load();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" />Auto-Categorisation Rules</CardTitle>
            <CardDescription>Rules are applied in order. Matching is case-insensitive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="merchant keyword e.g. swiggy" value={value} onChange={(e) => setValue(e.target.value)} />
              <Button onClick={create}>Add rule</Button>
            </div>
            <div className="space-y-3">
              {data.rules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                  <Badge variant={rule.enabled ? "success" : "secondary"}>{rule.enabled ? "Active" : "Off"}</Badge>
                  <code className="text-sm font-mono flex-1 text-muted-foreground">{rule.field} {rule.operator} {rule.value}</code>
                  <span className="text-sm font-medium">{rule.category ?? "(no category)"}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {data.suggestions.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Rule Suggestions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data.suggestions.map((s, idx) => <p key={idx} className="text-sm">{s.message}</p>)}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
