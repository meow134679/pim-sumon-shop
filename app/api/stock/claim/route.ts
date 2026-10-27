import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const product = String(
      body.product ?? ""
    ).trim();

    const packageName = String(
      body.packageName ?? ""
    ).trim();

    if (!product || !packageName) {
      return NextResponse.json(
        {
          success: false,
          message: "ข้อมูลสินค้าไม่ครบ",
        },
        { status: 400 }
      );
    }

    const {
      data: stockItem,
      error: findError,
    } = await supabase
      .from("stock")
      .select("*")
      .eq("product", product)
      .eq("package_name", packageName)
      .eq("status", "available")
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (findError) {
      return NextResponse.json(
        {
          success: false,
          message: findError.message,
        },
        { status: 500 }
      );
    }

    if (!stockItem) {
      return NextResponse.json(
        {
          success: false,
          message:
            "สินค้าหรือแพ็กเกจนี้หมดสต็อกแล้ว",
        },
        { status: 409 }
      );
    }

    const {
      data: updatedStock,
      error: updateError,
    } = await supabase
      .from("stock")
      .update({
        status: "used",
      })
      .eq("id", stockItem.id)
      .eq("status", "available")
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ตัด Stock สำเร็จ",
      stock: updatedStock,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "ตัด Stock ไม่สำเร็จ",
      },
      { status: 500 }
    );
  }
}