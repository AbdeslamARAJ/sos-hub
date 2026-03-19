import Link from "next/link";

const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-50 text-blue-700",
  IN_PROCESS: "bg-yellow-50 text-yellow-700",
  DISPATCHED: "bg-green-50 text-green-700",
  RECALLED: "bg-red-50 text-red-700",
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
    return <p className="text-secondary text-sm py-4">No lots yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-secondary">
            <th className="pb-2 font-medium">Lot #</th>
            <th className="pb-2 font-medium">Product</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium">Qty</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot) => (
            <tr key={lot.id} className="border-b border-border last:border-0">
              <td className="py-3">
                <Link href={`/dashboard/lots/${lot.id}`} className="text-primary hover:underline font-medium">
                  {lot.lotNumber}
                </Link>
              </td>
              <td className="py-3">{lot.product.name}</td>
              <td className="py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lot.status] || ""}`}>
                  {lot.status}
                </span>
              </td>
              <td className="py-3">{lot.quantity} {lot.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
