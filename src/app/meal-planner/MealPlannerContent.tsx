"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores";
import {
  FOOD_GROUPS,
  FOOD_GROUP_DESCRIPTIONS,
  type FoodGroupKey,
  type FoodItem,
} from "@/data";
import { cn } from "@/utils";
import { InfoTooltip } from "@/components/common";
import type { UserProfile } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MEAL_TIMES = ["breakfast", "lunch", "dinner", "snacks"] as const;
type MealTime = (typeof MEAL_TIMES)[number];

const MEAL_LABELS: Record<
  MealTime,
  { label: string; time: string; emoji: string }
> = {
  breakfast: { label: "Breakfast", time: "7:00 - 9:00 AM", emoji: "🌅" },
  lunch: { label: "Lunch", time: "12:00 - 2:00 PM", emoji: "☀️" },
  dinner: { label: "Dinner", time: "6:00 - 8:00 PM", emoji: "🌙" },
  snacks: { label: "Snacks", time: "Between meals", emoji: "🍎" },
};

// Default food suggestions per meal time for each food group
const DEFAULT_SUGGESTIONS: Record<
  MealTime,
  Partial<Record<FoodGroupKey, string>>
> = {
  breakfast: {
    starch: "Oatmeal",
    protein: "Egg",
    fruit: "Apple",
    milk: "Milk",
    fat: "Olive Oil",
  },
  lunch: {
    starch: "Rice (cooked)",
    protein: "Chicken",
    vegetable: "Raw Leafy Vegetables",
    fruit: "Orange",
    fat: "Olive Oil",
  },
  dinner: {
    starch: "Arabic bread (large)",
    protein: "Fish",
    vegetable: "Cucumber",
    fruit: "Grapes",
    fat: "Avocado",
  },
  snacks: {
    starch: "Popcorn",
    protein: "Cottage Cheese",
    fruit: "Banana",
    milk: "Yogurt",
    fat: "Nuts",
  },
};

const FOOD_GROUP_EMOJIS: Record<FoodGroupKey, string> = {
  starch: "🍞",
  protein: "🍗",
  fruit: "🍎",
  vegetable: "🥬",
  milk: "🥛",
  fat: "🫒",
  free: "🍵",
};

const FOOD_GROUP_COLORS: Record<
  FoodGroupKey,
  { bg: string; border: string; text: string }
> = {
  starch: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  protein: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
  },
  fruit: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
  },
  vegetable: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  milk: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  fat: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
  },
  free: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    text: "text-teal-600 dark:text-teal-400",
  },
};

interface MealPlannerContentProps {
  initialProfile: UserProfile;
}

const MealPlannerContent = ({ initialProfile }: MealPlannerContentProps) => {
  // Use store for reactivity, fallback to server-provided initial profile
  const storeProfile = useUserStore((state) => state.profile);
  const profile = storeProfile ?? initialProfile;
  const mealAssignments = useUserStore((state) => state.mealAssignments);
  const setMealAssignment = useUserStore((state) => state.setMealAssignment);
  const [activeMeal, setActiveMeal] = useState<MealTime>("breakfast");
  const [openDialog, setOpenDialog] = useState<FoodGroupKey | null>(null);

  const exchangeUnits = useMemo(() => {
    return profile.exchangeUnits;
  }, [profile]);

  // Get suggested or assigned food for a group
  const getSelectedFood = (
    mealTime: MealTime,
    groupKey: FoodGroupKey,
  ): FoodItem | null => {
    const group = FOOD_GROUPS[groupKey];
    const assignedFood = mealAssignments[mealTime]?.[groupKey];

    // If user has selected something, use that
    if (assignedFood) {
      return group.items.find((item) => item.nameEn === assignedFood) || null;
    }

    // Otherwise use default suggestion
    const defaultFood = DEFAULT_SUGGESTIONS[mealTime]?.[groupKey];
    if (defaultFood) {
      return (
        group.items.find((item) => item.nameEn === defaultFood) ||
        group.items[0]
      );
    }

    // Fallback to first item
    return group.items[0];
  };

  const handleSwapFood = (
    mealTime: MealTime,
    groupKey: FoodGroupKey,
    newFood: FoodItem,
  ) => {
    setMealAssignment(mealTime, groupKey, newFood.nameEn);
    setOpenDialog(null); // Close dialog after selection
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <span className="stat-label text-primary">Meal Planner</span>
          <div className="flex items-center mt-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Food Exchange System
            </h1>
            <InfoTooltip
              content="A clinical meal planning system where foods are grouped by similar nutritional value. Swap freely within groups while hitting your targets."
              className="ml-2"
              ariaLabel="More information about the food exchange system"
            />
          </div>
          <p className="text-muted-foreground mt-2">
            Daily target:{" "}
            <span className="font-semibold text-foreground">
              {Math.round(profile.calorieTarget)} kcal
            </span>{" "}
            • Personalized for {profile.name}
          </p>
        </div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-colors"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </Link>
      </header>

      {/* Exchange Units Overview */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="stat-label">Your Daily Exchanges</span>
          <InfoTooltip
            content="These are your personalized food exchange units calculated based on your calorie target. Each exchange provides roughly the same calories within its group."
            ariaLabel="More information about daily food exchanges"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(Object.keys(FOOD_GROUPS) as FoodGroupKey[]).map((groupKey) => {
            const group = FOOD_GROUPS[groupKey];
            const colors = FOOD_GROUP_COLORS[groupKey];
            const units = exchangeUnits[groupKey] || 0;

            return (
              <div
                key={groupKey}
                className={cn(
                  "shrink-0 px-4 py-3 rounded-2xl border cursor-help",
                  colors.bg,
                  colors.border,
                )}
                title={FOOD_GROUP_DESCRIPTIONS[groupKey]}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {FOOD_GROUP_EMOJIS[groupKey]}
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {group.nameEn}
                    </p>
                    <p className={cn("text-xl font-black", colors.text)}>
                      {units === 999 ? "∞" : units}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Meal Tabs */}
      <section>
        <div
          role="tablist"
          aria-label="Meal times"
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {MEAL_TIMES.map((meal) => {
            const mealInfo = MEAL_LABELS[meal];
            const isActive = activeMeal === meal;
            return (
              <button
                key={meal}
                id={`meal-tab-${meal}`}
                type="button"
                role="tab"
                aria-controls={`meal-panel-${meal}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveMeal(meal)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary",
                )}
              >
                <span>{mealInfo.emoji}</span>
                <span>{mealInfo.label}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`meal-panel-${activeMeal}`}
          aria-labelledby={`meal-tab-${activeMeal}`}
        >
          {/* Active Meal Info */}
          <div className="mb-6 p-4 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">
                  {MEAL_LABELS[activeMeal].emoji} {MEAL_LABELS[activeMeal].label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {MEAL_LABELS[activeMeal].time}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Tap any food to swap with alternatives
              </p>
            </div>
          </div>

          {/* Food Groups Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(FOOD_GROUPS) as FoodGroupKey[]).map((groupKey) => {
              const group = FOOD_GROUPS[groupKey];
              const colors = FOOD_GROUP_COLORS[groupKey];
              const units = exchangeUnits[groupKey] || 0;
              const selectedItem = getSelectedFood(activeMeal, groupKey);
              const isUserSelected = !!mealAssignments[activeMeal]?.[groupKey];

              if (units === 0) return null;

              return (
                <Dialog
                  key={groupKey}
                  open={openDialog === groupKey}
                  onOpenChange={(open) => setOpenDialog(open ? groupKey : null)}
                >
                  <div className="organic-card p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl",
                            colors.bg,
                          )}
                        >
                          {FOOD_GROUP_EMOJIS[groupKey]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold">{group.nameEn}</p>
                            {!isUserSelected && (
                              <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                Suggested
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {units === 999
                              ? "Unlimited"
                              : `${units} unit${units > 1 ? "s" : ""}`}
                          </p>
                        </div>
                      </div>

                      <DialogTrigger asChild>
                        <button
                          className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
                          aria-label={`Swap ${group.nameEn}`}
                          title="Swap with another food"
                        >
                          <svg
                            className="w-5 h-5 text-muted-foreground"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M16 3l5 5-5 5M8 21l-5-5 5-5M21 8H3M3 16h18" />
                          </svg>
                        </button>
                      </DialogTrigger>
                    </div>

                    {selectedItem && (
                      <DialogTrigger asChild>
                        <button
                          className={cn(
                            "w-full p-4 rounded-xl border text-left hover:ring-2 hover:ring-primary/20 transition-all",
                            colors.bg,
                            colors.border,
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">
                                {selectedItem.nameEn}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {selectedItem.nameAr}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={cn("text-lg font-bold", colors.text)}>
                                {units === 999
                                  ? selectedItem.calories
                                  : selectedItem.calories * units}{" "}
                                kcal
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {selectedItem.portion}
                                {units !== 999 && ` × ${units}`}
                              </p>
                            </div>
                          </div>
                        </button>
                      </DialogTrigger>
                    )}
                  </div>

                  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <span className="text-2xl">
                          {FOOD_GROUP_EMOJIS[groupKey]}
                        </span>
                        Swap {group.nameEn}
                      </DialogTitle>
                      <DialogDescription>
                        All items in this group have similar calories (~
                        {group.calories} kcal per serving). Choose any
                        alternative.
                      </DialogDescription>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground mb-4 sr-only">
                      All items in this group have similar calories (~
                      {group.calories} kcal per serving). Choose any
                      alternative.
                    </p>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <button
                          key={item.nameEn}
                          onClick={() =>
                            handleSwapFood(activeMeal, groupKey, item)
                          }
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                            selectedItem?.nameEn === item.nameEn
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-secondary/50",
                          )}
                        >
                          <div>
                            <p className="font-semibold">{item.nameEn}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.nameAr}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              {item.calories} kcal
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.portion}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="mt-8 organic-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-blue-600 dark:text-blue-400 mb-1">
              About Exchanges
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Foods in the same group share similar nutritional values. Swap
              freely within groups to add variety while hitting your targets.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export { MealPlannerContent };
