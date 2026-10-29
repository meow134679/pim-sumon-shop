
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // ทดสอบเฉพาะเครื่อง Local ก่อน
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "ยังไม่เปิดตรวจสลิปบนเว็บจริง" },
        { status: 403 }
      );
    }

    const secret = process.env.SLIP2GO_SECRET_KEY;
    const apiUrl = process.env.SLIP2GO_API_URL;
    const receiver = process.env.SLIP2GO_RECEIVER_ACCOUNT;

    if (!secret || !apiUrl || !receiver) {
      return NextResponse.json(
        {
          success: false,
          message: "ยังตั้งค่า Slip2Go ไม่ครบใน .env.local",
        },
        { status: 503 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    const amount = Number(form.get("amount"));

    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "กรุณาอัปโหลดรูปสลิป" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "รูปสลิปต้องไม่เกิน 5 MB" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "ยอดเงินไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const payload = {
      checkDuplicate: true,
      checkReceiver: [
        {
          accountType: "01014",
          accountNumber: receiver.replace(/\D/g, ""),
        },
      ],
      checkAmount: {
        type: "eq",
        amount: amount.toFixed(2),
      },
    };

    const upload = new FormData();
    upload.append("file", file, file.name);
    upload.append("payload", JSON.stringify(payload));

    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/verify-slip/qr-image/info`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
        },
        body: upload,
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      }
    );

    const result = await response.json();

    const matched =
      response.ok &&
      String(result.code) === "200000" &&
      Number(result.data?.amount).toFixed(2) === amount.toFixed(2);

    return NextResponse.json(
      {
        success: matched,
        message: matched
          ? "ตรวจสอบสลิปเบื้องต้นผ่าน"
          : result.message || "ตรวจสอบสลิปไม่ผ่าน",
        code: result.code,
        amount: result.data?.amount ?? null,
        paymentApproved: false,
      },
      { status: matched ? 200 : 422 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "เชื่อมต่อ Slip2Go ไม่สำเร็จ",
      },
      { status: 500 }
    );
  }
}