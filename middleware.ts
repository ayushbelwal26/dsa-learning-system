import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/roadmap") ||
    pathname.startsWith("/topic") ||
    pathname.startsWith("/plan")
  );
}

/** Copy Set-Cookie headers from the session refresh response onto another response (e.g. redirects). */
function forwardSetCookies(from: NextResponse, to: NextResponse) {
  const cookies = from.headers.getSetCookie();
  for (const cookie of cookies) {
    to.headers.append("Set-Cookie", cookie);
  }
  return to;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, responseHeaders) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          if (responseHeaders) {
            for (const [key, value] of Object.entries(responseHeaders)) {
              if (typeof value === "string") {
                supabaseResponse.headers.set(key, value);
              }
            }
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (user && pathname === "/login") {
    const redirect = NextResponse.redirect(
      new URL("/dashboard", request.nextUrl.origin),
    );
    return forwardSetCookies(supabaseResponse, redirect);
  }

  if (!user && isProtectedPath(pathname)) {
    const login = new URL("/login", request.nextUrl.origin);
    login.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(login);
    return forwardSetCookies(supabaseResponse, redirect);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
