import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const url = req.nextUrl.clone();

  if (!accessToken) {
    // redirect to login if no token
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware to all pages except login, signup, forget-password
export const config = {
  matcher: [
    "/((?!login|sign-up|forget-password|_next/static|favicon.ico).*)",
  ],
};
