import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtext?: string;
  trend?: number; // positive = up, negative = down
  icon?: React.ReactNode;
  className?: string;
}

export function KpiCard({ title, value, subtext, trend, icon, className }: KpiCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1 truncate">{value}</p>
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
            {trend !== undefined && (
              <div className={cn("flex items-center gap-1 mt-1 text-xs font-medium", trend >= 0 ? "text-red-500" : "text-green-500")}>
                {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(trend)}% vs last month
              </div>
            )}
          </div>
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
