import { getRequestOrigin } from "@/lib/request-origin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/** 303 + no-store so the browser does not keep the OAuth callback in history (avoids back → Google picker). */
function redirectAfterOAuthSuccess(origin: string) {
  const res = NextResponse.redirect(new URL("/onboarding", origin), 303);
  res.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate",
  );
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getRequestOrigin(request);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", origin));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // ignore
          }
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const login = new URL("/login", origin);
    login.searchParams.set("error", error.message);
    return NextResponse.redirect(login);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Query the profiles table for this user's id
    const { data: profile } = await supabase
      .from("profiles")
      .select("study_mode, daily_hours")
      .eq("id", user.id)
      .maybeSingle();

    const profileFound = !!profile;
    const studyMode = profile?.study_mode;
    const dailyHours = profile?.daily_hours;
    
    // Debug logging
    console.log("[auth/callback] OAuth redirect decision:", {
      user_id: user.id,
      profile_found: profileFound,
      study_mode: studyMode,
      daily_hours: dailyHours,
    });

    if (!profile) {
      // No profile row found - create it and redirect to onboarding
      console.log("[auth/callback] No profile found, creating profile and redirecting to /onboarding");
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
      });
      if (insertError) {
        console.error("[auth/callback] profiles insert:", insertError.message);
      }
      return redirectAfterOAuthSuccess(origin);
    } else {
      // Profile row found - check if study_mode or daily_hours is null
      if (studyMode === null || dailyHours === null) {
        console.log("[auth/callback] Profile found but incomplete (study_mode or daily_hours is null), redirecting to /onboarding");
        return redirectAfterOAuthSuccess(origin);
      } else {
        // Profile row found and both study_mode and daily_hours have values
        console.log("[auth/callback] Profile found and complete, redirecting to /dashboard");
        const res = NextResponse.redirect(new URL("/dashboard", origin), 303);
        res.headers.set(
          "Cache-Control",
          "no-store, no-cache, must-revalidate",
        );
        res.headers.set("Pragma", "no-cache");
        res.headers.set("Expires", "0");
        return res;
      }
    }
  }

  // Fallback to onboarding if no user
  console.log("[auth/callback] No user found, fallback to /onboarding");
  return redirectAfterOAuthSuccess(origin);
}
