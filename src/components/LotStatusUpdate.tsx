"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statusConfig: Record<string, { label: string; color: string }> = {
  RECEIVED: { label: "Reçu", color: "bg-blue-100 text-blue-700 ring-blue-200" },
  IN_PROCESS: { label: "En cours", color: "bg-amber-100 text-amber-700 ring-amber-200" },
  DISPATCHED: { label: "Expédié", color: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
  RECALLED: { label: "Rappelé", color: "bg-red-100 text-red-700 ring-red-200" },
};

const statuses = ["RECEIVED", "IN_PROCESS", "DISPATCHED", "RECALLED"];

export default function LotStatusUpdate({ lotId, currentStatus }: { lotId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);
    await fetch(`/api/lots/${lotId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      {statuses.map((status) => {
        const config = statusConfig[status];
        const isCurrent = status === currentStatus;
        return (
          <button
            key={status}
            onClick={() => updateStatus(status)}
            disabled={isCurrent || loading}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isCurrent
                ? `${config.color} ring-1`
                : "border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40"
            }`}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
