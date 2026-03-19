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
    <div className="flex gap-1">
      <button
        onClick={() => update("ACKNOWLEDGED")}
        className="text-xs px-2 py-1 border border-border rounded hover:bg-muted transition-colors"
      >
        Acknowledge
      </button>
      <button
        onClick={() => update("RESOLVED")}
        className="text-xs px-2 py-1 bg-success text-white rounded hover:bg-green-700 transition-colors"
      >
        Resolve
      </button>
    </div>
  );
}
