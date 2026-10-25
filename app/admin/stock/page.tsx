"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type StockStatus = "available" | "sold";

type StockItem = {
  id: string;
  productName: string;
  packageLabel: string;
  email: string;
  password: string;
  note: string;
  status: StockStatus;
  createdAt: string;
};

const STORAGE_KEY = "pimSumonStock";

export default function StockAdminPage() {
  const [stock, setStock] = useState<StockItem[]>([]);

  const [productName, setProductName] = useState("");
  const [packageLabel, setPackageLabel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "available" | "sold"
  >("all");

  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setStock(parsed);
        }
      }
    } catch (error) {
      console.error("โหลดสต็อกไม่สำเร็จ", error);
    }
  }, []);

  const saveStock = (items: StockItem[]) => {
    setStock(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const availableCount = useMemo(() => {
    return stock.filter((item) => item.status === "available").length;
  }, [stock]);

  const soldCount = useMemo(() => {
    return stock.filter((item) => item.status === "sold").length;
  }, [stock]);

  const filteredStock = useMemo(() => {
    return stock.filter((item) => {
      const keyword = search.trim().toLowerCase();

      const matchSearch =
        !keyword ||
        item.productName.toLowerCase().includes(keyword) ||
        item.packageLabel.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword);

      const matchFilter =
        filter === "all" || item.status === filter;

      return matchSearch && matchFilter;
    });
  }, [stock, search, filter]);

  const addStock = () => {
    setMessage("");

    if (!productName.trim()) {
      setMessage("กรุณากรอกชื่อสินค้า");
      return;
    }

    if (!packageLabel.trim()) {
      setMessage("กรุณากรอกแพ็กเกจ");
      return;
    }

    if (!email.trim() && !password.trim()) {
      setMessage("กรุณากรอกข้อมูลบัญชีหรือรหัสผ่าน");
      return;
    }

    const newItem: StockItem = {
      id: `STOCK-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`,
      productName: productName.trim(),
      packageLabel: packageLabel.trim(),
      email: email.trim(),
      password: password.trim(),
      note: note.trim(),
      status: "available",
      createdAt: new Date().toISOString(),
    };

    const next = [newItem, ...stock];

    saveStock(next);

    setEmail("");
    setPassword("");
    setNote("");

    setMessage("เพิ่มสต็อกสำเร็จ ✓");
  };

  const changeStatus = (
    id: string,
    status: StockStatus
  ) => {
    const next = stock.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
          }
        : item
    );

    saveStock(next);
  };

  const deleteStock = (id: string) => {
    const confirmed = window.confirm(
      "ต้องการลบสต็อกรายการนี้ใช่หรือไม่?"
    );

    if (!confirmed) return;

    const next = stock.filter((item) => item.id !== id);

    saveStock(next);
  };

  const copyAccount = async (item: StockItem) => {
    const text = [
      `สินค้า: ${item.productName}`,
      `แพ็กเกจ: ${item.packageLabel}`,
      item.email ? `MAIL: ${item.email}` : "",
      item.password ? `PASS: ${item.password}` : "",
      item.note ? `หมายเหตุ: ${item.note}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setMessage("คัดลอกข้อมูลแล้ว ✓");
    } catch {
      setMessage("ไม่สามารถคัดลอกได้");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="text-sm font-bold text-pink-500 hover:text-pink-600"
            >
              ← กลับหลังร้าน
            </Link>

            <h1 className="mt-2 text-3xl font-black text-slate-900">
              จัดการสต็อก 
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              เพิ่มบัญชีแอปและจัดการสินค้าพร้อมขาย
            </p>
          </div>

          <Link
            href="/products"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-100"
          >
            ดูหน้าสินค้า
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-pink-100">
            <p className="text-sm font-bold text-slate-400">
              สต็อกทั้งหมด
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {stock.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <p className="text-sm font-bold text-slate-400">
              พร้อมขาย
            </p>
            <p className="mt-2 text-3xl font-black text-green-500">
              {availableCount}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100">
            <p className="text-sm font-bold text-slate-400">
              ขายแล้ว
            </p>
            <p className="mt-2 text-3xl font-black text-orange-500">
              {soldCount}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-pink-100">
            <h2 className="text-xl font-black text-slate-900">
              + เติมสต็อก
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-600">
                  ชื่อสินค้า
                </label>

                <input
                  value={productName}
                  onChange={(e) =>
                    setProductName(e.target.value)
                  }
                  placeholder="เช่น iQIYI Premium"
                  className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-300"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-600">
                  แพ็กเกจ
                </label>

                <input
                  value={packageLabel}
                  onChange={(e) =>
                    setPackageLabel(e.target.value)
                  }
                  placeholder="เช่น 7 วัน หาร 4"
                  className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-300"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-600">
                  Email / Username
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-300"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-600">
                  Password
                </label>

                <input
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="รหัสผ่าน"
                  className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-300"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-600">
                  หมายเหตุ
                </label>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เช่น Exp 01/11"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-300"
                />
              </div>

              {message && (
                <div className="rounded-2xl bg-pink-50 px-4 py-3 text-sm font-bold text-pink-600">
                  {message}
                </div>
              )}

              <button
                onClick={addStock}
                className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 font-black text-white shadow-sm transition hover:opacity-90"
              >
                + เพิ่มเข้าสต็อก
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาสินค้า แพ็กเกจ หรือ Email..."
                className="flex-1 rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none focus:border-pink-300"
              />

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value as
                      | "all"
                      | "available"
                      | "sold"
                  )
                }
                className="rounded-2xl border border-pink-100 bg-white px-4 py-3 font-bold outline-none"
              >
                <option value="all">ทั้งหมด</option>
                <option value="available">
                  พร้อมขาย
                </option>
                <option value="sold">ขายแล้ว</option>
              </select>
            </div>

            {filteredStock.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-pink-100">
                <div className="text-5xl"></div>
                <p className="mt-4 font-bold text-slate-500">
                  ยังไม่มีสต็อก
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStock.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-pink-100"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-slate-900">
                            {item.productName}
                          </h3>

                          {item.status === "available" ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-600">
                              พร้อมขาย
                            </span>
                          ) : (
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                              ขายแล้ว
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm font-bold text-pink-500">
                          {item.packageLabel}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteStock(item.id)}
                        className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-500"
                      >
                        ลบ
                      </button>
                    </div>

                    <div className="mt-4 rounded-2xl bg-slate-950 p-4 font-mono text-sm text-white">
                      {item.email && (
                        <p>
                          MAIL — {item.email}
                        </p>
                      )}

                      {item.password && (
                        <p className="mt-1">
                          PASS — {item.password}
                        </p>
                      )}

                      {item.note && (
                        <p className="mt-2 text-slate-300">
                          {item.note}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => copyAccount(item)}
                        className="rounded-2xl bg-pink-50 px-4 py-2 text-sm font-black text-pink-600"
                      >
                         คัดลอก
                      </button>

                      {item.status === "available" ? (
                        <button
                          onClick={() =>
                            changeStatus(item.id, "sold")
                          }
                          className="rounded-2xl bg-orange-50 px-4 py-2 text-sm font-black text-orange-600"
                        >
                          ทำเครื่องหมายว่าขายแล้ว
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            changeStatus(
                              item.id,
                              "available"
                            )
                          }
                          className="rounded-2xl bg-green-50 px-4 py-2 text-sm font-black text-green-600"
                        >
                          คืนเข้าสต็อก
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
