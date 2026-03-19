import { prisma } from "@/lib/prisma";
import LotForm from "@/components/LotForm";

export default async function NewLotPage() {
  const [products, suppliers] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Lot</h1>
      <LotForm products={products} suppliers={suppliers} />
    </div>
  );
}
