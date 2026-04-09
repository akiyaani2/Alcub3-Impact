interface ConcernCardProps {
  area: string;
  severity: string;
  detail: string;
}

const severityColors: Record<string, string> = {
  critical: "border-red-500/50 bg-red-500/5",
  very_high: "border-red-500/50 bg-red-500/5",
  high: "border-orange-500/50 bg-orange-500/5",
  moderate: "border-yellow-500/50 bg-yellow-500/5",
  low: "border-green-500/50 bg-green-500/5",
  minimal: "border-zinc-700 bg-zinc-800/50",
};

const areaLabels: Record<string, string> = {
  water_quality: "Water Quality",
  drought: "Drought Risk",
  flood_risk: "Flood Risk",
};

export function ConcernCard({ area, severity, detail }: ConcernCardProps) {
  const colorClass = severityColors[severity] ?? severityColors.moderate;
  const label = areaLabels[area] ?? area;

  return (
    <div className={`rounded-lg border p-4 ${colorClass}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-zinc-200">{label}</span>
        <span className="text-xs font-mono uppercase text-zinc-400">
          {severity}
        </span>
      </div>
      <p className="text-sm text-zinc-400">{detail}</p>
    </div>
  );
}
