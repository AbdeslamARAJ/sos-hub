import Link from "next/link";

const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-100 text-blue-700",
  IN_PROCESS: "bg-amber-100 text-amber-700",
  DISPATCHED: "bg-emerald-100 text-emerald-700",
  RECALLED: "bg-red-100 text-red-700",
};

type Lot = {
  id: string;
  lotNumber: string;
  status: string;
  quantity: number;
  unit: string;
  receivedAt: Date;
  product: { name: string };
  supplier: { name: string } | null;
};

export default function RecentLotsTable({ lots }: { lots: Lot[] }) {
  if (lots.length === 0) {
    return <p className="text-secondary text-sm py-4">Aucun lot pour le moment.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-secondary">
            <th className="pb-3 font-medium text-xs uppercase tracking-wide">Lot #</th>
            <th className="pb-3 font-medium text-xs uppercase tracking-wide">Produit</th>
            <th className="pb-3 font-medium text-xs uppercase tracking-wide">Statut</th>
            <th className="pb-3 font-medium text-xs uppercase tracking-wide">Qté</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot) => (
            <tr key={lot.id} className="border-b border-border/50 last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="py-3">
                <Link href={`/dashboard/lots/${lot.id}`} className="text-primary hover:underline font-medium">
                  {lot.lotNumber}
                </Link>
              </td>
              <td className="py-3 text-slate-600">{lot.product.name}</td>
              <td className="py-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[lot.status] || ""}`}>
                  {lot.status.replace("_", " ")}
                </span>
              </td>
              <td className="py-3 text-slate-600 font-medium">{lot.quantity} {lot.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
