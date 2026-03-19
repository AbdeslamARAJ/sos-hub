"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Lot = { id: string; lotNumber: string };

export default function CreateAlertForm({ lots }: { lots: Lot[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description") || undefined,
        severity: form.get("severity"),
        type: form.get("type"),
        lotId: form.get("lotId") || undefined,
      }),
    });

    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
      >
        Create Alert
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold">New Alert</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input name="title" required className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Severity</label>
          <select name="severity" defaultValue="MEDIUM" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select name="type" defaultValue="QUALITY" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card">
            <option value="QUALITY">Quality</option>
            <option value="TEMPERATURE">Temperature</option>
            <option value="EXPIRY">Expiry</option>
            <option value="RECALL">Recall</option>
            <option value="CONTAMINATION">Contamination</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Related Lot</label>
          <select name="lotId" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card">
            <option value="">None</option>
            {lots.map((l) => <option key={l.id} value={l.id}>{l.lotNumber}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" rows={2} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-hover disabled:opacity-50">
          {loading ? "Creating..." : "Create Alert"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted">
          Cancel
        </button>
      </div>
    </form>
  );
}
