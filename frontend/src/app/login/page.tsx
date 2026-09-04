"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
        const res = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
        setError(data.message || "Login gagal");
        return;
        }
        localStorage.setItem("token", data.token);
        router.push("/admin/antrian");
    } catch {
        setError("Gagal terhubung ke server");
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="lp-root">
        <div className="lp-card">
        <div className="lp-brand">
            <div className="lp-brand-title">Restoran</div>
            <div className="lp-brand-sub">Staff Portal</div>
        </div>

        <div className="lp-divider" />

        <div className="lp-field">
            <label className="lp-label">Username</label>
            <input
            className="lp-input"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
        </div>

        <div className="lp-field">
            <label className="lp-label">Password</label>
            <input
            className="lp-input"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
        </div>

        {error && <p className="lp-error">{error}</p>}

        <button className="lp-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
        </button>

        <div className="lp-footer">Kedai Gadabum © 2025</div>
        </div>
    </div>
  );
}