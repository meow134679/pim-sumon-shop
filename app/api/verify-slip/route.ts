
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "ระบบตรวจสอบสลิปยังอยู่ระหว่างติดตั้ง",
    },
    { status: 503 }
  );
}