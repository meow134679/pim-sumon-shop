import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = body.username;
    const password = body.password;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminUsername || !adminPassword || !sessionSecret) {
      return NextResponse.json(
        {
          message: "ยังไม่ได้ตั้งค่าระบบ Admin",
        },
        {
          status: 500,
        }
      );
    }

    if (
      username !== adminUsername ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        {
          message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        },
        {
          status: 401,
        }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
    });

    response.cookies.set({
      name: "pim_sumon_admin",
      value: sessionSecret,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        message: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      },
      {
        status: 500,
      }
    );
  }
}