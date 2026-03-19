import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiPlus, FiCheck, FiX } from "react-icons/fi";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true, lots: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-secondary mt-1">{suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/suppliers/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
        >
          <FiPlus size={16} /> Add Supplier
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted text-left text-secondary">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Certified</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Lots</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-secondary">
                    No suppliers yet. Add your first supplier.
                  </td>
                </tr>
              )}
              {suppliers.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/suppliers/${s.id}`} className="text-primary font-medium hover:underline">
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{s.country || "—"}</td>
                  <td className="px-4 py-3">{s.email || s.phone || "—"}</td>
                  <td className="px-4 py-3">
                    {s.certified ? (
                      <span className="text-success"><FiCheck size={16} /></span>
                    ) : (
                      <span className="text-secondary"><FiX size={16} /></span>
                    )}
                  </td>
                  <td className="px-4 py-3">{s._count.products}</td>
                  <td className="px-4 py-3">{s._count.lots}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
