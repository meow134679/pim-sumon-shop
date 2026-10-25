Admin>stock
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type StockItem = {
  id: string;
  product: string;
  packageName: string;
  email: string;
  password: string;
  deliveryText: string;
  status: "available" | "used";
  createdAt: string;
};

const STORAGE_KEY = "pimSumonStock";

export default function StockPage() {
  const router = useRouter();

  const [stocks, setStocks] = useState<StockItem[]>([]);

  const [product, setProduct] = useState("");
  const [packageName, setPackageName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deliveryText, setDeliveryText] = useState("");

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setStocks(parsed);
      }
    } catch {
      setStocks([]);
    }
  }, []);

  const saveStocks = (newStocks: StockItem[]) => {
    setStocks(newStocks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStocks));
  };

  const addStock = () => {
    if (!product.trim()) {
      setMessage("กรุณากรอกชื่อสินค้า");
      return;
    }

    if (!packageName.trim()) {
      setMessage("กรุณากรอกแพ็กเกจ");
      return;
    }

    if (!email.trim() && !password.trim() && !deliveryText.trim()) {
      setMessage("กรุณากรอกข้อมูลสำหรับส่งสินค้า");
      return;
    }

    const item: StockItem = {
      id: `STOCK-${Date.now()}`,
      product: product.trim(),
      packageName: packageName.trim(),
      email: email.trim(),
      password: password.trim(),
      deliveryText: deliveryText.trim(),
      status: "available",
      createdAt: new Date().toISOString(),
    };

    saveStocks([item, ...stocks]);

    setProduct("");
    setPackageName("");
    setEmail("");
    setPassword("");
    setDeliveryText("");
    setMessage("");
  };

  const deleteStock = (id: string) => {
    const confirmDelete = window.confirm(
      "ต้องการลบ Stock นี้หรือไม่?"
    );

    if (!confirmDelete) return;

    saveStocks(stocks.filter((item) => item.id !== id));
  };

  const changeStatus = (
    id: string,
    status: "available" | "used"
  ) => {
    const updated = stocks.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
          }
        : item
    );

    saveStocks(updated);
  };

  const copyStock = async (item: StockItem) => {
    const text = [
      item.email ? `MAIL — ${item.email}` : "",
      item.password ? `PASS — ${item.password}` : "",
      item.deliveryText,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setMessage("คัดลอกข้อมูลแล้ว ✓");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch {
      setMessage("ไม่สามารถคัดลอกได้");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin-logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  };

  const filteredStocks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return stocks;

    return stocks.filter((item) => {
      return (
        item.product.toLowerCase().includes(keyword) ||
        item.packageName.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword)
      );
    });
  }, [stocks, search]);

  const availableCount = stocks.filter(
    (item) => item.status === "available"
  ).length;

  const usedCount = stocks.filter(
    (item) => item.status === "used"
  ).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 px-4 py-8 text-slate-700">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-bold text-pink-500"
            >
              ← กลับหลังร้าน
            </Link>

            <h1 className="mt-3 text-3xl font-black text-slate-900">
              จัดการสต็อก
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              เพิ่มบัญชีแอปและจัดการสินค้าพร้อมขาย
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className="rounded-full border border-pink-200 bg-white px-5 py-3 font-bold text-pink-500"
            >
              ดูหน้าสินค้า
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-slate-900 px-5 py-3 font-bold text-white"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-pink-100">
            <p className="text-sm text-slate-500">
              สต็อกทั้งหมด
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {stocks.length}
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-pink-100">
            <p className="text-sm text-slate-500">
              พร้อมขาย
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-600">
              {availableCount}
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-pink-100">
            <p className="text-sm text-slate-500">
              ใช้แล้ว
            </p>

            <p className="mt-2 text-3xl font-black text-orange-500">
              {usedCount}
            </p>
          </div>
        </div>

        {/* Add Stock */}
        <section className="mt-6 rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-pink-100">
          <h2 className="text-xl font-black text-slate-900">
            ➕ เติมสต็อก
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold">
                ชื่อสินค้า
              </label>

              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="เช่น iQIYI"
                className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-black placeholder:text-slate-300 outline-none focus:border-pink-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                แพ็กเกจ
              </label>

              <input
                value={packageName}
                onChange={(e) =>
                  setPackageName(e.target.value)
                }
                placeholder="เช่น 7 วัน Premium"
                className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-black placeholder:text-slate-300 outline-none focus:border-pink-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Email / Username
              </label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="เช่น test001@email.com"
                className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-black placeholder:text-slate-300 outline-none focus:border-pink-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Password
              </label>

              <input
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="เช่น demo1234"
                className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-black placeholder:text-slate-300 outline-none focus:border-pink-300"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-bold">
              ข้อมูลสำหรับส่งสินค้า
            </label>

            <textarea
              value={deliveryText}
              onChange={(e) =>
                setDeliveryText(e.target.value)
              }
              placeholder={`ใส่ข้อความเพิ่มเติม เช่น
CODE: TEST-001`}
              rows={5}
              className="w-full resize-none rounded-2xl border border-pink-100 bg-white px-4 py-3 text-black placeholder:text-slate-300 outline-none focus:border-pink-300"
            />
          </div>

          {message && (
            <div className="mt-4 rounded-2xl bg-pink-50 px-4 py-3 text-sm font-bold text-pink-600">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={addStock}
            className="mt-5 rounded-full bg-gradient-to-r from-pink-600 to-red-500 px-6 py-3 font-bold text-white"
          >
            + เพิ่มเข้าส Stock
          </button>
        </section>

        {/* Search */}
        <div className="mt-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า หรือแพ็กเกจ..."
            className="w-full rounded-2xl border border-pink-100 bg-white px-5 py-4 text-black placeholder:text-slate-300 outline-none focus:border-pink-300"
          />
        </div>

        {/* Stock List */}
        <div className="mt-5 space-y-4">
          {filteredStocks.length === 0 ? (
            <div className="rounded-[32px] bg-white p-10 text-center shadow-sm ring-1 ring-pink-100">
              <div className="text-5xl"></div>

              <p className="mt-4 font-black text-slate-900">
                ยังไม่มี Stock
              </p>

              <p className="mt-1 text-sm text-slate-400">
                เพิ่มสินค้าจากแบบฟอร์มด้านบนได้เลย
              </p>
            </div>
          ) : (
            filteredStocks.map((item) => (
              <div
                key={item.id}
                className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-pink-100"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900">
                        {item.product}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.status === "available"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.status === "available"
                          ? "พร้อมขาย"
                          : "ใช้แล้ว"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-pink-500">
                      {item.packageName}
                    </p>

                    <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-sm text-white">
{`${item.email ? `MAIL — ${item.email}` : ""}
${item.password ? `PASS — ${item.password}` : ""}
${item.deliveryText || ""}`.trim()}
                    </pre>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => copyStock(item)}
                        className="rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-pink-600"
                      >
                        คัดลอก
                      </button>

                      {item.status === "available" ? (
                        <button
                          type="button"
                          onClick={() =>
                            changeStatus(item.id, "used")
                          }
                          className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600"
                        >
                          ทำเครื่องหมายว่าใช้แล้ว
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            changeStatus(
                              item.id,
                              "available"
                            )
                          }
                          className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600"
                        >
                          คืนเป็นพร้อมขาย
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteStock(item.id)}
                    className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

