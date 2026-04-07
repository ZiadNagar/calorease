"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores";
import {
  WaterTracker,
  HealthInsights,
  ProfileCard,
} from "@/features/dashboard";
import { BMI_STATUS_LABELS } from "@/types";
import type { UserProfile } from "@/types";
import { METRIC_DEFINITIONS } from "@/data";
import { InfoTooltip } from "@/components/common";
import { cn } from "@/utils";

interface ProfileContentProps {
  initialProfile: UserProfile;
}

const ProfileContent = ({ initialProfile }: ProfileContentProps) => {
  // Use store for reactivity, fallback to server-provided initial profile
  const storeProfile = useUserStore((state) => state.profile);
  const profile = storeProfile ?? initialProfile;

  const { macros, bmr, tdee, calorieTarget, bmi, bmiStatus } = profile;
  const safeCalorieTarget = Math.max(1, calorieTarget);

  const macroData = useMemo(
    () => [
      {
        label: "Protein",
        value: Math.round(macros.protein),
        unit: "g",
        percentage: Math.round(
          ((macros.protein * 4) / safeCalorieTarget) * 100,
        ),
        color: "from-blue-500 to-cyan-400",
        id: "protein-gradient",
      },
      {
        label: "Carbs",
        value: Math.round(macros.carbs),
        unit: "g",
        percentage: Math.round(((macros.carbs * 4) / safeCalorieTarget) * 100),
        color: "from-amber-500 to-yellow-400",
        id: "carbs-gradient",
      },
      {
        label: "Fat",
        value: Math.round(macros.fat),
        unit: "g",
        percentage: Math.round(((macros.fat * 9) / safeCalorieTarget) * 100),
        color: "from-rose-500 to-pink-400",
        id: "fat-gradient",
      },
    ],
    [macros.carbs, macros.fat, macros.protein, safeCalorieTarget],
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-2">
      {/* Welcome Header */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Welcome, {profile.name}
              <span className="text-gradient-nature">!</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Your metabolic blueprint is ready. Track, plan, and optimize your
              nutrition.
            </p>
          </div>
          <Link
            href="/meal-planner"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold organic-btn shrink-0 justify-center"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V8a2 2 0 00-2-2h-4a2 2 0 00-2 2v7M17 22v-7" />
            </svg>
            Plan Meals
          </Link>
        </div>
      </header>

      {/* Main Bento Grid - Clean rows without spanning */}
      <div className="space-y-4 md:space-y-5">
        {/* Row 1: Profile + Daily Target with Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <ProfileCard initialProfile={initialProfile} />

          <div className="organic-card p-6 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <span className="font-bold">Daily Target</span>
                <InfoTooltip
                  content={METRIC_DEFINITIONS.calorieTarget.description}
                  ariaLabel="More information about daily calorie target"
                />
              </div>

              {/* Main Calorie Display */}
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter number-display">
                  {Math.round(calorieTarget)}
                </span>
                <span className="text-base sm:text-lg text-muted-foreground">
                  kcal
                </span>
              </div>

              {/* 4 Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {/* BMR */}
                <div className="p-3 sm:p-4 rounded-2xl bg-secondary/60 border border-border/50 text-center flex flex-col items-center justify-center min-h-25 sm:min-h-27.5">
                  <div className="flex items-center justify-center gap-1 mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      BMR
                    </span>
                    <InfoTooltip
                      content={METRIC_DEFINITIONS.bmr.description}
                      size="sm"
                      ariaLabel="More information about basal metabolic rate"
                    />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black number-display block leading-tight">
                    {Math.round(bmr)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    kcal
                  </span>
                </div>

                {/* TDEE */}
                <div className="p-3 sm:p-4 rounded-2xl bg-secondary/60 border border-border/50 text-center flex flex-col items-center justify-center min-h-25 sm:min-h-27.5">
                  <div className="flex items-center justify-center gap-1 mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      TDEE
                    </span>
                    <InfoTooltip
                      content={METRIC_DEFINITIONS.tdee.description}
                      size="sm"
                      ariaLabel="More information about total daily energy expenditure"
                    />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black number-display block leading-tight">
                    {Math.round(tdee)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    kcal
                  </span>
                </div>

                {/* BMI */}
                <div className="p-3 sm:p-4 rounded-2xl bg-secondary/60 border border-border/50 text-center flex flex-col items-center justify-center min-h-25 sm:min-h-27.5">
                  <div className="flex items-center justify-center gap-1 mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      BMI
                    </span>
                    <InfoTooltip
                      content={METRIC_DEFINITIONS.bmi.description}
                      size="sm"
                      ariaLabel="More information about body mass index"
                    />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black number-display block leading-tight">
                    {bmi.toFixed(1)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {BMI_STATUS_LABELS[bmiStatus]}
                  </span>
                </div>

                {/* Protein */}
                <div className="p-3 sm:p-4 rounded-2xl bg-secondary/60 border border-border/50 text-center flex flex-col items-center justify-center min-h-25 sm:min-h-27.5">
                  <div className="flex items-center justify-center gap-1 mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Protein
                    </span>
                    <InfoTooltip
                      content={METRIC_DEFINITIONS.protein.description}
                      size="sm"
                      ariaLabel="More information about daily protein target"
                    />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black number-display block leading-tight">
                    {Math.round(macros.protein)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    grams
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Macros + Hydration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Macros Section */}
          <div className="organic-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0 1 0 20" />
                  <path d="M12 2a10 10 0 0 0 0 20" />
                </svg>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-lg">Macro Split</span>
                <InfoTooltip
                  content={METRIC_DEFINITIONS.macros.description}
                  ariaLabel="More information about macro split"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {macroData.map((macro) => (
                <div key={macro.label} className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg
                      className="w-16 h-16 md:w-20 md:h-20"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-secondary"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={`url(#${macro.id})`}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${macro.percentage * 2.51} 251`}
                        transform="rotate(-90 50 50)"
                        className={cn("transition-all duration-1000")}
                      />
                      <defs>
                        <linearGradient
                          id={macro.id}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            className="text-primary"
                            stopColor="currentColor"
                          />
                          <stop
                            offset="100%"
                            className="text-accent"
                            stopColor="currentColor"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-base md:text-lg font-black number-display">
                        {macro.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {macro.unit}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-bold mt-2">{macro.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {macro.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hydration */}
          <div className="organic-card p-0 overflow-hidden">
            <WaterTracker initialProfile={initialProfile} />
          </div>
        </div>

        {/* Row 4: Insights - Full width */}
        <div className="organic-card p-0 overflow-hidden">
          <HealthInsights profile={profile} />
        </div>
      </div>
    </div>
  );
};

export { ProfileContent };
