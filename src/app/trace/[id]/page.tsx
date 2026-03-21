import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FiPackage, FiSearch, FiHome, FiSettings, FiTruck, FiAlertTriangle, FiCheck, FiMapPin, FiThermometer, FiClock } from "react-icons/fi";

const statusConfig: Record<string, { label: string; color: string }> = {
  RECEIVED: { label: "Reçu", color: "bg-blue-100 text-blue-700 border-blue-200" },
  IN_PROCESS: { label: "En cours", color: "bg-amber-100 text-amber-700 border-amber-200" },
  DISPATCHED: { label: "Expédié", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  RECALLED: { label: "Rappelé", color: "bg-red-100 text-red-700 border-red-200" },
};

const eventConfig: Record<string, { icon: typeof FiPackage; color: string; bg: string }> = {
  RECEIVED: { icon: FiPackage, color: "text-blue-600", bg: "bg-blue-100" },
  INSPECTED: { icon: FiSearch, color: "text-indigo-600", bg: "bg-indigo-100" },
  STORED: { icon: FiHome, color: "text-slate-600", bg: "bg-slate-100" },
  PROCESSED: { icon: FiSettings, color: "text-violet-600", bg: "bg-violet-100" },
  SHIPPED: { icon: FiTruck, color: "text-emerald-600", bg: "bg-emerald-100" },
  RECALLED: { icon: FiAlertTriangle, color: "text-red-600", bg: "bg-red-100" },
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

  const status = statusConfig[lot.status] || { label: lot.status, color: "" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="text-center pt-4 pb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/25">
            <span className="text-white font-bold text-sm">SH</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">SOS Hub</h1>
          <p className="text-slate-400 text-xs">Traçabilité alimentaire</p>
        </div>

        {/* Lot Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{lot.lotNumber}</h2>
            <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-sm font-semibold border ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-slate-400 text-xs font-medium">Produit</p>
              <p className="font-semibold text-slate-800 mt-0.5">{lot.product.name}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-slate-400 text-xs font-medium">Quantité</p>
              <p className="font-semibold text-slate-800 mt-0.5">{lot.quantity} {lot.unit}</p>
            </div>
            {lot.supplier && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 text-xs font-medium">Fournisseur</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {lot.supplier.name}
                  {lot.supplier.certified && (
                    <span className="inline-flex items-center ml-1.5 w-4 h-4 bg-emerald-100 text-emerald-600 rounded-full">
                      <FiCheck size={10} className="mx-auto" />
                    </span>
                  )}
                </p>
              </div>
            )}
            {lot.origin && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 text-xs font-medium">Origine</p>
                <p className="font-semibold text-slate-800 mt-0.5">{lot.origin}</p>
              </div>
            )}
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-slate-400 text-xs font-medium">Réception</p>
              <p className="font-semibold text-slate-800 mt-0.5">{new Date(lot.receivedAt).toLocaleDateString("fr-FR")}</p>
            </div>
            {lot.expiresAt && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 text-xs font-medium">Expiration</p>
                <p className="font-semibold text-slate-800 mt-0.5">{new Date(lot.expiresAt).toLocaleDateString("fr-FR")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-5">Parcours du lot</h3>
          {lot.traceEvents.length === 0 ? (
            <p className="text-slate-400 text-sm">Aucun événement enregistré.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-slate-200 to-transparent" />
              <div className="space-y-4">
                {lot.traceEvents.map((event, i) => {
                  const config = eventConfig[event.eventType] || { icon: FiPackage, color: "text-slate-600", bg: "bg-slate-100" };
                  const Icon = config.icon;
                  const isLast = i === lot.traceEvents.length - 1;
                  return (
                    <div key={event.id} className="relative pl-12">
                      <div className={`absolute left-1.5 top-2 w-8 h-8 rounded-xl ${config.bg} ${config.color} flex items-center justify-center`}>
                        <Icon size={14} />
                      </div>
                      <div className={`p-4 rounded-xl border ${
                        isLast ? "border-blue-200 bg-blue-50/50" : "border-slate-100 bg-slate-50"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-slate-800">{event.eventType.replace("_", " ")}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <FiClock size={10} />
                            {new Date(event.createdAt).toLocaleString("fr-FR")}
                          </span>
                        </div>
                        {event.description && <p className="text-sm text-slate-500 mt-1">{event.description}</p>}
                        <div className="flex gap-3 mt-2 text-xs text-slate-500">
                          {event.location && (
                            <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                              <FiMapPin size={10} className="text-slate-400" /> {event.location}
                            </span>
                          )}
                          {event.temperature != null && (
                            <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100 font-medium">
                              <FiThermometer size={10} /> {event.temperature}°C
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pb-4">
          <p className="text-[11px] text-slate-400">
            SOS Hub · Plateforme de traçabilité alimentaire
          </p>
        </div>
      </div>
    </div>
  );
}
