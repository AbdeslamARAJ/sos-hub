"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

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
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 text-sm text-primary hover:text-blue-700 font-medium transition-colors">
        <FiPlus size={14} /> Ajouter un événement
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Type d'événement *</label>
          <select name="eventType" required className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
            {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Lieu</label>
          <input name="location" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Température (°C)</label>
          <input name="temperature" type="number" step="0.1" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Effectué par</label>
          <input name="performedBy" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
          <input name="description" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm">
          {loading ? "Ajout..." : "Ajouter"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-slate-50 transition-all">
          Annuler
        </button>
      </div>
    </form>
  );
}
