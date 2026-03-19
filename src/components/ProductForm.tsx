"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Supplier = { id: string; name: string };

export default function ProductForm({ suppliers }: { suppliers: Supplier[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      sku: form.get("sku"),
      category: form.get("category") || undefined,
      description: form.get("description") || undefined,
      unit: form.get("unit") || "kg",
      supplierId: form.get("supplierId") || undefined,
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard/products");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input name="name" required className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU *</label>
          <input name="sku" required className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input name="category" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <select name="unit" defaultValue="kg" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card">
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
            <option value="oz">oz</option>
            <option value="L">L</option>
            <option value="mL">mL</option>
            <option value="unit">unit</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Supplier</label>
          <select name="supplierId" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card">
            <option value="">No supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" rows={3} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50">
          {loading ? "Creating..." : "Create Product"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
