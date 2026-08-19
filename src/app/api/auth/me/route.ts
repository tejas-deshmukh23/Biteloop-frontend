import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, AuthUser, UserRole } from "@/lib/types/auth";

const GATEWAY_URL = process.env.GATEWAY_URL;
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "biteloop_token";

// Mirrors com.tiffin.dto.UserProfileResponse — only the fields we need here
interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  let gatewayResponse: Response;

  try {
    gatewayResponse = await fetch(`${GATEWAY_URL}/api/users/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("getMe: failed to reach gateway", err);
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 502 }
    );
  }

  const payload: ApiResponse<UserProfileResponse> = await gatewayResponse.json();

  if (!gatewayResponse.ok || !payload.success || !payload.data) {
    return NextResponse.json(
      { success: false, message: payload.message || "Failed to fetch profile" },
      { status: gatewayResponse.status }
    );
  }

  // Rename id -> userId to match AuthUser's shape
  const user: AuthUser = {
    userId: payload.data.id,
    name: payload.data.name,
    email: payload.data.email,
    role: payload.data.role,
  };

  return NextResponse.json({ success: true, data: user });
}