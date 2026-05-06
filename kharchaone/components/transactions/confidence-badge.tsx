import { Badge } from "@/components/ui/badge";

interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const pct = Math.round(confidence * 100);
  if (pct >= 80) return <Badge variant="success">{pct}%</Badge>;
  if (pct >= 50) return <Badge variant="warning">{pct}%</Badge>;
  return <Badge variant="destructive">{pct}%</Badge>;
}
