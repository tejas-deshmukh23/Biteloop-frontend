import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "biteloop_token";
const JWT_SECRET = process.env.JWT_SECRET || "";

// Routes that require a logged-in CUSTOMER
const CUSTOMER_PREFIXES = ["/dashboard", "/orders"];
// Routes that require a logged-in PROVIDER
const PROVIDER_PREFIXES = ["/provider"];

interface TokenClaims {
  sub?: string;      // userId — JWT standard "subject" claim, set via .setSubject(user.getId())
  role?: string;
  email?: string;
  providerId?: string; // only present for PROVIDER-role tokens
  [key: string]: unknown;
}

async function verifyToken(token: string): Promise<TokenClaims | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenClaims;
  } catch (err) {
    console.error("JWT verify failed:", err); // TEMPORARY — remove after debugging
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiresCustomer = CUSTOMER_PREFIXES.some((p) => pathname.startsWith(p));
  const requiresProvider = PROVIDER_PREFIXES.some((p) => pathname.startsWith(p));

  if (!requiresCustomer && !requiresProvider) {
    return NextResponse.next();
  }

  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const claims = await verifyToken(token);

  if (!claims) {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(JWT_COOKIE_NAME);
    return response;
  }

  if (requiresCustomer && claims.role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (requiresProvider && claims.role !== "PROVIDER") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/orders/:path*", "/provider/:path*"],
};