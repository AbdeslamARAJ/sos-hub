"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { FiCamera, FiX, FiCheckCircle, FiAlertCircle, FiSearch } from "react-icons/fi";

type ScanResult = {
  type: "success" | "error";
  message: string;
  lotId?: string;
};

export default function QRScannerClient() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [manualCode, setManualCode] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<string>("qr-reader-" + Math.random().toString(36).slice(2));

  async function startScanning() {
    setResult(null);
    setScanning(true);

    try {
      const scanner = new Html5Qrcode(containerRef.current);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleDecodedText(decodedText);
          stopScanning();
        },
        () => {}
      );
    } catch {
      setResult({ type: "error", message: "Impossible d'accéder à la caméra. Vérifiez les permissions." });
      setScanning(false);
    }
  }

  function handleDecodedText(text: string) {
    try {
      // Try parsing as JSON (our format)
      const data = JSON.parse(text);
      if (data.lotId) {
        setResult({ type: "success", message: `Lot ${data.lotNumber || data.lotId} détecté`, lotId: data.lotId });
        return;
      }
      if (data.url) {
        const match = data.url.match(/\/trace\/(.+)$/);
        if (match) {
          setResult({ type: "success", message: `Lot détecté via URL`, lotId: match[1] });
          return;
        }
      }
    } catch {
      // Not JSON, try URL pattern
      const urlMatch = text.match(/\/trace\/([a-zA-Z0-9_-]+)/);
      if (urlMatch) {
        setResult({ type: "success", message: "Lot détecté via QR Code", lotId: urlMatch[1] });
        return;
      }
    }
    setResult({ type: "error", message: "QR Code non reconnu. Ce n'est pas un code SOS Hub." });
  }

  async function stopScanning() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // ignore
      }
      scannerRef.current = null;
    }
    setScanning(false);
  }

  async function handleManualSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const res = await fetch(`/api/lots/search?q=${encodeURIComponent(manualCode.trim())}`);
    if (res.ok) {
      const data = await res.json();
      if (data.id) {
        setResult({ type: "success", message: `Lot ${data.lotNumber} trouvé`, lotId: data.id });
        return;
      }
    }
    setResult({ type: "error", message: `Aucun lot trouvé pour "${manualCode}"` });
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scanner QR Code</h1>
        <p className="text-secondary mt-1 text-sm">Scannez un QR code pour consulter la traçabilité d'un lot</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Scanner */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FiCamera size={18} />
            </div>
            <div>
              <h2 className="font-semibold">Scanner avec la caméra</h2>
              <p className="text-xs text-secondary">Pointez la caméra vers un QR code</p>
            </div>
          </div>

          <div className="relative">
            <div
              id={containerRef.current}
              className={`w-full rounded-xl overflow-hidden bg-slate-900 ${scanning ? "min-h-[300px]" : "hidden"}`}
            />

            {!scanning && (
              <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                  <FiCamera size={28} />
                </div>
                <p className="text-slate-500 text-sm mb-4">Appuyez pour activer la caméra</p>
                <button
                  onClick={startScanning}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-600/25"
                >
                  Démarrer le scan
                </button>
              </div>
            )}

            {scanning && (
              <button
                onClick={stopScanning}
                className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-xl hover:bg-black/80 transition-all z-10"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Manual Search */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
              <FiSearch size={18} />
            </div>
            <div>
              <h2 className="font-semibold">Recherche manuelle</h2>
              <p className="text-xs text-secondary">Entrez un numéro de lot</p>
            </div>
          </div>

          <form onSubmit={handleManualSearch} className="space-y-3">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ex: LOT-2024-001"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            <button
              type="submit"
              className="w-full bg-violet-600 text-white py-2.5 rounded-xl hover:bg-violet-700 transition-all text-sm font-medium shadow-lg shadow-violet-600/25"
            >
              Rechercher
            </button>
          </form>

          <div className="mt-6 bg-slate-50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Comment ça marche</h3>
            <ol className="text-sm text-slate-500 space-y-2">
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">1</span>
                Scannez le QR code sur l'emballage
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">2</span>
                Le lot est automatiquement identifié
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">3</span>
                Consultez la traçabilité complète
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-2xl p-5 flex items-center gap-4 ${
          result.type === "success"
            ? "bg-emerald-50 border border-emerald-200"
            : "bg-red-50 border border-red-200"
        }`}>
          {result.type === "success" ? (
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
              <FiCheckCircle size={22} />
            </div>
          ) : (
            <div className="p-2 bg-red-100 rounded-xl text-red-600">
              <FiAlertCircle size={22} />
            </div>
          )}
          <div className="flex-1">
            <p className={`font-semibold text-sm ${result.type === "success" ? "text-emerald-800" : "text-red-800"}`}>
              {result.message}
            </p>
          </div>
          {result.lotId && (
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/dashboard/lots/${result.lotId}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
              >
                Voir le lot
              </button>
              <button
                onClick={() => router.push(`/trace/${result.lotId}`)}
                className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
              >
                Page publique
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
