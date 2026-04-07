"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import type { UserProfile } from "@/types";

const COOKIE_NAME = "calorease-profile";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

const simpleMacrosSchema = z.object({
  protein: z.number().finite().nonnegative(),
  carbs: z.number().finite().nonnegative(),
  fat: z.number().finite().nonnegative(),
});

const exchangeUnitsSchema = z.object({
  starch: z.number().finite().nonnegative(),
  protein: z.number().finite().nonnegative(),
  fruit: z.number().finite().nonnegative(),
  vegetable: z.number().finite().nonnegative(),
  milk: z.number().finite().nonnegative(),
  fat: z.number().finite().nonnegative(),
  free: z.number().finite().nonnegative(),
});

const mealPlanSchema = z.object({
  daily_portions: z.object({
    total_units: z.number().finite().nonnegative(),
    groups: z.array(
      z.object({
        id: z.string().min(1),
        name: z.object({
          en: z.string().min(1),
          ar: z.string().min(1),
        }),
        units: z.number().finite().nonnegative(),
        exchanges: z.array(
          z.object({
            item: z.object({
              nameEn: z.string().min(1),
              nameAr: z.string().min(1),
              portion: z.string().min(1),
              calories: z.number().finite().nonnegative(),
            }),
            quantity: z.number().finite().nonnegative(),
          }),
        ),
      }),
    ),
  }),
});

const profileCookieSchema = z
  .object({
    name: z.string().min(2).max(50),
    age: z.number().int().min(15).max(100),
    gender: z.enum(["male", "female"]),
    weight: z.number().finite().min(40).max(250),
    height: z.number().finite().min(120).max(250),
    activityLevel: z.enum([
      "sedentary",
      "light",
      "moderate",
      "active",
      "elite",
    ]),
    goal: z.enum([
      "aggressive_cut",
      "lose_fat",
      "maintain",
      "lean_bulk",
      "build_muscle",
    ]),
    bodyFat: z.number().finite().min(0).max(70).optional(),
    bmr: z.number().finite().nonnegative(),
    tdee: z.number().finite().nonnegative(),
    bmi: z.number().finite().nonnegative(),
    bmiStatus: z.enum(["underweight", "optimal", "overweight", "obese"]),
    calorieTarget: z.number().finite().nonnegative(),
    macros: simpleMacrosSchema,
    exchangeUnits: exchangeUnitsSchema,
    mealPlan: mealPlanSchema.optional(),
    isManual: z.boolean().optional(),
  })
  .passthrough();

/**
 * Server Action: Save user profile to HTTP-only cookie
 * This eliminates hydration mismatches by making data available during SSR
 */
export async function saveProfile(profile: UserProfile): Promise<void> {
  const parsedProfile = profileCookieSchema.safeParse(profile);

  if (!parsedProfile.success) {
    throw new Error("Invalid profile payload");
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: JSON.stringify(parsedProfile.data),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/**
 * Server Action: Get user profile from cookie
 * Can be called from Server Components without hydration issues
 */
export async function getProfile(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);

  if (!cookie?.value) {
    return null;
  }

  try {
    const parsedJson: unknown = JSON.parse(cookie.value);
    const parsedProfile = profileCookieSchema.safeParse(parsedJson);

    if (!parsedProfile.success) {
      cookieStore.delete(COOKIE_NAME);
      return null;
    }

    return parsedProfile.data as UserProfile;
  } catch {
    cookieStore.delete(COOKIE_NAME);
    return null;
  }
}

/**
 * Server Action: Update user profile in cookie
 */
export async function updateProfile(
  updates: Partial<UserProfile>,
): Promise<UserProfile | null> {
  const currentProfile = await getProfile();

  if (!currentProfile) {
    return null;
  }

  const updatedProfile = { ...currentProfile, ...updates };
  const parsedProfile = profileCookieSchema.safeParse(updatedProfile);

  if (!parsedProfile.success) {
    return null;
  }

  await saveProfile(parsedProfile.data as UserProfile);
  return parsedProfile.data as UserProfile;
}

/**
 * Server Action: Clear all user data
 */
export async function clearProfile(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Server Action: Check if user has a profile (for middleware/redirects)
 */
export async function hasProfile(): Promise<boolean> {
  const profile = await getProfile();
  return profile !== null;
}
