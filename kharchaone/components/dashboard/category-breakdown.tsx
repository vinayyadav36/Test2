"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { CATEGORY_COLORS } from "@/lib/constants";

interface CategoryBreakdownProps {
  data: { category: string; total: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold">{name}</p>
      <p className="text-muted-foreground">{formatCurrency(value)}</p>
    </div>
  );
};

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const top = data.slice(0, 8);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Spend by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={top} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={90} label={false}>
              {top.map((entry, i) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] ?? `hsl(${i * 45}, 65%, 55%)`}
                />
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
