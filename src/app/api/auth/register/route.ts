import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, AuthResponse, RegisterRequest, AuthUser } from "@/lib/types/auth";

const GATEWAY_URL = process.env.GATEWAY_URL;
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "biteloop_token";

export async function POST(request: NextRequest) {
  let body: RegisterRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  // Basic presence check — full validation (Size, Pattern) is enforced
  // client-side via Zod and server-side via Bean Validation. This is
  // just a guard against a malformed/empty request reaching the gateway.
  if (!body.name || !body.email || !body.password || !body.phone || !body.role) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  let gatewayResponse: Response;

  try {
    gatewayResponse = await fetch(`${GATEWAY_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Register: failed to reach gateway", err);
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 502 }
    );
  }

  const payload: ApiResponse<AuthResponse> = await gatewayResponse.json();

  // Backend returned an error — e.g. 409 Conflict for duplicate email/phone
  if (!gatewayResponse.ok || !payload.success) {
    return NextResponse.json(
      { success: false, message: payload.message || "Registration failed" },
      { status: gatewayResponse.status }
    );
  }

  const { token, userId, name, email, role } = payload.data;

  // everything else → goes into JSON response body (readable by JS)
  const safeUser: AuthUser = { userId, name, email, role };

  const response = NextResponse.json(
    { success: true, data: safeUser },
    { status: 201 }
  );

  // token → goes into httpOnly cookie (unreadable by JS)
  response.cookies.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}