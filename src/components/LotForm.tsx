"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Product = { id: string; name: string; sku: string };
type Supplier = { id: string; name: string };

export default function LotForm({ products, suppliers }: { products: Product[]; suppliers: Supplier[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = {
      lotNumber: form.get("lotNumber"),
      productId: form.get("productId"),
      supplierId: form.get("supplierId") || undefined,
      quantity: form.get("quantity"),
      unit: form.get("unit") || "kg",
      origin: form.get("origin") || undefined,
      expiresAt: form.get("expiresAt") || undefined,
      temperature: form.get("temperature") || undefined,
      notes: form.get("notes") || undefined,
    };

    const res = await fetch("/api/lots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard/lots");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Lot Number *</label>
          <input name="lotNumber" required className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" placeholder="LOT-2026-001" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Product *</label>
          <select name="productId" required className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card">
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Supplier</label>
          <select name="supplierId" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card">
            <option value="">No supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity *</label>
          <input name="quantity" type="number" step="0.01" required className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <select name="unit" defaultValue="kg" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card">
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
            <option value="L">L</option>
            <option value="unit">unit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Origin</label>
          <input name="origin" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" placeholder="Farm or facility" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input name="expiresAt" type="date" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Temperature (°C)</label>
          <input name="temperature" type="number" step="0.1" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea name="notes" rows={3} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50">
          {loading ? "Creating..." : "Create Lot"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
