"use client";

import { useState } from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";
import { useUserStore } from "@/stores";
import { calculateFullProfile } from "@/services";
import { ACTIVITY_DESCRIPTIONS, GOAL_DESCRIPTIONS } from "@/data";
import { InfoTooltip } from "@/components/common";
import type { ProfileFormData, Gender, ActivityLevel, Goal } from "@/types";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  age: z.number().min(15, "Must be at least 15").max(100, "Must be under 100"),
  gender: z.enum(["male", "female"]),
  weight: z.number().min(40, "Min 40kg").max(250, "Max 250kg"),
  height: z.number().min(120, "Min 120cm").max(250, "Max 250cm"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "elite"]),
  goal: z.enum([
    "aggressive_cut",
    "lose_fat",
    "maintain",
    "lean_bulk",
    "build_muscle",
  ]),
  bodyFat: z.number().min(3).max(60).optional(),
});

type FormValues = z.infer<typeof profileSchema>;

const ACTIVITY_LEVELS: { id: ActivityLevel; label: string; emoji: string }[] = [
  { id: "sedentary", label: "Sedentary", emoji: "🪑" },
  { id: "light", label: "Light", emoji: "🚶" },
  { id: "moderate", label: "Moderate", emoji: "🏃" },
  { id: "active", label: "Active", emoji: "💪" },
  { id: "elite", label: "Elite", emoji: "🏆" },
];

const GOALS: { id: Goal; label: string; emoji: string }[] = [
  { id: "aggressive_cut", label: "Shred", emoji: "🔥" },
  { id: "lose_fat", label: "Lean", emoji: "⚡" },
  { id: "maintain", label: "Maintain", emoji: "⚖️" },
  { id: "lean_bulk", label: "Grow", emoji: "📈" },
  { id: "build_muscle", label: "Build", emoji: "🏋️" },
];

const STEP_TITLES = {
  1: "Your Body",
  2: "Activity",
  3: "Goal",
} as const;

export const ProfileForm = () => {
  const [step, setStep] = useState(1);
  const [goalSelected, setGoalSelected] = useState(false);
  const router = useRouter();
  const setProfile = useUserStore((state) => state.setProfile);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gender: "female",
      activityLevel: "moderate",
      goal: "maintain",
    },
  });

  // useWatch is React Compiler compatible (unlike watch())
  const watchedData = useWatch({ control });
  // Provide defaults since useWatch can return undefined during initial render
  const formData = {
    gender: watchedData.gender ?? "female",
    activityLevel: watchedData.activityLevel ?? "moderate",
    goal: watchedData.goal ?? "maintain",
  };

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    const profileData: ProfileFormData = {
      name: data.name,
      age: data.age,
      gender: data.gender as Gender,
      weight: data.weight,
      height: data.height,
      activityLevel: data.activityLevel as ActivityLevel,
      goal: data.goal as Goal,
      bodyFat: data.bodyFat,
    };
    const profile = calculateFullProfile(profileData);
    setProfile(profile);
    router.push("/profile");
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger([
        "name",
        "age",
        "gender",
        "weight",
        "height",
      ]);
      if (!isValid) return;
    }
    if (step === 2) {
      const isValid = await trigger(["activityLevel"]);
      if (!isValid) return;
    }
    setStep((s) => s + 1);
  };

  const handleGoalSelect = (goalId: Goal) => {
    setValue("goal", goalId);
    setGoalSelected(true);
  };

  const handlePrevStep = () => setStep((s) => s - 1);

  return (
    <div className="organic-card overflow-hidden">
      {/* Progress Bar */}
      <div className="h-1 bg-secondary/30">
        <div
          className="h-full bg-linear-to-r from-primary to-accent transition-all duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="p-5 sm:p-8 md:p-10">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300",
                    s === step
                      ? "bg-primary text-primary-foreground scale-110"
                      : s < step
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-muted-foreground",
                  )}
                >
                  {s < step ? (
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {STEP_TITLES[step as keyof typeof STEP_TITLES]}
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="stat-label text-xs sm:text-sm">
              Step {step} of 3
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Step 1: Biometrics */}
          {step === 1 && (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="stat-label block mb-2 sm:mb-3 text-xs sm:text-sm"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="organic-input w-full text-base sm:text-lg font-medium"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-2 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Gender Selection */}
              <div>
                <label className="stat-label block mb-2 sm:mb-3 text-xs sm:text-sm">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {(["female", "male"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setValue("gender", g)}
                      className={cn(
                        "p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 font-bold uppercase tracking-wider text-xs sm:text-sm",
                        formData.gender === g
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">
                        {g === "female" ? "♀" : "♂"}
                      </span>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numeric Inputs */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <label
                    htmlFor="age"
                    className="stat-label block mb-2 sm:mb-3 text-xs sm:text-sm"
                  >
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    placeholder="25"
                    className="organic-input text-center text-base sm:text-lg font-bold w-full"
                    {...register("age", { valueAsNumber: true })}
                  />
                  {errors.age && (
                    <p className="text-[10px] sm:text-xs text-destructive mt-1 sm:mt-2 font-medium">
                      {errors.age.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="weight"
                    className="stat-label block mb-2 sm:mb-3 text-xs sm:text-sm"
                  >
                    Weight
                  </label>
                  <input
                    id="weight"
                    type="number"
                    placeholder="70"
                    className="organic-input text-center text-base sm:text-lg font-bold w-full"
                    {...register("weight", { valueAsNumber: true })}
                  />
                  {errors.weight && (
                    <p className="text-[10px] sm:text-xs text-destructive mt-1 sm:mt-2 font-medium">
                      {errors.weight.message}
                    </p>
                  )}
                  <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 block text-center">
                    kg
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="height"
                    className="stat-label block mb-2 sm:mb-3 text-xs sm:text-sm"
                  >
                    Height
                  </label>
                  <input
                    id="height"
                    type="number"
                    placeholder="170"
                    className="organic-input text-center text-base sm:text-lg font-bold w-full"
                    {...register("height", { valueAsNumber: true })}
                  />
                  {errors.height && (
                    <p className="text-[10px] sm:text-xs text-destructive mt-1 sm:mt-2 font-medium">
                      {errors.height.message}
                    </p>
                  )}
                  <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 block text-center">
                    cm
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Activity Level */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <label className="stat-label text-xs sm:text-sm">
                  How active are you?
                </label>
                <InfoTooltip content="Your activity level determines your Total Daily Energy Expenditure (TDEE). Be honest — overestimating leads to inaccurate calorie targets." />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {ACTIVITY_LEVELS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setValue("activityLevel", a.id)}
                    title={ACTIVITY_DESCRIPTIONS[a.id]}
                    className={cn(
                      "p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-1 sm:gap-2",
                      formData.activityLevel === a.id
                        ? "border-primary bg-primary/10"
                        : "border-transparent bg-secondary/50 hover:bg-secondary",
                    )}
                  >
                    <span className="text-lg sm:text-2xl">{a.emoji}</span>
                    <span
                      className={cn(
                        "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center",
                        formData.activityLevel === a.id
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      {a.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center mt-3 sm:mt-4">
                {ACTIVITY_DESCRIPTIONS[formData.activityLevel]}
              </p>
            </div>
          )}

          {/* Step 3: Goal */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <label className="stat-label text-xs sm:text-sm">
                  What&apos;s your goal?
                </label>
                <InfoTooltip content="Your goal adjusts your daily calorie target. Weight loss uses a calorie deficit, maintenance keeps you balanced, and muscle gain uses a surplus." />
              </div>
              {!goalSelected && (
                <p className="text-xs sm:text-sm text-amber-500 text-center mb-2">
                  Please select your goal to continue
                </p>
              )}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleGoalSelect(g.id)}
                    title={GOAL_DESCRIPTIONS[g.id]}
                    className={cn(
                      "p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-1 sm:gap-2",
                      formData.goal === g.id && goalSelected
                        ? "border-primary bg-primary/10"
                        : "border-transparent bg-secondary/50 hover:bg-secondary",
                    )}
                  >
                    <span className="text-lg sm:text-2xl">{g.emoji}</span>
                    <span
                      className={cn(
                        "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center",
                        formData.goal === g.id && goalSelected
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      {g.label}
                    </span>
                  </button>
                ))}
              </div>
              {goalSelected && (
                <p className="text-xs sm:text-sm text-muted-foreground text-center mt-3 sm:mt-4">
                  {GOAL_DESCRIPTIONS[formData.goal]}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 py-3 sm:py-4 rounded-full border-2 border-border font-bold text-sm sm:text-base text-muted-foreground hover:bg-secondary transition-colors"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-2 py-3 sm:py-4 rounded-full bg-primary text-primary-foreground font-bold text-sm sm:text-base organic-btn"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={!goalSelected}
                className={cn(
                  "flex-2 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base organic-btn transition-all",
                  goalSelected
                    ? "bg-linear-to-r from-primary to-accent text-white"
                    : "bg-secondary text-muted-foreground cursor-not-allowed",
                )}
              >
                Calculate My Blueprint
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

