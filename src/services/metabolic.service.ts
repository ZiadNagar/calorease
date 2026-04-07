/**
 * Metabolic Calculation Service
 * Core calculations for BMR, TDEE, macros, and calorie targets
 */

import type {
  Gender,
  ActivityLevel,
  Goal,
  Macros,
  UserProfile,
  ProfileFormData,
  BMIStatus,
  ExchangeUnits,
} from "@/types";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  elite: 1.9,
};

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  aggressive_cut: -750,
  lose_fat: -500,
  maintain: 0,
  lean_bulk: 250,
  build_muscle: 500,
};

const CALORIE_TARGET_MIN = 1200;
const CALORIE_TARGET_MAX = 6000;

const toFiniteNumber = (value: number, fallback = 0): number =>
  Number.isFinite(value) ? value : fallback;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const toNonNegative = (value: number): number =>
  Math.max(0, toFiniteNumber(value));

const toMacroPercent = (
  macroCalories: number,
  totalCalories: number,
): number => {
  const safeTotalCalories = toNonNegative(totalCalories);

  if (safeTotalCalories === 0) {
    return 0;
  }

  return clamp(
    Math.round((toNonNegative(macroCalories) / safeTotalCalories) * 100),
    0,
    100,
  );
};

/**
 * Calculate BMR using Mifflin-St Jeor or Katch-McArdle
 */
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  bodyFat: number | null = null,
): number => {
  if (bodyFat && bodyFat > 0) {
    const lbm = weight * (1 - bodyFat / 100);
    return 370 + 21.6 * lbm;
  }

  const bmrValue = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? bmrValue + 5 : bmrValue - 161;
};

/**
 * Calculate TDEE based on activity level
 */
export const calculateTDEE = (
  bmr: number,
  activityLevel: ActivityLevel,
): number => {
  return bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.2);
};

/**
 * Calculate calorie target based on goal
 */
export const calculateTarget = (tdee: number, goal: Goal): number => {
  const adjustedTarget = Math.round(tdee + (GOAL_ADJUSTMENTS[goal] || 0));
  return clamp(adjustedTarget, CALORIE_TARGET_MIN, CALORIE_TARGET_MAX);
};

/**
 * Calculate macronutrient distribution
 */
export const calculateMacros = (
  totalCals: number,
  goal: Goal,
  weight: number,
): Macros => {
  const safeTotalCals = toNonNegative(totalCals);
  const safeWeight = toNonNegative(weight);

  let proteinMultiplier: number;
  let fatRatio: number;

  switch (goal) {
    case "aggressive_cut":
      proteinMultiplier = 2.4;
      fatRatio = 0.2;
      break;
    case "lose_fat":
      proteinMultiplier = 2.2;
      fatRatio = 0.25;
      break;
    case "lean_bulk":
      proteinMultiplier = 2.0;
      fatRatio = 0.25;
      break;
    case "build_muscle":
      proteinMultiplier = 2.2;
      fatRatio = 0.2;
      break;
    default:
      proteinMultiplier = 1.8;
      fatRatio = 0.3;
  }

  const proteinGrams = toNonNegative(proteinMultiplier * safeWeight);
  const proteinCalories = Math.round(proteinGrams * 4);
  const maxCaloriesAfterProtein = toNonNegative(
    safeTotalCals - proteinCalories,
  );
  const targetFatCalories = toNonNegative(safeTotalCals * fatRatio);
  const fatCalories = Math.round(
    Math.min(targetFatCalories, maxCaloriesAfterProtein),
  );
  const carbCalories = Math.round(
    toNonNegative(safeTotalCals - proteinCalories - fatCalories),
  );

  const fatGrams = toNonNegative(fatCalories / 9);
  const carbGrams = toNonNegative(carbCalories / 4);

  const pCals = toNonNegative(proteinCalories);
  const cCals = toNonNegative(carbCalories);
  const fCals = toNonNegative(fatCalories);
  const actualTotal = pCals + cCals + fCals;

  return {
    protein: {
      grams: Math.round(proteinGrams),
      cals: pCals,
      percent: toMacroPercent(pCals, actualTotal),
    },
    carbs: {
      grams: Math.round(carbGrams),
      cals: cCals,
      percent: toMacroPercent(cCals, actualTotal),
    },
    fat: {
      grams: Math.round(fatGrams),
      cals: fCals,
      percent: toMacroPercent(fCals, actualTotal),
    },
  };
};

/**
 * Calculate BMI
 */
export const calculateBMI = (weight: number, height: number): number => {
  return parseFloat((weight / (height / 100) ** 2).toFixed(1));
};

/**
 * Determine BMI status category
 */
export const getBMIStatus = (bmi: number): BMIStatus => {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "optimal";
  if (bmi < 30) return "overweight";
  return "obese";
};

/**
 * Calculate food exchange units
 */
export const calculateExchangeUnits = (calories: number): ExchangeUnits => {
  const totalUnits = Math.max(0, Math.round(toNonNegative(calories) / 80));

  return {
    starch: Math.max(0, Math.round(totalUnits * 0.3)),
    protein: Math.max(0, Math.round(totalUnits * 0.25)),
    fruit: Math.max(0, Math.round(totalUnits * 0.15)),
    vegetable: Math.max(0, Math.round(totalUnits * 0.1)),
    milk: Math.max(0, Math.round(totalUnits * 0.1)),
    fat: Math.max(0, Math.round(totalUnits * 0.1)),
    free: 999,
  };
};

/**
 * Calculate complete user profile from form data
 */
export const calculateFullProfile = (data: ProfileFormData): UserProfile => {
  const bmr = Math.round(
    calculateBMR(
      data.weight,
      data.height,
      data.age,
      data.gender,
      data.bodyFat || null,
    ),
  );

  const tdee = Math.round(calculateTDEE(bmr, data.activityLevel));
  const calorieTarget = calculateTarget(tdee, data.goal);
  const macros = calculateMacros(calorieTarget, data.goal, data.weight);
  const bmi = calculateBMI(data.weight, data.height);
  const bmiStatus = getBMIStatus(bmi);
  const exchangeUnits = calculateExchangeUnits(calorieTarget);

  return {
    ...data,
    bmr,
    tdee,
    bmi,
    bmiStatus,
    calorieTarget,
    macros: {
      protein: macros.protein.grams,
      carbs: macros.carbs.grams,
      fat: macros.fat.grams,
    },
    exchangeUnits,
    isManual: false,
  };
};

/**
 * MetabolicService - Backward compatible class wrapper
 */
export class MetabolicService {
  static calculateBMR = calculateBMR;
  static calculateTDEE = calculateTDEE;
  static calculateTarget = calculateTarget;
  static calculateMacros = calculateMacros;
  static calculateBMI = calculateBMI;
  static getBMIStatus = getBMIStatus;
  static calculateExchangeUnits = calculateExchangeUnits;
  static calculateFullProfile = calculateFullProfile;
}
