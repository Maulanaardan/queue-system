// app/antrian/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "queue_id";
const POLL_INTERVAL_MS = 3000;
const NEAR_THRESHOLD = 3;
const API_URL = process.env.NEXT_PUBLIC_API_URL

type QueueStatus = "waiting" | "called" | "skipped" | "done";

interface QueueData {
  id: number;
  queue_number: number;
  currently_called_number: number | null; // nomor queue_number yg statusnya "called"
  queue_status: QueueStatus;
}

export default function AntrianPage() {
  const [data, setData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const fetchStatus = useCallback(async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/queues/${id}`);
    if (!res.ok) throw new Error("Gagal ambil status antrian");
    const json = await res.json();
    setData(json.data); // <-- unwrap
    setError(null);
  } catch {
    setError("Gagal memuat status antrian");
    setData(null);
  }
}, []);

const handleAmbilNomor = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(`${API_URL}/queues`, { method: "POST" });
    if (!res.ok) throw new Error("Gagal ambil nomor");
    const json = await res.json();
    localStorage.setItem(STORAGE_KEY, String(json.data.id)); // <-- unwrap
    setData(json.data);
  } catch {
    setError("Gagal mengambil nomor antrian");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  const savedId = localStorage.getItem(STORAGE_KEY);
  if (savedId) fetchStatus(Number(savedId)); // ← ini yang hilang
}, [fetchStatus]);

  useEffect(() => {
    if (!data || data.queue_status !== "waiting") return;
    const interval = setInterval(() => fetchStatus(data.id), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [data, fetchStatus]);

  const isNear =
    data && data.queue_status === "waiting" && data.currently_called_number !== null
      ? data.queue_number - data.currently_called_number <= NEAR_THRESHOLD
      : false;

  const statusLabel: Record<QueueStatus, string> = {
    waiting: "Menunggu",
    called: "Dipanggil — silakan menuju loket",
    skipped: "Terlewat",
    done: "Selesai dilayani",
  };

  return (
    <main className="ap-root">
      <div className="ap-header">
        <h1 className="ap-title">Antrian Digital</h1>
        <p className="ap-subtitle">Tunggu giliran Anda</p>
      </div>

      {error && <div className="ap-error">{error}</div>}

      {!data && (
        <button onClick={handleAmbilNomor} disabled={loading} className="ap-btn">
          {loading ? "Memproses..." : "Ambil Nomor Antrian"}
        </button>
      )}

      {data && (
        <div className="ap-content">
          <div className="ap-card">
            <p className="ap-card-label">Nomor Anda</p>
            <div className="ap-number-big">{data.queue_number}</div>
            <div style={{
              display: "inline-block",
              background: data.queue_status === "called" ? "#DCFCE7" :
                          data.queue_status === "skipped" ? "#FEE2E2" : "#EFF6FF",
              color: data.queue_status === "called" ? "#16A34A" :
                    data.queue_status === "skipped" ? "#DC2626" : "#2563EB",
              borderRadius: 20, padding: "4px 16px",
              fontSize: 13, fontWeight: 600, marginTop: 8
            }}>
              {statusLabel[data.queue_status]}
            </div>
          </div>

          <div className="ap-card">
            <p className="ap-card-label">Sedang Dipanggil</p>
            <div className="ap-number-medium">{data.currently_called_number ?? "-"}</div>
          </div>

          {isNear && (
            <div className="ap-near-alert">
              🔔 Giliran Anda sudah dekat, silakan bersiap!
            </div>
          )}
        </div>
      )}
    </main>
  );
}