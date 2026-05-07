"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, TooltipProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { CATEGORY_COLORS } from "@/lib/constants";

interface CategoryBreakdownProps {
  data: { category: string; total: number }[];
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const first = payload[0];
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold">{String(first.name ?? "")}</p>
      <p className="text-muted-foreground">{formatCurrency(Number(first.value ?? 0))}</p>
    </div>
  );
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const top = data.slice(0, 8);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Spend by Category</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={top} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={90} label={false}>
              {top.map((entry, i) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] ?? `hsl(${i * 45}, 65%, 55%)`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
