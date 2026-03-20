"use client";

import { useRouter } from "next/navigation";

export default function AlertActions({ alertId }: { alertId: string }) {
  const router = useRouter();

  async function update(status: string) {
    await fetch(`/api/alerts/${alertId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => update("ACKNOWLEDGED")}
        className="text-xs px-3 py-1.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-all"
      >
        Acquitter
      </button>
      <button
        onClick={() => update("RESOLVED")}
        className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-sm"
      >
        Résoudre
      </button>
    </div>
  );
}
