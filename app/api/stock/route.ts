
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { data, error } = await supabase
      .from("stock")
      .select("id, product, package_name, status")
      .eq("status", "available");

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
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "ไม่สามารถโหลด Stock ได้",
      },
      { status: 500 }
    );
  }
}