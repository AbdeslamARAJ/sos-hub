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
          <h1 className="text-2xl font-bold tracking-tight">Fournisseurs</h1>
          <p className="text-secondary mt-1 text-sm">{suppliers.length} fournisseur{suppliers.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/suppliers/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-600/25"
        >
          <FiPlus size={16} /> Ajouter
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-left text-secondary">
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Nom</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Pays</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Contact</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Certifié</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Produits</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Lots</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-secondary">
                    Aucun fournisseur pour le moment.
                  </td>
                </tr>
              )}
              {suppliers.map((s) => (
                <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/suppliers/${s.id}`} className="text-primary font-medium hover:underline">
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{s.country || "—"}</td>
                  <td className="px-5 py-3.5 text-slate-600">{s.email || s.phone || "—"}</td>
                  <td className="px-5 py-3.5">
                    {s.certified ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg"><FiCheck size={14} /></span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 text-slate-400 rounded-lg"><FiX size={14} /></span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-medium">{s._count.products}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-medium">{s._count.lots}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
