import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|banks).*)"],
};

// Define tus rutas públicas aquí
const publicRoutes = ["/", "/login", "/seed"];
const dynamicPublicRoutes = [
  /^\/queue\/[^/]+$/,
  /^\/bank\/[^/]+$/,
  /^\/bank\/[^/]+\/queue$/,
  /^\/bank\/[^/]+\/request-ticket$/,
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublicRoute =
    publicRoutes.includes(path) ||
    dynamicPublicRoutes.some(
      (route) => typeof route === "object" && route.test(path)
    );

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // Si la ruta NO es pública y no hay sesión, redirige al login
  if (!isPublicRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Si la ruta es pública y ya hay sesión, redirige al dashboard (excepto en "/turn")
  if (isPublicRoute && session?.userId && path !== "/turn") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}
