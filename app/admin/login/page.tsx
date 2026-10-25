"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OrderItem = {
  id?: string;
  name: string;
  price: number;
  icon?: string;
  category?: string;
  packageLabel?: string;
};

type Order = {
  id: string;
  customerName: string;
  contact: string;
  note?: string;
  total: number;
  status: string;
  createdAt: string;
  paymentMethod?: string;
  slipName?: string;
  slipData?: string;
  items: OrderItem[];
};

function getStatusStyle(status: string) {
  switch (status) {
    case "สำเร็จ":
      return "bg-emerald-100 text-emerald-700";

    case "ยกเลิก":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function AdminPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] =
    useState("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [selectedSlip, setSelectedSlip] =
    useState<Order | null>(null);

  const handleLogout = async () => {
    await fetch("/api/admin-logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  };

  useEffect(() => {
    const savedOrders =
      localStorage.getItem("pimSumonOrders");

    if (!savedOrders) {
      setOrders([]);
      return;
    }

    try {
      const parsed = JSON.parse(savedOrders);

      if (Array.isArray(parsed)) {
        setOrders(parsed);
      }
    } catch {
      setOrders([]);
    }
  }, []);

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);

    localStorage.setItem(
      "pimSumonOrders",
      JSON.stringify(newOrders)
    );
  };

  const updateStatus = (
    orderId: string,
    status: string
  ) => {
    const updated = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status,
          }
        : order
    );

    saveOrders(updated);
  };

  const deleteOrder = (orderId: string) => {
    const confirmDelete = window.confirm(
      "ต้องการลบออเดอร์นี้หรือไม่?"
    );

    if (!confirmDelete) return;

    saveOrders(
      orders.filter((order) => order.id !== orderId)
    );
  };

  const clearAllOrders = () => {
    const confirmClear = window.confirm(
      "ต้องการล้างออเดอร์ทั้งหมดหรือไม่?"
    );

    if (!confirmClear) return;

    saveOrders([]);
  };

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchStatus =
        filterStatus === "ทั้งหมด" ||
        order.status === filterStatus;

      const matchSearch =
        !keyword ||
        order.id?.toLowerCase().includes(keyword) ||
        order.customerName
          ?.toLowerCase()
          .includes(keyword) ||
        order.contact?.toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [orders, search, filterStatus]);

  const pendingCount = orders.filter(
    (order) => order.status !== "สำเร็จ"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "สำเร็จ"
  ).length;

  const totalSales = orders
    .filter((order) => order.status === "สำเร็จ")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 text-slate-700">
      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-bold text-pink-500"
            >
              ← กลับหน้าร้าน
            </Link>

            <h1 className="mt-4 text-3xl font-black text-slate-900">
              หลังร้าน Pim Sumon 🛍️
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              ตรวจสอบออเดอร์ สลิป และสถานะการชำระเงิน
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className="rounded-full border border-pink-200 bg-white px-5 py-3 text-center font-bold text-pink-500"
            >
              ดูหน้าสินค้า
            </Link>

            <Link
              href="/admin/stock"
              className="rounded-full bg-sky-50 px-5 py-3 text-center font-bold text-sky-600"
            >
               จัดการ Stock
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-slate-900 px-5 py-3 font-bold text-white"
            >
              ออกจากระบบ
            </button>

            {orders.length > 0 && (
              <button
                type="button"
                onClick={clearAllOrders}
                className="rounded-full bg-red-50 px-5 py-3 font-bold text-red-500"
              >
                ล้างออเดอร์ทั้งหมด
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-pink-100">
            <p className="text-sm text-slate-500">
              ออเดอร์ทั้งหมด
            </p>

            <p className="mt-2 text-3xl font-black text-pink-600">
              {orders.length}
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-pink-100">
            <p className="text-sm text-slate-500">
              รอตรวจสอบ
            </p>

            <p className="mt-2 text-3xl font-black text-yellow-500">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-pink-100">
            <p className="text-sm text-slate-500">
              สำเร็จ
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-600">
              {completedCount}
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-pink-100">
            <p className="text-sm text-slate-500">
              ยอดขายรวม
            </p>

            <p className="mt-2 text-3xl font-black text-sky-600">
              ฿{totalSales.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_240px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาเลขออเดอร์ ชื่อ หรือ Line..."
            className="rounded-2xl border border-pink-100 bg-white px-5 py-4 text-black outline-none placeholder:text-slate-300"
          />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
            className="rounded-2xl border border-pink-100 bg-white px-5 py-4 text-black outline-none"
          >
            <option value="ทั้งหมด">
              ทุกสถานะ
            </option>

            <option value="กำลังดำเนินการ">
              กำลังดำเนินการ
            </option>

            <option value="สำเร็จ">
              สำเร็จ
            </option>

            <option value="ยกเลิก">
              ยกเลิก
            </option>
          </select>
        </div>

        {/* Orders */}
        <div className="mt-6 space-y-5">
          {filteredOrders.length === 0 ? (
            <div className="rounded-[32px] bg-white p-12 text-center shadow-sm ring-1 ring-pink-100">
              <div className="text-5xl">🧾</div>

              <h2 className="mt-4 text-xl font-black text-slate-900">
                ยังไม่มีออเดอร์
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                เมื่อลูกค้าสั่งซื้อ ออเดอร์จะแสดงตรงนี้
              </p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <div
                key={`${order.id || "order"}-${index}`}
                className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-pink-100"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400">
                      เลขคำสั่งซื้อ
                    </p>

                    <h2 className="mt-1 text-xl font-black text-pink-600">
                      {order.id}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString("th-TH")
                        : "-"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status ||
                      "กำลังดำเนินการ"}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl bg-pink-50 p-5">
                    <h3 className="font-black text-slate-900">
                      ข้อมูลลูกค้า
                    </h3>

                    <p className="mt-3">
                      ชื่อ: {order.customerName}
                    </p>

                    <p className="mt-1">
                      ติดต่อ: {order.contact}
                    </p>

                    {order.note && (
                      <p className="mt-1">
                        หมายเหตุ: {order.note}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-sky-50 p-5">
                    <h3 className="font-black text-slate-900">
                      🛍️ รายการสินค้า
                    </h3>

                    <div className="mt-3 space-y-2">
                      {(order.items || []).map(
                        (item, itemIndex) => (
                          <div
                            key={`${item.id || item.name}-${itemIndex}`}
                            className="flex items-start justify-between gap-3"
                          >
                            <div>
                              <p className="font-bold">
                                {item.icon} {item.name}
                              </p>

                              {item.packageLabel && (
                                <p className="text-xs text-slate-400">
                                  {item.packageLabel}
                                </p>
                              )}
                            </div>

                            <p className="font-black text-pink-600">
                              ฿{item.price}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-4 border-t border-sky-100 pt-4">
                      <div className="flex justify-between">
                        <span className="font-bold">
                          รวม
                        </span>

                        <span className="text-xl font-black text-pink-600">
                          ฿{order.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {order.slipData && (
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSlip(order)
                      }
                      className="rounded-full bg-purple-50 px-4 py-2 font-bold text-purple-600"
                    >
                      🧾 ดูสลิป
                    </button>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <select
                    value={
                      order.status ||
                      "กำลังดำเนินการ"
                    }
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                    className="rounded-full border border-pink-100 bg-white px-4 py-2 font-bold text-black"
                  >
                    <option value="กำลังดำเนินการ">
                      กำลังดำเนินการ
                    </option>

                    <option value="สำเร็จ">
                      สำเร็จ
                    </option>

                    <option value="ยกเลิก">
                      ยกเลิก
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      deleteOrder(order.id)
                    }
                    className="rounded-full bg-red-50 px-4 py-2 font-bold text-red-500"
                  >
                    ลบออเดอร์
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Slip Modal */}
      {selectedSlip?.slipData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedSlip(null)}
        >
          <div
            className="max-h-[90vh] max-w-xl overflow-auto rounded-[28px] bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-black text-slate-900">
                สลิปการโอน
              </h2>

              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="rounded-full bg-slate-100 px-3 py-2 font-bold text-slate-600"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedSlip.slipData}
              alt="สลิปการโอน"
              className="mt-4 max-h-[70vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
