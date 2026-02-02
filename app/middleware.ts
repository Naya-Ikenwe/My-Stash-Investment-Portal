import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of public paths that don't require authentication
const publicPaths = ["/login", "/sign-up", "/forget-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Check for access token
  const accessToken = req.cookies.get("access_token")?.value;
  
  if (!accessToken) {
    // Redirect to login if no token
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: [
    // Match all routes except:
    // - Static files (_next/static, _next/image, favicon.ico, etc.)
    // - Public paths
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};