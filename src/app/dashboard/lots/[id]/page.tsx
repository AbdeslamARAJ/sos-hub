import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import TraceTimeline from "@/components/TraceTimeline";
import LotStatusUpdate from "@/components/LotStatusUpdate";
import AddTraceEvent from "@/components/AddTraceEvent";
import TemperatureChart from "@/components/TemperatureChart";
import { FiThermometer } from "react-icons/fi";

const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  IN_PROCESS: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  DISPATCHED: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  RECALLED: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

export default async function LotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lot = await prisma.lot.findUnique({
    where: { id },
    include: {
      product: true,
      supplier: true,
      traceEvents: { orderBy: { createdAt: "asc" } },
      alerts: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lot) notFound();

  const hasTemperatureData = lot.traceEvents.some((e) => e.temperature != null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{lot.lotNumber}</h1>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[lot.status] || ""}`}>
              {lot.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-secondary mt-1 text-sm">{lot.product.name}</p>
        </div>
        <DeleteButton endpoint={`/api/lots/${lot.id}`} redirectTo="/dashboard/lots" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Détails du lot</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-50 rounded-xl p-3">
                <dt className="text-secondary text-xs font-medium mb-1">Produit</dt>
                <dd><Link href={`/dashboard/products/${lot.product.id}`} className="text-primary hover:underline font-medium">{lot.product.name}</Link></dd>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <dt className="text-secondary text-xs font-medium mb-1">Fournisseur</dt>
                <dd>{lot.supplier ? <Link href={`/dashboard/suppliers/${lot.supplier.id}`} className="text-primary hover:underline font-medium">{lot.supplier.name}</Link> : "—"}</dd>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <dt className="text-secondary text-xs font-medium mb-1">Quantité</dt>
                <dd className="font-medium">{lot.quantity} {lot.unit}</dd>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <dt className="text-secondary text-xs font-medium mb-1">Origine</dt>
                <dd className="font-medium">{lot.origin || "—"}</dd>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <dt className="text-secondary text-xs font-medium mb-1">Réception</dt>
                <dd className="font-medium">{new Date(lot.receivedAt).toLocaleDateString("fr-FR")}</dd>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <dt className="text-secondary text-xs font-medium mb-1">Expiration</dt>
                <dd className="font-medium">{lot.expiresAt ? new Date(lot.expiresAt).toLocaleDateString("fr-FR") : "—"}</dd>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <dt className="text-secondary text-xs font-medium mb-1">Température</dt>
                <dd className="font-medium">{lot.temperature != null ? `${lot.temperature}°C` : "—"}</dd>
              </div>
            </dl>
            {lot.notes && <p className="text-sm text-secondary mt-4 border-t border-border pt-4">{lot.notes}</p>}
          </div>

          {hasTemperatureData && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FiThermometer size={18} />
                </div>
                <div>
                  <h2 className="font-semibold">Historique des températures</h2>
                  <p className="text-xs text-secondary">Relevés de température pour ce lot</p>
                </div>
              </div>
              <TemperatureChart events={lot.traceEvents} />
            </div>
          )}

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Timeline de traçabilité</h2>
            <TraceTimeline events={lot.traceEvents} />
            <div className="mt-4 pt-4 border-t border-border">
              <AddTraceEvent lotId={lot.id} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold mb-3">Mettre à jour le statut</h2>
            <LotStatusUpdate lotId={lot.id} currentStatus={lot.status} />
          </div>

          {lot.qrCode && (
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <h2 className="font-semibold mb-3">QR Code</h2>
              <div className="bg-white p-4 rounded-xl inline-block">
                <img src={lot.qrCode} alt={`QR Code for ${lot.lotNumber}`} className="w-full max-w-[180px] mx-auto" />
              </div>
              <p className="text-xs text-secondary mt-3">Scanner pour voir les infos de traçabilité</p>
            </div>
          )}

          {lot.alerts.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold mb-3">Alertes ({lot.alerts.length})</h2>
              <div className="space-y-2">
                {lot.alerts.map((alert) => (
                  <div key={alert.id} className="text-sm p-3 rounded-xl border border-border bg-slate-50">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-xs text-secondary mt-1">{alert.severity} · {alert.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
