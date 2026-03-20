import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { supplier: true, _count: { select: { lots: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produits</h1>
          <p className="text-secondary mt-1 text-sm">{products.length} produit{products.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/products/new"
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
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">SKU</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Catégorie</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Fournisseur</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Unité</th>
                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wide">Lots</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-secondary">
                    Aucun produit pour le moment.
                  </td>
                </tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/products/${p.id}`} className="text-primary font-medium hover:underline">{p.name}</Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded-md">{p.sku}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{p.category || "—"}</td>
                  <td className="px-5 py-3.5 text-slate-600">{p.supplier?.name || "—"}</td>
                  <td className="px-5 py-3.5 text-slate-600">{p.unit}</td>
                  <td className="px-5 py-3.5">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-medium">{p._count.lots}</span>
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
