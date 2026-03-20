"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

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
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-600/25"
      >
        <FiPlus size={16} /> Créer une alerte
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <h3 className="font-semibold text-slate-800">Nouvelle alerte</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Titre *</label>
          <input name="title" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Sévérité</label>
          <select name="severity" defaultValue="MEDIUM" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
            <option value="LOW">Faible</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Haute</option>
            <option value="CRITICAL">Critique</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Type</label>
          <select name="type" defaultValue="QUALITY" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
            <option value="QUALITY">Qualité</option>
            <option value="TEMPERATURE">Température</option>
            <option value="EXPIRY">Expiration</option>
            <option value="RECALL">Rappel</option>
            <option value="CONTAMINATION">Contamination</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Lot associé</label>
          <select name="lotId" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
            <option value="">Aucun</option>
            {lots.map((l) => <option key={l.id} value={l.id}>{l.lotNumber}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Description</label>
          <textarea name="description" rows={2} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm">
          {loading ? "Création..." : "Créer l'alerte"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50 transition-all">
          Annuler
        </button>
      </div>
    </form>
  );
}
