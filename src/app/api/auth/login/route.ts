import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, AuthResponse, LoginRequest, AuthUser } from "@/src/lib/types/auth";

const GATEWAY_URL = process.env.GATEWAY_URL;
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "biteloop_token";

export async function POST(request: NextRequest) {
  let body: LoginRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!body.email || !body.password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required" },
      { status: 400 }
    );
  }

  let gatewayResponse: Response;

  try {
    gatewayResponse = await fetch(`${GATEWAY_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Login: failed to reach gateway", err);
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 502 }
    );
  }

  const payload: ApiResponse<AuthResponse> = await gatewayResponse.json();

  // Gateway/backend returned an error (e.g. 401 invalid credentials)
  if (!gatewayResponse.ok || !payload.success) {
    return NextResponse.json(
      { success: false, message: payload.message || "Login failed" },
      { status: gatewayResponse.status }
    );
  }

  const { token, userId, name, email, role } = payload.data;

  const safeUser: AuthUser = { userId, name, email, role };

  const response = NextResponse.json({ success: true, data: safeUser });

  // httpOnly: never readable by client-side JS (XSS-safe)
  // secure: only sent over HTTPS in production
  // sameSite: "lax" allows the cookie on normal navigation, blocks cross-site POSTs
  response.cookies.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24h — matches your backend's jwt.expiration (86400000ms)
  });

  return response;
}