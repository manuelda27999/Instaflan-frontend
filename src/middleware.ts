import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protedtedPaths = [
  "/home",
  "/profile",
  "/messages",
  "/explorer",
  "/notifications",
];
const publicPaths = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = (await cookies()).get("session")?.value;

  const isProtectedPath = protedtedPaths.includes(path);
  const isPublicPath = publicPaths.includes(path);

  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicPath && token) {
    const homeUrl = new URL("/home", req.nextUrl);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}
