import Link from "next/link";

const severityColors: Record<string, string> = {
  LOW: "bg-blue-100 text-blue-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

type Alert = {
  id: string;
  title: string;
  severity: string;
  type: string;
  createdAt: Date;
  lot: { lotNumber: string } | null;
};

export default function AlertsBadge({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return <p className="text-secondary text-sm py-4">Aucune alerte active.</p>;
  }

  return (
    <div className="space-y-2.5">
      {alerts.map((alert) => (
        <Link
          key={alert.id}
          href="/dashboard/alerts"
          className="block p-3 rounded-xl border border-border hover:bg-slate-50 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-sm text-slate-800">{alert.title}</p>
            <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${severityColors[alert.severity] || ""}`}>
              {alert.severity}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {alert.type} {alert.lot ? `· Lot ${alert.lot.lotNumber}` : ""}
          </p>
        </Link>
      ))}
    </div>
  );
}
