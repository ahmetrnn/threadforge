import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

type MiddlewareResponse = NextResponse | undefined;

export async function middleware(req: NextRequest): Promise<MiddlewareResponse> {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (pathname === "/login" || pathname === "/signup") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard", "/login", "/signup"],
};
