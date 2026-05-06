import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

const EXAMPLE_RULES = [
  { id: "1", pattern: "swiggy", category: "Food & Dining", active: true },
  { id: "2", pattern: "netflix", category: "Entertainment", active: true },
  { id: "3", pattern: "ola|uber", category: "Transport", active: true },
  { id: "4", pattern: "apollo|medplus", category: "Healthcare", active: true },
  { id: "5", pattern: "amazon|flipkart|myntra", category: "Shopping", active: false },
];

export default function RulesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Auto-Categorisation Rules
            </CardTitle>
            <CardDescription>
              Rules are applied in order. Matching is case-insensitive on merchant name.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {EXAMPLE_RULES.map((rule) => (
                <div key={rule.id} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                  <Badge variant={rule.active ? "success" : "secondary"}>{rule.active ? "Active" : "Off"}</Badge>
                  <code className="text-sm font-mono flex-1 text-muted-foreground">{rule.pattern}</code>
                  <span className="text-sm font-medium">{rule.category}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Rules engine uses keyword matching from <code>lib/category-engine.ts</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
