import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-50 text-blue-700",
  IN_PROCESS: "bg-yellow-50 text-yellow-700",
  DISPATCHED: "bg-green-50 text-green-700",
  RECALLED: "bg-red-50 text-red-700",
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
          <h1 className="text-2xl font-bold">Lots</h1>
          <p className="text-secondary mt-1">{lots.length} lot{lots.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/lots/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
        >
          <FiPlus size={16} /> Add Lot
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted text-left text-secondary">
                <th className="px-4 py-3 font-medium">Lot #</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Events</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {lots.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-secondary">
                    No lots yet. Add your first lot.
                  </td>
                </tr>
              )}
              {lots.map((lot) => (
                <tr key={lot.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/lots/${lot.id}`} className="text-primary font-medium hover:underline">
                      {lot.lotNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{lot.product.name}</td>
                  <td className="px-4 py-3">{lot.supplier?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lot.status] || ""}`}>
                      {lot.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{lot.quantity} {lot.unit}</td>
                  <td className="px-4 py-3">{lot._count.traceEvents}</td>
                  <td className="px-4 py-3 text-secondary">{new Date(lot.receivedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
