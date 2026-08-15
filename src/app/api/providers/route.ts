import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types/auth";
import type { Provider } from "@/lib/types/provider";

const GATEWAY_URL = process.env.GATEWAY_URL;

export async function GET(request: NextRequest) {
  let gatewayResponse: Response;

  try {
    gatewayResponse = await fetch(`${GATEWAY_URL}/api/providers`, {
      method: "GET",
    });
  } catch (err) {
    console.error("getProviders: failed to reach gateway", err);
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 502 }
    );
  }

  const payload: ApiResponse<Provider[]> = await gatewayResponse.json();

  if (!gatewayResponse.ok || !payload.success) {
    return NextResponse.json(
      { success: false, message: payload.message || "Failed to fetch providers" },
      { status: gatewayResponse.status }
    );
  }

  return NextResponse.json({ success: true, data: payload.data });
}