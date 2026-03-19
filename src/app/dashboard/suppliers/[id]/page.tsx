import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiCheck, FiX } from "react-icons/fi";
import DeleteButton from "@/components/DeleteButton";

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      products: true,
      lots: { include: { product: true }, orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!supplier) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{supplier.name}</h1>
          <p className="text-secondary mt-1">
            {supplier.country || "Unknown location"}
            {supplier.certified && " · Certified"}
          </p>
        </div>
        <DeleteButton endpoint={`/api/suppliers/${supplier.id}`} redirectTo="/dashboard/suppliers" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">Details</h2>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-secondary">Contact</dt>
            <dd>{supplier.contact || "—"}</dd>
            <dt className="text-secondary">Email</dt>
            <dd>{supplier.email || "—"}</dd>
            <dt className="text-secondary">Phone</dt>
            <dd>{supplier.phone || "—"}</dd>
            <dt className="text-secondary">Address</dt>
            <dd>{supplier.address || "—"}</dd>
            <dt className="text-secondary">Certified</dt>
            <dd>{supplier.certified ? <FiCheck className="text-success" /> : <FiX className="text-secondary" />}</dd>
          </dl>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Products ({supplier.products.length})</h2>
          {supplier.products.length === 0 ? (
            <p className="text-secondary text-sm">No products from this supplier.</p>
          ) : (
            <ul className="space-y-2">
              {supplier.products.map((p) => (
                <li key={p.id} className="text-sm flex items-center justify-between">
                  <Link href={`/dashboard/products/${p.id}`} className="text-primary hover:underline">{p.name}</Link>
                  <span className="text-secondary">{p.sku}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold mb-3">Recent Lots ({supplier.lots.length})</h2>
        {supplier.lots.length === 0 ? (
          <p className="text-secondary text-sm">No lots from this supplier.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-secondary">
                  <th className="pb-2 font-medium">Lot #</th>
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {supplier.lots.map((lot) => (
                  <tr key={lot.id} className="border-b border-border last:border-0">
                    <td className="py-2">
                      <Link href={`/dashboard/lots/${lot.id}`} className="text-primary hover:underline">{lot.lotNumber}</Link>
                    </td>
                    <td className="py-2">{lot.product.name}</td>
                    <td className="py-2">{lot.status}</td>
                    <td className="py-2">{lot.quantity} {lot.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
