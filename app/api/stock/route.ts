import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient(supabaseUrl, supabaseSecretKey);

// ดึง Stock ทั้งหมด
export async function GET() {
  const { data, error } = await supabase
    .from("stock")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    stock: data ?? [],
  });
}

// เพิ่ม Stock ใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const product = String(body.product ?? "").trim();
    const packageName = String(body.packageName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "").trim();
    const deliveryText = String(body.deliveryText ?? "").trim();

    if (!product || !packageName) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณากรอกชื่อสินค้าและแพ็กเกจ",
        },
        { status: 400 }
      );
    }

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `STOCK-${Date.now()}`;

    const { data, error } = await supabase
      .from("stock")
      .insert({
        id,
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
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stock: data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "ไม่สามารถเพิ่ม Stock ได้",
      },
      { status: 500 }
    );
  }
}

// เปลี่ยนสถานะ available / used
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const id = String(body.id ?? "");
    const status = body.status;

    if (!id || !["available", "used"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "ข้อมูลไม่ถูกต้อง",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("stock")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stock: data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "ไม่สามารถเปลี่ยนสถานะ Stock ได้",
      },
      { status: 500 }
    );
  }
}

// ลบ Stock
export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const id = String(body.id ?? "");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบ Stock ที่ต้องการลบ",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("stock").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "ไม่สามารถลบ Stock ได้",
      },
      { status: 500 }
    );
  }
}
