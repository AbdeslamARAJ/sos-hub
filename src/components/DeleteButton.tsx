"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

export default function DeleteButton({
  endpoint,
  redirectTo,
}: {
  endpoint: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    await fetch(endpoint, { method: "DELETE" });
    router.push(redirectTo);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-secondary">Confirm?</span>
        <button
          onClick={handleDelete}
          className="text-sm bg-danger text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-2 text-sm text-danger hover:bg-danger-light px-3 py-1.5 rounded-lg transition-colors"
    >
      <FiTrash2 size={14} /> Delete
    </button>
  );
}
