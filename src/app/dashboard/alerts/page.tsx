import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AlertActions from "@/components/AlertActions";
import CreateAlertForm from "@/components/CreateAlertForm";

const severityColors: Record<string, string> = {
  LOW: "bg-blue-100 text-blue-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-red-100 text-red-700",
  ACKNOWLEDGED: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
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
          <h1 className="text-2xl font-bold tracking-tight">Alertes</h1>
          <p className="text-secondary mt-1 text-sm">{active.length} active{active.length !== 1 ? "s" : ""}, {resolved.length} résolue{resolved.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <CreateAlertForm lots={lots} />

      {active.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-800">Alertes actives</h2>
          {active.map((alert) => (
            <div key={alert.id} className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between gap-4 hover:shadow-sm transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-800">{alert.title}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${severityColors[alert.severity] || ""}`}>
                    {alert.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${statusColors[alert.status] || ""}`}>
                    {alert.status}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{alert.type}</span>
                </div>
                {alert.description && <p className="text-sm text-slate-500 mt-2">{alert.description}</p>}
                <div className="text-xs text-slate-400 mt-2">
                  {alert.lot && <Link href={`/dashboard/lots/${alert.lot.id}`} className="text-primary hover:underline">Lot {alert.lot.lotNumber}</Link>}
                  {alert.lot && " · "}
                  {new Date(alert.createdAt).toLocaleString("fr-FR")}
                </div>
              </div>
              <AlertActions alertId={alert.id} />
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-400">Résolues / Acquittées</h2>
          {resolved.map((alert) => (
            <div key={alert.id} className="bg-card border border-border rounded-2xl p-5 opacity-60">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-slate-600">{alert.title}</span>
                <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${severityColors[alert.severity] || ""}`}>
                  {alert.severity}
                </span>
                <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${statusColors[alert.status] || ""}`}>
                  {alert.status}
                </span>
              </div>
              {alert.description && <p className="text-sm text-slate-500 mt-1">{alert.description}</p>}
              <p className="text-xs text-slate-400 mt-2">{new Date(alert.createdAt).toLocaleString("fr-FR")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
