import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(
      new URL("/dashboard/dashboard-home", request.url)
    );
  }

  const protectedRoutes = [
    "/profile",
    "/dashboard/dashboard-home",
    "/dashboard/create-product",
  ];

  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/dashboard/dashboard-home",
    "/dashboard/create-product",
  ],
};
