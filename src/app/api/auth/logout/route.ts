import { NextResponse } from "next/server";
import { success } from "zod";

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "biteloop_token";

export async function POST() {
     const response = NextResponse.json({ success: true, message: "logged out"});
     response.cookies.delete(JWT_COOKIE_NAME);
     return response;
}


//Logout route handler - clears the httpOnly jwtCookie