import Link from "next/link";

const severityColors: Record<string, string> = {
  LOW: "bg-blue-50 text-blue-700",
  MEDIUM: "bg-yellow-50 text-yellow-700",
  HIGH: "bg-orange-50 text-orange-700",
  CRITICAL: "bg-red-50 text-red-700",
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
    return <p className="text-secondary text-sm py-4">No active alerts.</p>;
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Link
          key={alert.id}
          href="/dashboard/alerts"
          className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-sm">{alert.title}</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${severityColors[alert.severity] || ""}`}>
              {alert.severity}
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            {alert.type} {alert.lot ? `· Lot ${alert.lot.lotNumber}` : ""}
          </p>
        </Link>
      ))}
    </div>
  );
}
