"use client";

import { useMemo } from "react";
import { cn } from "@/utils";
import type { UserProfile } from "@/types";

interface HealthInsightsProps {
  profile: UserProfile;
}

interface Insight {
  title: string;
  description: string;
  type: "success" | "warning" | "info" | "tip";
  emoji: string;
}

const TYPE_STYLES = {
  success: "bg-primary/10 border-primary/20",
  warning: "bg-amber-500/10 border-amber-500/20",
  tip: "bg-blue-500/10 border-blue-500/20",
  info: "bg-secondary border-border",
} as const;

const TYPE_COLORS = {
  success: "text-primary",
  warning: "text-amber-500",
  tip: "text-blue-500",
  info: "text-foreground",
} as const;

const generateInsights = (profile: UserProfile): Insight[] => {
  const { bmi, bmiStatus, goal, tdee, calorieTarget, macros, weight } = profile;
  const deficit = tdee - calorieTarget;
  const surplus = calorieTarget - tdee;
  const insightList: Insight[] = [];

  // BMI-based insights
  if (bmiStatus === "underweight") {
    insightList.push({
      emoji: "⚠️",
      title: "Underweight",
      description: "Consider a caloric surplus with nutrient-dense foods.",
      type: "warning",
    });
  } else if (bmiStatus === "overweight" || bmiStatus === "obese") {
    insightList.push({
      emoji: "📊",
      title: "Weight Focus",
      description: `BMI ${bmi.toFixed(1)} - gradual deficit recommended.`,
      type: "info",
    });
  } else {
    insightList.push({
      emoji: "✅",
      title: "Healthy BMI",
      description: "Maintain with balanced nutrition.",
      type: "success",
    });
  }

  // Goal-based insights
  if (goal === "aggressive_cut" || goal === "lose_fat") {
    const weeklyLoss = ((deficit * 7) / 7700).toFixed(1);
    insightList.push({
      emoji: "🔥",
      title: `${Math.round(deficit)} kcal Deficit`,
      description: `Est. ${weeklyLoss}kg/week loss at this rate.`,
      type: "info",
    });
  } else if (goal === "lean_bulk" || goal === "build_muscle") {
    insightList.push({
      emoji: "💪",
      title: `${Math.round(surplus)} kcal Surplus`,
      description: "Pair with resistance training for best results.",
      type: "tip",
    });
  }

  // Protein insight
  const proteinPerKg = macros.protein / weight;
  if (proteinPerKg >= 1.6) {
    insightList.push({
      emoji: "⚡",
      title: `${proteinPerKg.toFixed(1)}g/kg Protein`,
      description: "Optimal for muscle synthesis.",
      type: "success",
    });
  } else {
    insightList.push({
      emoji: "💡",
      title: "Boost Protein",
      description: "Target 1.6-2.2g/kg for better results.",
      type: "tip",
    });
  }

  return insightList;
};

export const HealthInsights = ({ profile }: HealthInsightsProps) => {
  const insights = useMemo(() => generateInsights(profile), [profile]);

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2a9 9 0 0 1 9 9c0 3.6-3.6 7.2-9 11-5.4-3.8-9-7.4-9-11a9 9 0 0 1 9-9z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <span className="font-bold text-lg">Insights</span>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-2xl border transition-all hover:scale-[1.02]",
              TYPE_STYLES[insight.type],
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{insight.emoji}</span>
              <div className="flex-1 min-w-0">
                <p
                  className={cn("text-sm font-bold", TYPE_COLORS[insight.type])}
                >
                  {insight.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
