import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types/auth";
import type { MenuItem, MenuItemRequest } from "@/lib/types/menu";

const GATEWAY_URL = process.env.GATEWAY_URL;
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "biteloop_token";

export async function PUT(
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

  let body: MenuItemRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  let gatewayResponse: Response;

  try {
    gatewayResponse = await fetch(`${GATEWAY_URL}/api/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("updateMenuItem: failed to reach gateway", err);
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 502 }
    );
  }

  const payload: ApiResponse<MenuItem> = await gatewayResponse.json();

  if (!gatewayResponse.ok || !payload.success) {
    return NextResponse.json(
      { success: false, message: payload.message || "Failed to update menu item" },
      { status: gatewayResponse.status }
    );
  }

  return NextResponse.json({ success: true, data: payload.data });
}

export async function DELETE(
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
    gatewayResponse = await fetch(`${GATEWAY_URL}/api/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("deleteMenuItem: failed to reach gateway", err);
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 502 }
    );
  }

  const payload: ApiResponse<void> = await gatewayResponse.json();

  if (!gatewayResponse.ok || !payload.success) {
    return NextResponse.json(
      { success: false, message: payload.message || "Failed to delete menu item" },
      { status: gatewayResponse.status }
    );
  }

  return NextResponse.json({ success: true, data: null });
}