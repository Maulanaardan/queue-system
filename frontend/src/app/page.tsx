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
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 24, textAlign: "center" }}>
      <h1>Antrian</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!data && (
        <button onClick={handleAmbilNomor} disabled={loading}>
          {loading ? "Memproses..." : "Ambil Nomor"}
        </button>
      )}

      {data && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 48, fontWeight: "bold" }}>{data.queue_number}</div>
          <p>Nomor Anda</p>

          <hr style={{ margin: "16px 0" }} />

          <div style={{ fontSize: 32 }}>{data.currently_called_number ?? "-"}</div>
          <p>Nomor yang sedang dipanggil</p>

          <hr style={{ margin: "16px 0" }} />

          <p>
            Status: <strong>{statusLabel[data.queue_status]}</strong>
          </p>

          {isNear && (
            <div style={{ marginTop: 16, padding: 12, background: "#fff3cd", borderRadius: 8 }}>
              🔔 Nomor Anda sudah dekat, silakan bersiap!
            </div>
          )}
        </div>
      )}
    </main>
  );
}