"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const STUDY_MODES = ["placement", "cp", "general"] as const;
const DAILY_HOURS = ["30", "60", "120", "180_plus"] as const;

export type CompleteOnboardingResult =
  | { ok: true }
  | { ok: false; error: string };

export async function completeOnboarding(
  studyMode: string,
  dailyHours: string,
  targetDate: string | null,
): Promise<CompleteOnboardingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!STUDY_MODES.includes(studyMode as (typeof STUDY_MODES)[number])) {
    return { ok: false, error: "Invalid study goal." };
  }

  if (!DAILY_HOURS.includes(dailyHours as (typeof DAILY_HOURS)[number])) {
    return { ok: false, error: "Invalid daily time choice." };
  }

  let targetDateValue: string | null = null;
  if (targetDate && targetDate.trim() !== "") {
    const d = new Date(targetDate);
    if (Number.isNaN(d.getTime())) {
      return { ok: false, error: "Invalid date." };
    }
    targetDateValue = targetDate.trim();
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      study_mode: studyMode,
      daily_hours: dailyHours,
      target_date: targetDateValue,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("[onboarding] profiles upsert:", error.message);
    return { ok: false, error: "Could not save your preferences. Try again." };
  }

  redirect("/dashboard");
}
