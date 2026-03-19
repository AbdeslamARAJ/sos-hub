"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const eventTypes = ["RECEIVED", "INSPECTED", "STORED", "PROCESSED", "SHIPPED", "RECALLED"];

export default function AddTraceEvent({ lotId }: { lotId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    await fetch(`/api/lots/${lotId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: form.get("eventType"),
        location: form.get("location") || undefined,
        description: form.get("description") || undefined,
        temperature: form.get("temperature") || undefined,
        performedBy: form.get("performedBy") || undefined,
      }),
    });

    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm text-primary hover:underline font-medium">
        + Add Trace Event
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Event Type *</label>
          <select name="eventType" required className="w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card">
            {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Location</label>
          <input name="location" className="w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Temperature (°C)</label>
          <input name="temperature" type="number" step="0.1" className="w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Performed By</label>
          <input name="performedBy" className="w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1">Description</label>
          <input name="description" className="w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-hover disabled:opacity-50">
          {loading ? "Adding..." : "Add Event"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-muted">
          Cancel
        </button>
      </div>
    </form>
  );
}
