import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

function needsOnboardingCompletePath(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/roadmap") ||
    pathname.startsWith("/topic") ||
    pathname.startsWith("/plan")
  );
}

function isOnboardingPath(pathname: string) {
  return pathname === "/onboarding" || pathname.startsWith("/onboarding/");
}

function requiresAuth(pathname: string) {
  return needsOnboardingCompletePath(pathname) || isOnboardingPath(pathname);
}

/**
 * Copy session cookies onto redirects. Uses getSetCookie when available (Node);
 * falls back to Response cookies API for Edge runtimes that omit getSetCookie.
 */
function forwardSetCookies(from: NextResponse, to: NextResponse) {
  try {
    const getSetCookie = from.headers.getSetCookie?.bind(from.headers);
    if (typeof getSetCookie === "function") {
      const list = getSetCookie();
      if (Array.isArray(list) && list.length > 0) {
        for (const cookie of list) {
          to.headers.append("Set-Cookie", cookie);
        }
        return to;
      }
    }
  } catch {
    // fall through
  }

  try {
    for (const c of from.cookies.getAll()) {
      to.cookies.set(c.name, c.value);
    }
  } catch {
    // last resort: continue without copying (session may still work on same response chain)
  }

  return to;
}

type ProfileOnboardingState = {
  needsOnboarding: boolean;
  profileRowFound: boolean;
  study_mode: string | null | undefined;
  daily_hours: string | null | undefined;
  profileQueryError: boolean;
};

async function getProfileOnboardingState(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileOnboardingState> {
  const { data: rows, error } = await supabase
    .from("profiles")
    .select("study_mode, daily_hours")
    .eq("id", userId)
    .limit(1);

  if (error) {
    return {
      needsOnboarding: true,
      profileRowFound: false,
      study_mode: undefined,
      daily_hours: undefined,
      profileQueryError: true,
    };
  }

  const row = rows?.[0];
  if (row === undefined || row === null) {
    return {
      needsOnboarding: true,
      profileRowFound: false,
      study_mode: null,
      daily_hours: null,
      profileQueryError: false,
    };
  }

  const incomplete =
    row.study_mode == null || row.daily_hours == null;
  return {
    needsOnboarding: incomplete,
    profileRowFound: true,
    study_mode: row.study_mode ?? null,
    daily_hours: row.daily_hours ?? null,
    profileQueryError: false,
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.nextUrl.origin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[middleware] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — set them in Vercel Project Settings → Environment Variables",
    );
    if (requiresAuth(pathname)) {
      return NextResponse.redirect(new URL("/login", origin));
    }
    return NextResponse.next();
  }

  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (requiresAuth(pathname)) {
        const login = new URL("/login", origin);
        login.searchParams.set("next", pathname);
        const redirect = NextResponse.redirect(login);
        return forwardSetCookies(supabaseResponse, redirect);
      }
      return supabaseResponse;
    }

    const userId = user.id;
    const onboardingState = await getProfileOnboardingState(supabase, userId);

    if (process.env.NODE_ENV === "development") {
      console.log("[middleware:onboarding]", {
        userId,
        profileRowFound: onboardingState.profileRowFound,
        study_mode: onboardingState.study_mode,
        daily_hours: onboardingState.daily_hours,
        needsOnboarding: onboardingState.needsOnboarding,
        pathname,
        ...(onboardingState.profileQueryError
          ? { profileQueryError: true }
          : {}),
      });
    }

    const incompleteOnboarding = onboardingState.needsOnboarding;

    if (pathname === "/login") {
      const dest = incompleteOnboarding ? "/onboarding" : "/dashboard";
      const redirect = NextResponse.redirect(new URL(dest, origin));
      return forwardSetCookies(supabaseResponse, redirect);
    }

    if (incompleteOnboarding) {
      if (needsOnboardingCompletePath(pathname)) {
        const redirect = NextResponse.redirect(new URL("/onboarding", origin));
        return forwardSetCookies(supabaseResponse, redirect);
      }
      return supabaseResponse;
    }

    if (isOnboardingPath(pathname)) {
      const redirect = NextResponse.redirect(new URL("/dashboard", origin));
      return forwardSetCookies(supabaseResponse, redirect);
    }

    return supabaseResponse;
  } catch (err) {
    console.error("[middleware] Uncaught error:", err);
    if (requiresAuth(pathname)) {
      return NextResponse.redirect(new URL("/login", origin));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
