"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CartItem = {
  id?: string;
  name: string;
  category?: string;
  icon?: string;
  packageLabel?: string;
  price: number;
};

type PaymentMethod = "promptpay" | "scb";

type SavedOrder = {
  id: string;
  customerName: string;
  contact: string;
  note: string;
  total: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  slipName?: string;
  slipData?: string;
  items: CartItem[];
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("promptpay");

  const [copied, setCopied] = useState(false);

  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("pimSumonCart");

    if (!savedCart) {
      setCart([]);
      return;
    }

    try {
      const parsed = JSON.parse(savedCart);

      if (Array.isArray(parsed)) {
        setCart(parsed);
      }
    } catch {
      setCart([]);
    }
  }, []);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
  }, [cart]);

  const handleSlipChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSlipFile(null);
      setSlipPreview("");
      return;
    }

    setSlipFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setSlipPreview(String(reader.result || ""));
    };

    reader.readAsDataURL(file);
  };

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText("991-273142-4");

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setMessage(
        "ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาคัดลอกเลขบัญชี 991-273142-4"
      );
    }
  };

  const createOrderId = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const hour = String(
      now.getHours()
    ).padStart(2, "0");

    const minute = String(
      now.getMinutes()
    ).padStart(2, "0");

    const second = String(
      now.getSeconds()
    ).padStart(2, "0");

    const random = Math.floor(
      100 + Math.random() * 900
    );

    return `PS-${year}${month}${day}-${hour}${minute}${second}-${random}`;
  };

  const submitOrder = () => {
    setMessage("");

    if (cart.length === 0) {
      setMessage("กรุณาเลือกสินค้าก่อนสั่งซื้อ");
      return;
    }

    if (!customerName.trim()) {
      setMessage("กรุณากรอกชื่อลูกค้า");
      return;
    }

    if (!contact.trim()) {
      setMessage("กรุณากรอกเบอร์โทรหรือ Line");
      return;
    }

    if (!slipFile || !slipPreview) {
      setMessage("กรุณาแนบสลิปการโอน");
      return;
    }

    setSubmitting(true);

    const orderId = createOrderId();

    const paymentMethodLabel =
      paymentMethod === "promptpay"
        ? "PromptPay"
        : "SCB";

    const newOrder: SavedOrder = {
      id: orderId,
      customerName: customerName.trim(),
      contact: contact.trim(),
      note: note.trim(),
      total: totalPrice,
      status: "รอตรวจสอบการชำระเงิน",
      createdAt: new Date().toLocaleString("th-TH"),
      paymentMethod: paymentMethodLabel,
      slipName: slipFile.name,
      slipData: slipPreview,
      items: cart,
    };

    let oldOrders: SavedOrder[] = [];

    try {
      const savedOrders =
        localStorage.getItem("pimSumonOrders");

      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);

        if (Array.isArray(parsed)) {
          oldOrders = parsed;
        }
      }
    } catch {
      oldOrders = [];
    }

    const newOrders = [
      newOrder,
      ...oldOrders,
    ];

    try {
      localStorage.setItem(
        "pimSumonOrders",
        JSON.stringify(newOrders)
      );

      localStorage.setItem(
        "pimSumonLastOrder",
        JSON.stringify(newOrder)
      );

      localStorage.removeItem("pimSumonCart");

      window.location.href = "/success";
    } catch {
      setSubmitting(false);

      setMessage(
        "ไม่สามารถบันทึกออเดอร์ได้ รูปสลิปอาจมีขนาดใหญ่เกินไป กรุณาใช้รูปที่มีขนาดเล็กลง"
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-sky-50 text-slate-700">
      <div className="mx-auto max-w-2xl px-5 py-10">

        <Link
          href="/products"
          className="text-sm font-bold text-pink-500"
        >
          ← กลับไปเลือกสินค้า
        </Link>

        <div className="mt-6 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">

          <h1 className="text-3xl font-black">
            ชำระเงิน 
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            ตรวจสอบรายการสินค้า เลือกวิธีชำระเงิน และแนบสลิป
          </p>

          <div className="mt-6 rounded-3xl bg-pink-50 p-5">

            <h2 className="font-black">
              รายการสินค้า 🛍️
            </h2>

            {cart.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                ไม่มีสินค้าในตะกร้า
              </p>
            ) : (
              <div className="mt-4 space-y-3">

                {cart.map((item, index) => (
                  <div
                    key={`${item.id || item.name}-${index}`}
                    className="flex items-start justify-between gap-4 rounded-2xl bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-bold">
                        {item.icon} {item.name}
                      </p>

                      {item.packageLabel && (
                        <p className="mt-1 text-xs text-slate-400">
                          {item.packageLabel}
                        </p>
                      )}
                    </div>

                    <p className="shrink-0 font-black text-pink-500">
                      ฿{item.price}
                    </p>
                  </div>
                ))}

                <div className="flex items-center justify-between border-t border-pink-100 pt-4">
                  <span className="font-black">
                    ยอดรวม
                  </span>

                  <span className="text-2xl font-black text-pink-500">
                    ฿{totalPrice}
                  </span>
                </div>

              </div>
            )}

          </div>

          <div className="mt-6">

            <h2 className="text-lg font-black">
              เลือกวิธีชำระเงิน 
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("promptpay")
                }
                className={`rounded-2xl border p-4 font-bold transition ${
                  paymentMethod === "promptpay"
                    ? "border-pink-500 bg-pink-50 text-pink-500"
                    : "border-pink-100 bg-white text-slate-600"
                }`}
              >
                 PromptPay QR
              </button>

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("scb")
                }
                className={`rounded-2xl border p-4 font-bold transition ${
                  paymentMethod === "scb"
                    ? "border-purple-500 bg-purple-50 text-purple-600"
                    : "border-pink-100 bg-white text-slate-600"
                }`}
              >
                 ไทยพาณิชย์ SCB
              </button>

            </div>

          </div>

          {paymentMethod === "promptpay" && (
            <div className="mt-6 rounded-3xl border border-pink-100 p-5">

              <h2 className="text-lg font-black">
                ชำระเงินด้วย PromptPay 
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                สแกน QR เพื่อชำระยอด ฿{totalPrice}
              </p>

              <div className="mt-5 flex justify-center">

                <div className="rounded-3xl border border-pink-100 bg-white p-3">

                  <img
                    src="/promtpay-qr.jpg"
                    alt="PromptPay QR"
                    className="max-h-[520px] w-full max-w-sm rounded-2xl object-contain"
                  />

                </div>

              </div>

              <div className="mt-4 text-center">

                <p className="text-xl font-black text-pink-500">
                  ยอดชำระ ฿{totalPrice}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  กรุณาตรวจสอบชื่อบัญชีก่อนโอนเงินทุกครั้ง
                </p>

              </div>

            </div>
          )}

          {paymentMethod === "scb" && (
            <div className="mt-6 rounded-3xl border border-purple-100 p-5">

              <h2 className="text-lg font-black">
                โอนผ่านธนาคารไทยพาณิชย์ 
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                โอนยอด ฿{totalPrice} ตามบัญชีด้านล่าง
              </p>

              <div className="mt-5 flex justify-center">

                <div className="rounded-3xl border border-purple-100 bg-white p-3">

                  <img
                    src="/scb-payment.jpg"
                    alt="SCB Payment"
                    className="max-h-[520px] w-full max-w-sm rounded-2xl object-contain"
                  />

                </div>

              </div>

              <div className="mt-5 rounded-3xl bg-purple-50 p-5 text-center">

                <p className="text-sm font-bold text-purple-500">
                  ธนาคารไทยพาณิชย์ SCB
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  เลขที่บัญชี
                </p>

                <p className="mt-1 text-3xl font-black text-purple-700">
                  991-273142-4
                </p>

                <button
                  type="button"
                  onClick={copyAccountNumber}
                  className="mt-4 rounded-full bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-700"
                >
                  {copied
                    ? "✓ คัดลอกแล้ว"
                    : " คัดลอกเลขบัญชี"}
                </button>

                {copied && (
                  <p className="mt-2 text-xs font-bold text-green-600">
                    คัดลอก 991-273142-4 แล้ว
                  </p>
                )}

              </div>

            </div>
          )}

          <div className="mt-6 space-y-5">

            <div>
              <label className="text-sm font-bold">
                ชื่อลูกค้า
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(
                    event.target.value
                  )
                }
                placeholder="กรอกชื่อ"
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="text-sm font-bold">
                เบอร์โทร / Line
              </label>

              <input
                type="text"
                value={contact}
                onChange={(event) =>
                  setContact(
                    event.target.value
                  )
                }
                placeholder="กรอกช่องทางติดต่อ"
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="text-sm font-bold">
                หมายเหตุ
              </label>

              <textarea
                value={note}
                onChange={(event) =>
                  setNote(
                    event.target.value
                  )
                }
                placeholder="รายละเอียดเพิ่มเติม"
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

          </div>

          <div className="mt-6 rounded-3xl border border-pink-100 p-5">

            <h2 className="text-lg font-black">
              แนบสลิปการโอน 🧾
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              อัปโหลดรูปสลิปหลังจากชำระเงินแล้ว
            </p>

            <label className="mt-4 block cursor-pointer rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50 p-6 text-center">

              <input
                type="file"
                accept="image/*"
                onChange={handleSlipChange}
                className="hidden"
              />

              <div className="text-4xl">
                
              </div>

              <p className="mt-2 font-bold text-pink-500">
                เลือกรูปสลิป
              </p>

              {slipFile ? (
                <p className="mt-2 text-xs text-green-600">
                  ✓ {slipFile.name}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-400">
                  JPG / PNG
                </p>
              )}

            </label>

            {slipPreview && (
              <div className="mt-5">

                <p className="mb-2 text-sm font-bold">
                  ตัวอย่างสลิป
                </p>

                <img
                  src={slipPreview}
                  alt="Slip preview"
                  className="max-h-96 w-full rounded-2xl border border-pink-100 bg-white object-contain"
                />

              </div>
            )}

          </div>

          {message && (
            <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={submitOrder}
            disabled={
              submitting ||
              cart.length === 0
            }
            className="mt-6 w-full rounded-full bg-pink-500 py-4 font-black text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-200"
          >
            {submitting
              ? "กำลังบันทึก..."
              : "ยืนยันคำสั่งซื้อ ♡"}
          </button>

        </div>

      </div>
    </main>
  );
}

