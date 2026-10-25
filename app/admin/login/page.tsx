"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-sky-50 px-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-pink-100">
        <div className="text-center">
          <div className="text-5xl">🔐</div>

          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Pim Sumon Admin
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            เข้าสู่ระบบหลังร้าน
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">
              Username
            </label>

            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="ชื่อผู้ใช้"
              autoComplete="username"
              className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none transition focus:border-pink-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="รหัสผ่าน"
              autoComplete="current-password"
              className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none transition focus:border-pink-300"
            />
          </div>

          {message && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 font-black text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          เฉพาะผู้ดูแลร้านเท่านั้น
        </p>
      </div>
    </main>
  );
}