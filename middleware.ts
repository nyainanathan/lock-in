// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const isLoginPage = request.nextUrl.pathname === "/login";

  // 🚫 Prevent logged-in users from accessing login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔒 Protect private pages
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/projects", "/chronos"],
};