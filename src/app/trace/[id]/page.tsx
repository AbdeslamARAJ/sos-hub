import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROCESS: "bg-yellow-50 text-yellow-700 border-yellow-200",
  DISPATCHED: "bg-green-50 text-green-700 border-green-200",
  RECALLED: "bg-red-50 text-red-700 border-red-200",
};

export default async function PublicTracePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lot = await prisma.lot.findUnique({
    where: { id },
    include: {
      product: true,
      supplier: { select: { name: true, country: true, certified: true } },
      traceEvents: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!lot) notFound();

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-primary">SOS Hub</h1>
          <p className="text-secondary text-sm">Food Traceability</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{lot.lotNumber}</h2>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium border ${statusColors[lot.status] || ""}`}>
              {lot.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-secondary text-xs">Product</p>
              <p className="font-medium">{lot.product.name}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-secondary text-xs">Quantity</p>
              <p className="font-medium">{lot.quantity} {lot.unit}</p>
            </div>
            {lot.supplier && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-secondary text-xs">Supplier</p>
                <p className="font-medium">{lot.supplier.name} {lot.supplier.certified ? "✓" : ""}</p>
              </div>
            )}
            {lot.origin && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-secondary text-xs">Origin</p>
                <p className="font-medium">{lot.origin}</p>
              </div>
            )}
            <div className="bg-muted rounded-lg p-3">
              <p className="text-secondary text-xs">Received</p>
              <p className="font-medium">{new Date(lot.receivedAt).toLocaleDateString()}</p>
            </div>
            {lot.expiresAt && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-secondary text-xs">Expires</p>
                <p className="font-medium">{new Date(lot.expiresAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Journey Timeline</h3>
          {lot.traceEvents.length === 0 ? (
            <p className="text-secondary text-sm">No events recorded.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-4">
                {lot.traceEvents.map((event) => (
                  <div key={event.id} className="relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{event.eventType}</span>
                        <span className="text-xs text-secondary">
                          {new Date(event.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {event.description && <p className="text-sm text-secondary">{event.description}</p>}
                      <div className="flex gap-3 text-xs text-secondary mt-0.5">
                        {event.location && <span>📍 {event.location}</span>}
                        {event.temperature != null && <span>🌡️ {event.temperature}°C</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-secondary">
          Powered by SOS Hub · Food Traceability Platform
        </p>
      </div>
    </div>
  );
}
