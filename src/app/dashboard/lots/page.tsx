import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-100 text-blue-700",
  IN_PROCESS: "bg-amber-100 text-amber-700",
  DISPATCHED: "bg-emerald-100 text-emerald-700",
  RECALLED: "bg-red-100 text-red-700",
};

export default async function LotsPage() {
  const lots = await prisma.lot.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true, supplier: true, _count: { select: { traceEvents: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lots</h1>
          <p className="text-secondary mt-1 text-sm">{lots.length} lot{lots.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/lots/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-600/25"
        >
          <FiPlus size={16} /> Ajouter un lot
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-left text-secondary">
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Lot #</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Produit</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Fournisseur</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Statut</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Quantité</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Événements</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Réception</th>
              </tr>
            </thead>
            <tbody>
              {lots.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-secondary">
                    Aucun lot pour le moment. Ajoutez votre premier lot.
                  </td>
                </tr>
              )}
              {lots.map((lot) => (
                <tr key={lot.id} className="border-b border-border/50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/lots/${lot.id}`} className="text-primary font-medium hover:underline">
                      {lot.lotNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{lot.product.name}</td>
                  <td className="px-5 py-3.5 text-slate-600">{lot.supplier?.name || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[lot.status] || ""}`}>
                      {lot.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{lot.quantity} {lot.unit}</td>
                  <td className="px-5 py-3.5">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-medium">{lot._count.traceEvents}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{new Date(lot.receivedAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
