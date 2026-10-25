"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id?: string;
  name: string;
  category?: string;
  icon?: string;
  packageLabel?: string;
  price: number;
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
  items?: OrderItem[];

  // รองรับออเดอร์เวอร์ชันเก่า
  orderId?: string;
  products?: OrderItem[];
};

export default function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem(
      "pimSumonLastOrder"
    );

    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch {
        setOrder(null);
      }
    }
  }, []);

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 via-white to-sky-50 p-5">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="text-6xl">🛍️</div>

          <h1 className="mt-4 text-2xl font-black">
            ไม่พบข้อมูลคำสั่งซื้อ
          </h1>

          <Link
            href="/products"
            className="mt-6 block rounded-full bg-pink-500 py-3 font-bold text-white"
          >
            ไปเลือกสินค้า
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-sky-50 px-5 py-10 text-slate-700">

      <div className="mx-auto max-w-lg">

        <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">

          <div className="text-center">
            <div className="text-7xl">
              🎀
            </div>

            <h1 className="mt-4 text-3xl font-black text-pink-500">
              สั่งซื้อสำเร็จ
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Pim Sumon ได้รับคำสั่งซื้อของคุณแล้ว
            </p >
          </div>

<div className="mt-6 rounded-2xl bg-pink-50 p-5 text-center">

  <p className="text-xs font-bold text-slate-400">
    เลขคำสั่งซื้อ
  </p>

  <p className="mt-1 text-2xl font-black text-pink-500">
    {order.id}
  </p>

  <div className="mt-4 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700">
    ⏳ {order.status}
  </div>

</div>

          <div className="mt-6">

            <h2 className="font-black">
              รายการสินค้า 🛍️
            </h2>

<div className="mt-3 space-y-2">
  {(order.items || order.products || []).map(
    (product: OrderItem, index: number) => (
      <div
        key={`${product.name}-${index}`}
        className="flex items-center justify-between rounded-2xl border border-pink-50 p-3"
      >
        <div>
          <p className="font-bold">
            {product.icon} {product.name}
          </p>

          <p className="text-xs text-slate-400">
            {product.category}
          </p>
        </div>

        <p className="font-black text-pink-500">
          ฿{product.price}
        </p>
      </div>
    )
  )}
</div>
            <div className="mt-4 flex items-center justify-between border-t border-pink-100 pt-4 text-lg font-black">
              <span>ยอดรวม</span>

              <span className="text-pink-500">
                ฿{order.total}
              </span>
            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-sky-50 p-4">

            <p className="font-bold">
              👤 {order.customerName}
            </p >

            <p className="mt-1 text-sm text-slate-500">
              ติดต่อ: {order.contact}
            </p >

            {order.note && (
              <p className="mt-1 text-sm text-slate-500">
                หมายเหตุ: {order.note}
              </p >
            )}

          </div>

          <div className="mt-6 rounded-2xl bg-pink-50 p-4 text-center">
            <p className="font-bold">
              💗 ขอบคุณที่อุดหนุน Pim Sumon
            </p >

            <p className="mt-1 text-xs text-slate-500">
              ร้านจะตรวจสอบสลิปและดำเนินการตามคำสั่งซื้อ
            </p >
          </div>

          <Link
            href="/"
            className="mt-5 block w-full rounded-full bg-pink-500 py-3 text-center font-bold text-white transition hover:bg-pink-600"
          >
            กลับหน้าร้าน
          </Link>

        </div>
      </div>
    </main>
  );
}