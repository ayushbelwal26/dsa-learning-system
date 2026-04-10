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

/** Copy Set-Cookie headers from the session refresh response onto another response (e.g. redirects). */
function forwardSetCookies(from: NextResponse, to: NextResponse) {
  const cookies = from.headers.getSetCookie();
  for (const cookie of cookies) {
    to.headers.append("Set-Cookie", cookie);
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

/**
 * Missing profile row OR null study_mode/daily_hours → needs onboarding.
 * Query errors: treat as needs onboarding (never send logged-in user to /login for this).
 */
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
  const origin = request.nextUrl.origin;

  // Not logged in → only then send to /login for protected routes.
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

  const incompleteOnboarding = onboardingState.needsOnboarding;

  if (pathname === "/login") {
    const dest = incompleteOnboarding ? "/onboarding" : "/dashboard";
    const redirect = NextResponse.redirect(new URL(dest, origin));
    return forwardSetCookies(supabaseResponse, redirect);
  }

  // Logged in but profile missing or incomplete → send to onboarding from app routes that require a finished profile.
  if (incompleteOnboarding) {
    if (needsOnboardingCompletePath(pathname)) {
      const redirect = NextResponse.redirect(new URL("/onboarding", origin));
      return forwardSetCookies(supabaseResponse, redirect);
    }
    return supabaseResponse;
  }

  // Profile complete; don't keep them on onboarding.
  if (isOnboardingPath(pathname)) {
    const redirect = NextResponse.redirect(new URL("/dashboard", origin));
    return forwardSetCookies(supabaseResponse, redirect);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
