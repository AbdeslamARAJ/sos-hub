import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import TraceTimeline from "@/components/TraceTimeline";
import LotStatusUpdate from "@/components/LotStatusUpdate";
import AddTraceEvent from "@/components/AddTraceEvent";

const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-50 text-blue-700",
  IN_PROCESS: "bg-yellow-50 text-yellow-700",
  DISPATCHED: "bg-green-50 text-green-700",
  RECALLED: "bg-red-50 text-red-700",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{lot.lotNumber}</h1>
          <p className="text-secondary mt-1">
            {lot.product.name} · <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lot.status] || ""}`}>{lot.status}</span>
          </p>
        </div>
        <DeleteButton endpoint={`/api/lots/${lot.id}`} redirectTo="/dashboard/lots" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-3">Lot Details</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 text-sm">
              <div>
                <dt className="text-secondary">Product</dt>
                <dd><Link href={`/dashboard/products/${lot.product.id}`} className="text-primary hover:underline">{lot.product.name}</Link></dd>
              </div>
              <div>
                <dt className="text-secondary">Supplier</dt>
                <dd>{lot.supplier ? <Link href={`/dashboard/suppliers/${lot.supplier.id}`} className="text-primary hover:underline">{lot.supplier.name}</Link> : "—"}</dd>
              </div>
              <div>
                <dt className="text-secondary">Quantity</dt>
                <dd>{lot.quantity} {lot.unit}</dd>
              </div>
              <div>
                <dt className="text-secondary">Origin</dt>
                <dd>{lot.origin || "—"}</dd>
              </div>
              <div>
                <dt className="text-secondary">Received</dt>
                <dd>{new Date(lot.receivedAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-secondary">Expires</dt>
                <dd>{lot.expiresAt ? new Date(lot.expiresAt).toLocaleDateString() : "—"}</dd>
              </div>
              <div>
                <dt className="text-secondary">Temperature</dt>
                <dd>{lot.temperature != null ? `${lot.temperature}°C` : "—"}</dd>
              </div>
            </dl>
            {lot.notes && <p className="text-sm text-secondary mt-3 border-t border-border pt-3">{lot.notes}</p>}
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Traceability Timeline</h2>
            <TraceTimeline events={lot.traceEvents} />
            <div className="mt-4 pt-4 border-t border-border">
              <AddTraceEvent lotId={lot.id} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-3">Update Status</h2>
            <LotStatusUpdate lotId={lot.id} currentStatus={lot.status} />
          </div>

          {lot.qrCode && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-semibold mb-3">QR Code</h2>
              <img src={lot.qrCode} alt={`QR Code for ${lot.lotNumber}`} className="w-full max-w-[200px] mx-auto" />
              <p className="text-xs text-secondary text-center mt-2">Scan to view trace info</p>
            </div>
          )}

          {lot.alerts.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-semibold mb-3">Alerts ({lot.alerts.length})</h2>
              <div className="space-y-2">
                {lot.alerts.map((alert) => (
                  <div key={alert.id} className="text-sm p-2 rounded-lg border border-border">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-xs text-secondary">{alert.severity} · {alert.status}</p>
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
