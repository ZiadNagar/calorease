/**
 * Store Types
 * Types for Zustand state management
 */

import type { UserProfile, SimpleMacros } from "./user.types";
import type { FoodGroupId } from "./food.types";

export interface MealAssignments {
  breakfast: Record<FoodGroupId, string>;
  lunch: Record<FoodGroupId, string>;
  dinner: Record<FoodGroupId, string>;
  snacks: Record<FoodGroupId, string>;
  [key: string]: Record<FoodGroupId, string>;
}

export interface UserState {
  profile: UserProfile | null;
  mealAssignments: MealAssignments;
  waterIntake: number;
  dailyIntake: unknown[];
}

export interface UserActions {
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateCalorieTarget: (calories: number, macros: SimpleMacros) => void;
  setMealAssignment: (meal: string, group: FoodGroupId, food: string) => void;
  updateWaterIntake: (amount: number) => void;
  clearData: () => void;
  initializeFromCookie: (profile: UserProfile | null) => void;
}

export type UserStore = UserState & UserActions;
