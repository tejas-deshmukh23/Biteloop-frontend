import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types/auth";
import type { Provider, CreateProviderRequest } from "@/lib/types/provider";

const GATEWAY_URL = process.env.GATEWAY_URL;
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "biteloop_token";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  let body: CreateProviderRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!body.businessName || !body.address) {
    return NextResponse.json(
      { success: false, message: "Business name and address are required" },
      { status: 400 }
    );
  }

  let gatewayResponse: Response;

  try {
    gatewayResponse = await fetch(`${GATEWAY_URL}/api/providers/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("registerProvider: failed to reach gateway", err);
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 502 }
    );
  }

  const payload: ApiResponse<Provider> = await gatewayResponse.json();

  if (!gatewayResponse.ok || !payload.success) {
    return NextResponse.json(
      { success: false, message: payload.message || "Failed to register provider" },
      { status: gatewayResponse.status }
    );
  }

  return NextResponse.json({ success: true, data: payload.data });
}