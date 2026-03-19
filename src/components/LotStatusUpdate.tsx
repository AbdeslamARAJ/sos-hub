"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => updateStatus(status)}
          disabled={status === currentStatus || loading}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            status === currentStatus
              ? "bg-primary-light text-primary font-medium"
              : "border border-border hover:bg-muted disabled:opacity-50"
          }`}
        >
          {status.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
