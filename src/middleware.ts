import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const requireAuth: string[] = [
  "/chat",
  "/api",
  "/reporting",
  "/unauthorized",
  "/persona",
  "/prompt",
  "/extensions" // Toegevoegd aan de vereiste authenticatiepaden
];
const requireAdmin: string[] = ["/reporting", "/extensions"]; // Alleen toegankelijk voor admins

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  if (requireAuth.some((path) => pathname.startsWith(path))) {
    const token = await getToken({
      req: request,
    });

    // Controleer of de gebruiker niet is ingelogd
    if (!token) {
      const url = new URL(`/`, request.url);
      return NextResponse.redirect(url);
    }

    // Controleer of de gebruiker geen admin is voor admin-only paden
    if (requireAdmin.some((path) => pathname.startsWith(path))) {
      if (!token.isAdmin) {
        const url = new URL(`/unauthorized`, request.url);
        return NextResponse.rewrite(url);
      }
    }
  }

  return res;
}

// Zorg ervoor dat de middleware wordt toegepast op de juiste routes
export const config = {
  matcher: [
    "/unauthorized/:path*",
    "/reporting/:path*",
    "/extensions/:path*", // Middleware toepassen op de extensiepagina
    "/api/chat:path*",
    "/api/images:path*",
    "/chat/:path*",
  ],
};
