import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types/auth";
import type { MenuItem } from "@/lib/types/menu";

const GATEWAY_URL = process.env.GATEWAY_URL;
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "biteloop_token";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  let gatewayResponse: Response;

  try {
    gatewayResponse = await fetch(`${GATEWAY_URL}/api/menu/${id}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("toggleMenuItem: failed to reach gateway", err);
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 502 }
    );
  }

  const payload: ApiResponse<MenuItem> = await gatewayResponse.json();

  if (!gatewayResponse.ok || !payload.success) {
    return NextResponse.json(
      { success: false, message: payload.message || "Failed to toggle availability" },
      { status: gatewayResponse.status }
    );
  }

  return NextResponse.json({ success: true, data: payload.data });
}