import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types/auth";
import type { Order } from "@/lib/types/order";

const GATEWAY_URL = process.env.GATEWAY_URL;
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "biteloop_token";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  // Pass through any ?status=PENDING style filter untouched
  const { search } = request.nextUrl;

  let gatewayResponse: Response;

  try {
    gatewayResponse = await fetch(`${GATEWAY_URL}/api/orders/my${search}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("getMyOrders: failed to reach gateway", err);
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 502 }
    );
  }

  const payload: ApiResponse<Order[]> = await gatewayResponse.json();

  if (!gatewayResponse.ok || !payload.success) {
    return NextResponse.json(
      { success: false, message: payload.message || "Failed to fetch orders" },
      { status: gatewayResponse.status }
    );
  }

  return NextResponse.json({ success: true, data: payload.data });
}