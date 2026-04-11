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
    // Check if profile exists and is complete
    const { data: profile } = await supabase
      .from("profiles")
      .select("study_mode, daily_hours")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      // No profile row exists - create it and redirect to onboarding
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
      });
      if (insertError) {
        console.error("[auth/callback] profiles insert:", insertError.message);
      }
      return redirectAfterOAuthSuccess(origin);
    } else {
      // Profile row exists - check if complete
      const isComplete = profile.study_mode && profile.daily_hours;
      
      if (isComplete) {
        // Profile is complete - redirect to dashboard
        const res = NextResponse.redirect(new URL("/dashboard", origin), 303);
        res.headers.set(
          "Cache-Control",
          "no-store, no-cache, must-revalidate",
        );
        res.headers.set("Pragma", "no-cache");
        res.headers.set("Expires", "0");
        return res;
      } else {
        // Profile exists but incomplete - redirect to onboarding
        return redirectAfterOAuthSuccess(origin);
      }
    }
  }

  // Fallback to onboarding if no user
  return redirectAfterOAuthSuccess(origin);
}
