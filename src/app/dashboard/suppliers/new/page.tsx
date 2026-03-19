"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewSupplierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      contact: form.get("contact") || undefined,
      email: form.get("email") || undefined,
      phone: form.get("phone") || undefined,
      address: form.get("address") || undefined,
      country: form.get("country") || undefined,
      certified: form.get("certified") === "on",
    };

    const res = await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard/suppliers");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Supplier</h1>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input name="name" required className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Person</label>
            <input name="contact" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input name="phone" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input name="country" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input name="address" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input name="certified" type="checkbox" className="rounded" />
            <label className="text-sm font-medium">Certified Supplier</label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50">
            {loading ? "Creating..." : "Create Supplier"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
