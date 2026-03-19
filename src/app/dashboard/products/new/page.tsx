import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <ProductForm suppliers={suppliers} />
    </div>
  );
}
