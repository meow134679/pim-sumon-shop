
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { randomUUID, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "private, no-store, max-age=0",
  Vary: "Cookie",
};

function send(data: object, status = 200) {
  return NextResponse.json(data, { status, headers });
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error("ยังไม่ได้ตั้งค่า Supabase");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// ตรวจว่าเป็น Admin ที่เข้าสู่ระบบแล้วหรือไม่
async function isAdmin() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const token = cookieStore.get("pim_sumon_admin")?.value;

  if (!secret || !token) return false;

  const a = Buffer.from(token);
  const b = Buffer.from(secret);

  return (
    a.length === b.length &&
    timingSafeEqual(a, b)
  );
}

function unauthorized() {
  return send(
    {
      success: false,
      message: "กรุณาเข้าสู่ระบบ Admin ก่อน",
    },
    401
  );
}

// =======================================
// GET - โหลด Stock
// ลูกค้าเห็นเฉพาะจำนวนที่พร้อมขาย
// Admin เห็นข้อมูลทั้งหมด
// =======================================
export async function GET() {
  try {
    const supabase = getSupabase();
    const admin = await isAdmin();

    const query = supabase.from("stock");

    const { data, error } = admin
      ? await query
          .select("*")
          .order("created_at", { ascending: false })
      : await query
          .select("id, product, package_name, status")
          .eq("status", "available");

    if (error) {
      return send(
        {
          success: false,
          message: "โหลดข้อมูล Stock ไม่สำเร็จ",
        },
        500
      );
    }

    return send({
      success: true,
      stock: data ?? [],
    });
  } catch {
    return send(
      {
        success: false,
        message: "ไม่สามารถโหลด Stock ได้",
      },
      500
    );
  }
}

// =======================================
// POST - เพิ่ม Stock (Admin เท่านั้น)
// =======================================
export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const body = await request.json();

    const product = String(body.product ?? "").trim();
    const packageName = String(
      body.packageName ?? body.package_name ?? ""
    ).trim();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    const deliveryText = String(
      body.deliveryText ?? body.delivery_text ?? ""
    );

    if (!product || !packageName) {
      return send(
        {
          success: false,
          message: "กรุณากรอกชื่อสินค้าและแพ็กเกจ",
        },
        400
      );
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("stock")
      .insert({
        id: randomUUID(),
        product,
        package_name: packageName,
        email,
        password,
        delivery_text: deliveryText,
        status: "available",
      })
      .select()
      .single();

    if (error) {
      return send(
        {
          success: false,
          message: error.message,
        },
        500
      );
    }

    return send({
      success: true,
      message: "เพิ่ม Stock สำเร็จ",
      stock: data,
    });
  } catch {
    return send(
      {
        success: false,
        message: "เพิ่ม Stock ไม่สำเร็จ",
      },
      500
    );
  }
}

// =======================================
// PATCH - แก้ไข Stock (Admin เท่านั้น)
// =======================================
export async function PATCH(request: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const body = await request.json();
    const id = String(
      body.id ?? body.stockId ?? ""
    ).trim();

    if (!id) {
      return send(
        {
          success: false,
          message: "ไม่พบ ID ของ Stock",
        },
        400
      );
    }

    const updates: Record<string, string> = {};

    if (body.product !== undefined) {
      updates.product = String(body.product).trim();
    }

    if (
      body.packageName !== undefined ||
      body.package_name !== undefined
    ) {
      updates.package_name = String(
        body.packageName ?? body.package_name
      ).trim();
    }

    if (body.email !== undefined) {
      updates.email = String(body.email ?? "").trim();
    }

    if (body.password !== undefined) {
      updates.password = String(body.password ?? "");
    }

    if (
      body.deliveryText !== undefined ||
      body.delivery_text !== undefined
    ) {
      updates.delivery_text = String(
        body.deliveryText ?? body.delivery_text ?? ""
      );
    }

    if (body.status !== undefined) {
      if (
        body.status !== "available" &&
        body.status !== "used"
      ) {
        return send(
          {
            success: false,
            message: "สถานะ Stock ไม่ถูกต้อง",
          },
          400
        );
      }

      updates.status = body.status;
    }

    if (
      updates.product === "" ||
      updates.package_name === ""
    ) {
      return send(
        {
          success: false,
          message: "ชื่อสินค้าและแพ็กเกจห้ามว่าง",
        },
        400
      );
    }

    if (Object.keys(updates).length === 0) {
      return send(
        {
          success: false,
          message: "ไม่มีข้อมูลที่ต้องแก้ไข",
        },
        400
      );
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("stock")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      return send(
        {
          success: false,
          message: error.message,
        },
        500
      );
    }

    if (!data) {
      return send(
        {
          success: false,
          message: "ไม่พบ Stock ที่ต้องการแก้ไข",
        },
        404
      );
    }

    return send({
      success: true,
      message: "แก้ไข Stock สำเร็จ",
      stock: data,
    });
  } catch {
    return send(
      {
        success: false,
        message: "แก้ไข Stock ไม่สำเร็จ",
      },
      500
    );
  }
}

// =======================================
// DELETE - ลบ Stock (Admin เท่านั้น)
// =======================================
export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const body = await request.json().catch(() => ({}));
    const url = new URL(request.url);

    const id = String(
      body.id ??
      body.stockId ??
      url.searchParams.get("id") ??
      ""
    ).trim();

    if (!id) {
      return send(
        {
          success: false,
          message: "ไม่พบ ID ของ Stock",
        },
        400
      );
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("stock")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      return send(
        {
          success: false,
          message: error.message,
        },
        500
      );
    }

    if (!data) {
      return send(
        {
          success: false,
          message: "ไม่พบ Stock ที่ต้องการลบ",
        },
        404
      );
    }

    return send({
      success: true,
      message: "ลบ Stock สำเร็จ",
    });
  } catch {
    return send(
      {
        success: false,
        message: "ลบ Stock ไม่สำเร็จ",
      },
      500
    );
  }
}

