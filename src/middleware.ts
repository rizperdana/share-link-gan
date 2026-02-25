import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Context mapping
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Handle automatic translation based on IP country from Vercel headers
  // Only set if user hasn't already chosen a language
  if (!request.cookies.has("googtrans")) {
    // Vercel maps the requester IP's country to this header
    const country =
      (request as any).geo?.country ||
      request.headers.get("x-vercel-ip-country");

    // Auto-localize to Indonesian if IP traces to Indonesia
    if (country === "ID") {
      response.cookies.set("googtrans", "/en/id", {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.json|robots.txt).*)",
  ],
};
