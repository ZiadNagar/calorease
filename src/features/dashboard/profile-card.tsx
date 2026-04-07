"use client";

import { useEffect, useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/utils";
import { useUserStore } from "@/stores";
import { calculateFullProfile } from "@/services";
import { ACTIVITY_DESCRIPTIONS, GOAL_DESCRIPTIONS } from "@/data";
import type {
  ProfileFormData,
  Gender,
  ActivityLevel,
  Goal,
  UserProfile,
} from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const profileSchema = z.object({
  name: z.string().min(2).max(50),
  age: z.number().min(15).max(100),
  gender: z.enum(["male", "female"]),
  weight: z.number().min(40).max(250),
  height: z.number().min(120).max(250),
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

const DEFAULT_FORM_VALUES: FormValues = {
  name: "",
  age: 25,
  gender: "male",
  weight: 70,
  height: 170,
  activityLevel: "moderate",
  goal: "maintain",
};

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

interface ProfileCardProps {
  initialProfile: UserProfile;
}

export const ProfileCard = ({ initialProfile }: ProfileCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const storeProfile = useUserStore((state) => state.profile);
  const profile = storeProfile ?? initialProfile;
  const setProfile = useUserStore((state) => state.setProfile);
  const inputIdPrefix = useId();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    reset({
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      weight: profile.weight,
      height: profile.height,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
      bodyFat: profile.bodyFat,
    });
  }, [profile, reset]);

  const watchedFormData = useWatch({ control });
  const formData: FormValues = {
    ...DEFAULT_FORM_VALUES,
    ...watchedFormData,
  };

  const nameInputId = `${inputIdPrefix}-name`;
  const ageInputId = `${inputIdPrefix}-age`;
  const weightInputId = `${inputIdPrefix}-weight`;
  const heightInputId = `${inputIdPrefix}-height`;
  const genderLegendId = `${inputIdPrefix}-gender-legend`;
  const activityLegendId = `${inputIdPrefix}-activity-legend`;
  const goalLegendId = `${inputIdPrefix}-goal-legend`;

  const currentActivity = ACTIVITY_LEVELS.find(
    (a) => a.id === profile.activityLevel,
  );
  const currentGoal = GOALS.find((g) => g.id === profile.goal);

  const handleSave = (data: FormValues) => {
    const profileData: ProfileFormData = {
      name: data.name,
      age: data.age,
      gender: data.gender as Gender,
      weight: data.weight,
      height: data.height,
      activityLevel: data.activityLevel as ActivityLevel,
      goal: data.goal as Goal,
      bodyFat: data.bodyFat ?? profile.bodyFat,
    };
    const newProfile = calculateFullProfile(profileData);
    setProfile(newProfile);
    setIsOpen(false);
  };

  return (
    <>
      <div className="organic-card p-5 sm:p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="stat-label text-xs sm:text-sm">Your Profile</span>
          <button
            onClick={() => setIsOpen(true)}
            className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            aria-label="Edit profile"
          >
            <svg
              className="w-4 h-4 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                {profile.gender === "male" ? "👨" : "👩"}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base sm:text-lg truncate">
                  {profile.name}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {profile.age} years old
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-3 sm:p-4 rounded-2xl bg-secondary/60 border border-border/50 text-center flex flex-col items-center justify-center min-h-20 sm:min-h-22.5">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Weight
                </p>
                <p className="text-xl sm:text-2xl font-black number-display leading-tight">
                  {profile.weight}
                </p>
                <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  kg
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-secondary/60 border border-border/50 text-center flex flex-col items-center justify-center min-h-20 sm:min-h-22.5">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Height
                </p>
                <p className="text-xl sm:text-2xl font-black number-display leading-tight">
                  {profile.height}
                </p>
                <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  cm
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary text-[10px] sm:text-xs font-medium">
                {currentActivity?.emoji} {currentActivity?.label}
              </span>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-medium">
                {currentGoal?.emoji} {currentGoal?.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Your Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and preferences.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleSave)} className="space-y-6 mt-4">
            {/* Name */}
            <div>
              <label htmlFor={nameInputId} className="stat-label block mb-2">
                Name
              </label>
              <input
                id={nameInputId}
                type="text"
                className="organic-input w-full"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Age, Weight, Height */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor={ageInputId} className="stat-label block mb-2">
                  Age
                </label>
                <input
                  id={ageInputId}
                  type="number"
                  className="organic-input w-full text-center"
                  {...register("age", { valueAsNumber: true })}
                />
                {errors.age && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={weightInputId}
                  className="stat-label block mb-2"
                >
                  Weight (kg)
                </label>
                <input
                  id={weightInputId}
                  type="number"
                  className="organic-input w-full text-center"
                  {...register("weight", { valueAsNumber: true })}
                />
                {errors.weight && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.weight.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={heightInputId}
                  className="stat-label block mb-2"
                >
                  Height (cm)
                </label>
                <input
                  id={heightInputId}
                  type="number"
                  className="organic-input w-full text-center"
                  {...register("height", { valueAsNumber: true })}
                />
                {errors.height && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.height.message}
                  </p>
                )}
              </div>
            </div>

            {/* Gender */}
            <fieldset className="border-0 p-0 m-0">
              <legend id={genderLegendId} className="stat-label block mb-2">
                Gender
              </legend>
              <div
                aria-labelledby={genderLegendId}
                className="grid grid-cols-2 gap-2"
              >
                {(["female", "male"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setValue("gender", g)}
                    aria-pressed={formData.gender === g}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all font-medium capitalize",
                      formData.gender === g
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent bg-secondary/50 text-muted-foreground",
                    )}
                  >
                    {g === "female" ? "♀" : "♂"} {g}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Activity Level */}
            <fieldset className="border-0 p-0 m-0">
              <legend id={activityLegendId} className="stat-label block mb-2">
                Activity Level
              </legend>
              <div
                aria-labelledby={activityLegendId}
                className="grid grid-cols-5 gap-1"
              >
                {ACTIVITY_LEVELS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setValue("activityLevel", a.id)}
                    aria-pressed={formData.activityLevel === a.id}
                    className={cn(
                      "p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1",
                      formData.activityLevel === a.id
                        ? "border-primary bg-primary/10"
                        : "border-transparent bg-secondary/50",
                    )}
                  >
                    <span className="text-lg">{a.emoji}</span>
                    <span className="text-[9px] font-bold uppercase">
                      {a.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {ACTIVITY_DESCRIPTIONS[formData.activityLevel]}
              </p>
            </fieldset>

            {/* Goal */}
            <fieldset className="border-0 p-0 m-0">
              <legend id={goalLegendId} className="stat-label block mb-2">
                Goal
              </legend>
              <div
                aria-labelledby={goalLegendId}
                className="grid grid-cols-5 gap-1"
              >
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setValue("goal", g.id)}
                    aria-pressed={formData.goal === g.id}
                    className={cn(
                      "p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1",
                      formData.goal === g.id
                        ? "border-primary bg-primary/10"
                        : "border-transparent bg-secondary/50",
                    )}
                  >
                    <span className="text-lg">{g.emoji}</span>
                    <span className="text-[9px] font-bold uppercase">
                      {g.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {GOAL_DESCRIPTIONS[formData.goal]}
              </p>
            </fieldset>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold organic-btn"
            >
              Save & Recalculate
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
