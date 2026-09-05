"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type QueueStatus = "waiting" | "called" | "skipped" | "done";

interface QueueData {
  id: number;
  queue_number: number;
  currently_called_number: number | null; // nomor queue_number yg statusnya "called"
  queue_status: QueueStatus;
}

export default function AdminAntrianPage() {
  const [showQR, setShowQR] = useState(false);
  const [queues, setQueues] = useState<QueueData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // ambil token dari localStorage
  const getToken = () => localStorage.getItem("token");

  // 1. fetch semua antrian
  const fetchQueues = useCallback(async () => {
    try {
    const res = await fetch(`${API_URL}/queues`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error("Gagal ambil status antrian");
    const json = await res.json();
    setQueues(json.data); // <-- unwrap
    setError(null);
  } catch {
    setError("Gagal memuat status antrian");
  }
  }, []);

  // 2. auth check + polling
useEffect(() => {
  const token = getToken();
  if (!token) {
    router.push("/login");
    return;
  }
  setLoading(false);
  fetchQueues();
  const interval = setInterval(fetchQueues, 3000);
  return () => clearInterval(interval);
}, [fetchQueues, router]);

  // 3. handleNext
  const handleNext = async () => {
  try {
    const res = await fetch(`${API_URL}/queues/next`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error("Gagal panggil nomor");
    await fetchQueues();
  } catch {
    setError("Gagal memanggil nomor berikutnya");
  }
};

  // 4. handleReset
  const handleReset = async () => {
    try {
    const res = await fetch(`${API_URL}/queues/reset`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error("Gagal panggil nomor");
    await fetchQueues();
  } catch {
    setError("Gagal memanggil nomor berikutnya");
  }
  };

  // 5. handleSkip
  const handleSkip = async (id: number) => {
    try {
        const res = await fetch(`${API_URL}/queues/${id}/skip`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (!res.ok) throw new Error("Gagal panggil nomor");
        await fetchQueues();
    } catch {
        setError("Gagal memanggil nomor berikutnya");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
  <main className="ad-root">
    <header className="ad-header">
      <h1 className="ad-title">Dashboard Kasir</h1>
      <button className="ad-logout" onClick={handleLogout}>Logout</button>
    </header>

    <div className="ad-body">
      {error && <div className="ad-error">{error}</div>}

      <div className="ad-actions">
        <button className="ad-btn-next" onClick={handleNext}>▶ Panggil Berikutnya</button>
        <button className="ad-btn-reset" onClick={handleReset}>↩ Reset Antrian</button>
        <button className="ad-btn-qr" onClick={() => setShowQR(!showQR)}>
          📱 {showQR ? "Sembunyikan QR" : "Tampilkan QR"}
        </button>
      </div>

      {showQR && (
        <div className="ad-qr-container">
          <p className="ad-qr-label">Scan untuk ambil nomor antrian</p>
          <QRCodeSVG value="http://localhost:3000/antrian" size={200} />
        </div>
      )}

      <div className="ad-list">
        {queues.map((queue) => (
          <div key={queue.id} className="ad-item">
            <span className="ad-item-number">#{queue.queue_number}</span>
            <span className={`ad-item-status ad-status-${queue.queue_status}`}>
              {queue.queue_status}
            </span>
            {queue.queue_status === "waiting" && (
              <button className="ad-btn-skip" onClick={() => handleSkip(queue.id)}>
                Skip
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  </main>
);
}