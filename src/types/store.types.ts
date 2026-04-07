/**
 * Store Types
 * Types for Zustand state management
 */

import type { UserProfile, SimpleMacros } from "./user.types";
import type { FoodGroupId } from "./food.types";

export type MealTime = "breakfast" | "lunch" | "dinner" | "snacks";

export type MealAssignments = Record<MealTime, Record<FoodGroupId, string>>;

export interface UserState {
  profile: UserProfile | null;
  mealAssignments: MealAssignments;
  waterIntake: number;
}

export interface UserActions {
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateCalorieTarget: (calories: number, macros: SimpleMacros) => void;
  setMealAssignment: (meal: MealTime, group: FoodGroupId, food: string) => void;
  updateWaterIntake: (amount: number) => void;
  clearData: () => void;
  initializeFromCookie: (profile: UserProfile | null) => void;
}

export type UserStore = UserState & UserActions;
