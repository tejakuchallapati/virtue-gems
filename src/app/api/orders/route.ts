import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = saveOrder({
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      items: body.items,
      total: body.total,
    });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order save error:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
