"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
  slipName?: string;
  slipData?: string;
  items: OrderItem[];
};

const statusOptions = [
  "รอตรวจสอบการชำระเงิน",
  "ชำระแล้ว",
  "กำลังดำเนินการ",
  "สำเร็จ",
  "ยกเลิก",
];

function getStatusStyle(status: string) {
  switch (status) {
    case "ชำระแล้ว":
      return "bg-green-100 text-green-700";

    case "กำลังดำเนินการ":
      return "bg-sky-100 text-sky-700";

    case "สำเร็จ":
      return "bg-emerald-100 text-emerald-700";

    case "ยกเลิก":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [selectedSlip, setSelectedSlip] = useState<Order | null>(null);

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

  const changeStatus = (
    orderId: string,
    newStatus: string
  ) => {
    const newOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: newStatus,
          }
        : order
    );

    saveOrders(newOrders);
  };

  const deleteOrder = (orderId: string) => {
    const confirmed = window.confirm(
      "ต้องการลบออเดอร์นี้ใช่ไหม?"
    );

    if (!confirmed) return;

    const newOrders = orders.filter(
      (order) => order.id !== orderId
    );

    saveOrders(newOrders);
  };

  const clearAllOrders = () => {
    const confirmed = window.confirm(
      "ต้องการลบออเดอร์ทั้งหมดใช่ไหม?"
    );

    if (!confirmed) return;

    saveOrders([]);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const statusMatch =
        filterStatus === "ทั้งหมด" ||
        order.status === filterStatus;

      const keyword =
        search.trim().toLowerCase();

      const searchMatch =
        keyword === "" ||
        order.id
          .toLowerCase()
          .includes(keyword) ||
        order.customerName
          .toLowerCase()
          .includes(keyword) ||
        order.contact
          .toLowerCase()
          .includes(keyword);

      return statusMatch && searchMatch;
    });
  }, [orders, filterStatus, search]);

  const pendingCount = orders.filter(
    (order) =>
      order.status ===
      "รอตรวจสอบการชำระเงิน"
  ).length;

  const paidCount = orders.filter(
    (order) =>
      order.status === "ชำระแล้ว"
  ).length;

  const completedCount = orders.filter(
    (order) =>
      order.status === "สำเร็จ"
  ).length;

  const totalSales = orders
    .filter(
      (order) =>
        order.status !== "ยกเลิก"
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-sky-50 text-slate-700">

      <div className="mx-auto max-w-7xl px-5 py-8">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <Link
              href="/"
              className="text-sm font-bold text-pink-500"
            >
              ← กลับหน้าร้าน
            </Link>

            <h1 className="mt-3 text-3xl font-black">
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

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-400">
              ออเดอร์ทั้งหมด
            </p>

            <p className="mt-2 text-3xl font-black text-pink-500">
              {orders.length}
            </p>

          </div>

          <div className="rounded-3xl border border-yellow-100 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-400">
              รอตรวจสอบ
            </p>

            <p className="mt-2 text-3xl font-black text-yellow-500">
              {pendingCount}
            </p>

          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-400">
              ชำระแล้ว
            </p>

            <p className="mt-2 text-3xl font-black text-green-600">
              {paidCount}
            </p>

          </div>

          <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-400">
              ยอดขายรวม
            </p>

            <p className="mt-2 text-3xl font-black text-sky-600">
              ฿{totalSales}
            </p>

          </div>

        </div>

        <div className="mt-6 rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="ค้นหาเลขออเดอร์ ชื่อ หรือ Line..."
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
            />

            <select
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(
                  event.target.value
                )
              }
              className="rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none"
            >

              <option value="ทั้งหมด">
                ทุกสถานะ
              </option>

              {statusOptions.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

        <div className="mt-6 space-y-5">

          {filteredOrders.length === 0 && (
            <div className="rounded-3xl border border-pink-100 bg-white p-12 text-center shadow-sm">

              <div className="text-6xl">
                
              </div>

              <h2 className="mt-4 text-xl font-black">
                ยังไม่มีออเดอร์
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                เมื่อลูกค้าสั่งซื้อ ออเดอร์จะแสดงตรงนี้
              </p>

            </div>
          )}

{filteredOrders.map((order, index) => (
  <div
    key={`${order.id || "order"}-${index}`}
              className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm"
            >

              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div>

                  <p className="text-xs font-bold text-slate-400">
                    เลขคำสั่งซื้อ
                  </p>

                  <h2 className="mt-1 text-xl font-black text-pink-500">
                    {order.id}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {order.createdAt}
                  </p>

                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">

                <div className="rounded-2xl bg-pink-50 p-4">

                  <p className="font-black">
                     ข้อมูลลูกค้า
                  </p>

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

                <div className="rounded-2xl bg-sky-50 p-4">

                  <p className="font-black">
                    🛍️ รายการสินค้า
                  </p>

                  <div className="mt-3 space-y-3">

                    {order.items?.map(
                      (item, index) => (
                        <div
                          key={`${order.id}-${index}`}
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

                          <span className="shrink-0 font-bold text-pink-500">
                            ฿{item.price}
                          </span>

                        </div>
                      )
                    )}

                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-sky-100 pt-3">

                    <span className="font-black">
                      ยอดรวม
                    </span>

                    <span className="text-xl font-black text-pink-500">
                      ฿{order.total}
                    </span>

                  </div>

                </div>

              </div>

              <div className="mt-5 rounded-2xl border border-pink-100 bg-pink-50 p-4">

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div>

                    <p className="font-black">
                      🧾 สลิปการชำระเงิน
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {order.slipName ||
                        "ไม่มีชื่อไฟล์"}
                    </p>

                  </div>

                  {order.slipData ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSlip(order)
                      }
                      className="rounded-full bg-pink-500 px-4 py-2 text-sm font-bold text-white"
                    >
                      ดูสลิป
                    </button>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-400">
                      ไม่มีรูปสลิป
                    </span>
                  )}

                </div>

                {order.slipData && (
                  <img
                    src={order.slipData}
                    alt="Payment slip"
                    className="mt-4 max-h-72 w-full rounded-2xl bg-white object-contain"
                  />
                )}

              </div>

              <div className="mt-5">

                <label className="text-sm font-bold">
                  เปลี่ยนสถานะ
                </label>

                <select
                  value={order.status}
                  onChange={(event) =>
                    changeStatus(
                      order.id,
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none focus:border-pink-400"
                >

                  {statusOptions.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="mt-4 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    changeStatus(
                      order.id,
                      "ชำระแล้ว"
                    )
                  }
                  className="rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white"
                >
                  ✓ ยืนยันชำระแล้ว
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeStatus(
                      order.id,
                      "กำลังดำเนินการ"
                    )
                  }
                  className="rounded-full bg-sky-500 px-4 py-2 text-sm font-bold text-white"
                >
                  กำลังดำเนินการ
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeStatus(
                      order.id,
                      "สำเร็จ"
                    )
                  }
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white"
                >
                  ✓ ปิดงาน
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeStatus(
                      order.id,
                      "ยกเลิก"
                    )
                  }
                  className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-500"
                >
                  ยกเลิก
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteOrder(order.id)
                  }
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500"
                >
                  ลบออเดอร์
                </button>

              </div>

            </div>
          ))}

        </div>

        <div className="mt-8 rounded-3xl border border-pink-100 bg-white p-5 text-sm text-slate-500 shadow-sm">
          ✅ ออเดอร์สำเร็จแล้ว {completedCount} รายการ
        </div>

      </div>

      {selectedSlip &&
        selectedSlip.slipData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5"
            onClick={() =>
              setSelectedSlip(null)
            }
          >

            <div
              className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-3xl bg-white p-5"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm text-slate-400">
                    สลิปออเดอร์
                  </p>

                  <p className="font-black text-pink-500">
                    {selectedSlip.id}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSlip(null)
                  }
                  className="rounded-full bg-slate-100 px-4 py-2 font-bold"
                >
                  ✕
                </button>

              </div>

              <img
                src={selectedSlip.slipData}
                alt="Payment slip"
                className="mt-5 max-h-[70vh] w-full rounded-2xl object-contain"
              />

            </div>

          </div>
        )}

    </main>
  );
}

