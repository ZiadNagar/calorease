/**
 * User Domain Types
 * Types related to user profile, goals, and activity
 */

export type Gender = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "elite";

export type Goal =
  | "aggressive_cut"
  | "lose_fat"
  | "maintain"
  | "lean_bulk"
  | "build_muscle";

export type BMIStatus = "underweight" | "optimal" | "overweight" | "obese";

export interface SimpleMacros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface ExchangeUnits {
  starch: number;
  protein: number;
  fruit: number;
  vegetable: number;
  milk: number;
  fat: number;
  free: number;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  bodyFat?: number;
  bmr: number;
  tdee: number;
  bmi: number;
  bmiStatus: BMIStatus;
  calorieTarget: number;
  macros: SimpleMacros;
  exchangeUnits: ExchangeUnits;
  mealPlan?: MealPlan;
  isManual?: boolean;
}

export interface ProfileFormData {
  name: string;
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  bodyFat?: number;
}

export interface MealPlan {
  daily_portions: {
    total_units: number;
    groups: FoodGroup[];
  };
}

export interface FoodGroup {
  id: string;
  name: LocalizedText;
  units: number;
  exchanges: FoodExchange[];
}

export interface FoodExchange {
  item: FoodItem;
  quantity: number;
}

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface FoodItem {
  nameEn: string;
  nameAr: string;
  portion: string;
  calories: number;
}

// BMI Status Display Config
export const BMI_STATUS_LABELS: Record<BMIStatus, string> = {
  underweight: "Underweight",
  optimal: "Optimal Health",
  overweight: "Weight Management",
  obese: "Protocol Focused",
};

export const BMI_STATUS_COLORS: Record<BMIStatus, string> = {
  underweight: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  optimal: "text-primary bg-primary/10 border-primary/20",
  overweight: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  obese: "text-rose-600 bg-rose-600/10 border-rose-600/30",
};
