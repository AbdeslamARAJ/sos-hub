import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { supplier: true, lots: { orderBy: { createdAt: "desc" }, take: 10 } },
  });

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-secondary mt-1">SKU: {product.sku} · {product.category || "Uncategorized"}</p>
        </div>
        <DeleteButton endpoint={`/api/products/${product.id}`} redirectTo="/dashboard/products" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">Details</h2>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-secondary">SKU</dt>
            <dd className="font-mono">{product.sku}</dd>
            <dt className="text-secondary">Category</dt>
            <dd>{product.category || "—"}</dd>
            <dt className="text-secondary">Unit</dt>
            <dd>{product.unit}</dd>
            <dt className="text-secondary">Supplier</dt>
            <dd>
              {product.supplier ? (
                <Link href={`/dashboard/suppliers/${product.supplier.id}`} className="text-primary hover:underline">
                  {product.supplier.name}
                </Link>
              ) : "—"}
            </dd>
          </dl>
          {product.description && (
            <div>
              <p className="text-sm text-secondary">Description</p>
              <p className="text-sm mt-1">{product.description}</p>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Lots ({product.lots.length})</h2>
          {product.lots.length === 0 ? (
            <p className="text-secondary text-sm">No lots for this product.</p>
          ) : (
            <ul className="space-y-2">
              {product.lots.map((lot) => (
                <li key={lot.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                  <Link href={`/dashboard/lots/${lot.id}`} className="text-primary hover:underline">{lot.lotNumber}</Link>
                  <span className="text-secondary">{lot.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
