import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AlertActions from "@/components/AlertActions";
import CreateAlertForm from "@/components/CreateAlertForm";

const severityColors: Record<string, string> = {
  LOW: "bg-blue-50 text-blue-700",
  MEDIUM: "bg-yellow-50 text-yellow-700",
  HIGH: "bg-orange-50 text-orange-700",
  CRITICAL: "bg-red-50 text-red-700",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-red-50 text-red-700",
  ACKNOWLEDGED: "bg-yellow-50 text-yellow-700",
  RESOLVED: "bg-green-50 text-green-700",
};

export default async function AlertsPage() {
  const [alerts, lots] = await Promise.all([
    prisma.alert.findMany({
      orderBy: { createdAt: "desc" },
      include: { lot: true, createdBy: { select: { name: true } } },
    }),
    prisma.lot.findMany({ select: { id: true, lotNumber: true }, orderBy: { lotNumber: "asc" } }),
  ]);

  const active = alerts.filter((a) => a.status === "ACTIVE");
  const resolved = alerts.filter((a) => a.status !== "ACTIVE");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-secondary mt-1">{active.length} active, {resolved.length} resolved</p>
        </div>
      </div>

      <CreateAlertForm lots={lots} />

      {active.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Active Alerts</h2>
          {active.map((alert) => (
            <div key={alert.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{alert.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[alert.severity] || ""}`}>
                    {alert.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[alert.status] || ""}`}>
                    {alert.status}
                  </span>
                  <span className="text-xs text-secondary">{alert.type}</span>
                </div>
                {alert.description && <p className="text-sm text-secondary mt-1">{alert.description}</p>}
                <div className="text-xs text-secondary mt-2">
                  {alert.lot && <Link href={`/dashboard/lots/${alert.lot.id}`} className="text-primary hover:underline">Lot {alert.lot.lotNumber}</Link>}
                  {alert.lot && " · "}
                  {new Date(alert.createdAt).toLocaleString()}
                </div>
              </div>
              <AlertActions alertId={alert.id} />
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-secondary">Resolved / Acknowledged</h2>
          {resolved.map((alert) => (
            <div key={alert.id} className="bg-card border border-border rounded-xl p-4 opacity-70">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{alert.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[alert.severity] || ""}`}>
                  {alert.severity}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[alert.status] || ""}`}>
                  {alert.status}
                </span>
              </div>
              {alert.description && <p className="text-sm text-secondary mt-1">{alert.description}</p>}
              <p className="text-xs text-secondary mt-2">{new Date(alert.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
