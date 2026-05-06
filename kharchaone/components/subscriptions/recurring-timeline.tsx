import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Calendar } from "lucide-react";

interface SubEvent {
  merchant: string;
  amount: number;
  date: string;
}

interface RecurringTimelineProps {
  events: SubEvent[];
}

export function RecurringTimeline({ events }: RecurringTimelineProps) {
  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Upcoming Charges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
          {sorted.map((e, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
              <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-sm font-medium">{e.merchant}</p>
                <p className="text-sm font-semibold">{formatCurrency(e.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
