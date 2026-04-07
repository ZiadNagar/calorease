"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/stores";
import { cn } from "@/utils";
import type { UserProfile } from "@/types";

const WATER_INCREMENT = 250;

const getHydrationStatus = (progress: number) => {
  if (progress >= 100) return { text: "Complete", color: "text-primary" };
  if (progress >= 75) return { text: "Great", color: "text-blue-500" };
  if (progress >= 50) return { text: "Good", color: "text-amber-500" };
  if (progress >= 25) return { text: "Low", color: "text-orange-500" };
  return { text: "Start", color: "text-rose-500" };
};

interface WaterTrackerProps {
  initialProfile: UserProfile;
}

export const WaterTracker = ({ initialProfile }: WaterTrackerProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const waterIntake = useUserStore((state) => state.waterIntake);
  const updateWaterIntake = useUserStore((state) => state.updateWaterIntake);
  const storeProfile = useUserStore((state) => state.profile);
  const profile = storeProfile ?? initialProfile;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const recommendedWater = profile ? Math.round(profile.weight * 35) : 2500;
  const progress = Math.min((waterIntake / recommendedWater) * 100, 100);
  const glasses = Math.floor(waterIntake / WATER_INCREMENT);
  const targetGlasses = Math.ceil(recommendedWater / WATER_INCREMENT);

  const status = getHydrationStatus(progress);

  const handleAddWater = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    setIsAnimating(true);
    updateWaterIntake(WATER_INCREMENT);
    timeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      timeoutRef.current = null;
    }, 300);
  };

  const handleRemoveWater = () => {
    if (waterIntake < WATER_INCREMENT) return;
    updateWaterIntake(-WATER_INCREMENT);
  };

  return (
    <div className="p-6 h-full relative overflow-hidden">
      {/* Animated water fill */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-blue-500/15 to-transparent transition-all duration-700 ease-out"
        style={{ height: `${progress}%` }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z" />
              </svg>
            </div>
            <div>
              <span className="font-bold">Hydration</span>
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-wider ml-2",
                  status.color,
                )}
              >
                {status.text}
              </span>
            </div>
          </div>
        </div>

        {/* Main Value */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-5xl font-black tracking-tighter number-display">
              {(waterIntake / 1000).toFixed(1)}
            </span>
            <span className="text-lg text-muted-foreground ml-1">L</span>
            <p className="text-xs text-muted-foreground mt-1">
              of {(recommendedWater / 1000).toFixed(1)}L goal
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRemoveWater}
              disabled={waterIntake === 0}
              className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
              aria-label="Remove water"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
              </svg>
            </button>
            <button
              onClick={handleAddWater}
              className={cn(
                "w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-all",
                isAnimating && "scale-90",
              )}
              aria-label="Add water"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg
              className="w-full h-full transform -rotate-90"
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
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.51} 251`}
                className="text-blue-500 transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Glasses</span>
              <span className="font-bold">
                {glasses} / {targetGlasses}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Per glass</span>
              <span className="font-bold">250ml</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
