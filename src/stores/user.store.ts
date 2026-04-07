"use client";

import { create } from "zustand";
import type {
  UserProfile,
  SimpleMacros,
  FoodGroupId,
  MealTime,
  MealAssignments,
  UserStore,
} from "@/types";
import {
  saveProfile,
  clearProfile as clearProfileCookie,
} from "@/actions/profile.actions";

const initialState = {
  profile: null as UserProfile | null,
  mealAssignments: {
    breakfast: {} as Record<FoodGroupId, string>,
    lunch: {} as Record<FoodGroupId, string>,
    dinner: {} as Record<FoodGroupId, string>,
    snacks: {} as Record<FoodGroupId, string>,
  } as MealAssignments,
  waterIntake: 0,
  dailyIntake: [] as unknown[],
};

const runServerAction = async (
  actionName: string,
  action: () => Promise<unknown>,
): Promise<boolean> => {
  try {
    await action();
    return true;
  } catch (error) {
    console.error(`[UserStore] ${actionName} failed`, error);
    return false;
  }
};

export const useUserStore = create<UserStore>()((set) => ({
  ...initialState,

  setProfile: async (profile: UserProfile) => {
    const success = await runServerAction("saveProfile", () =>
      saveProfile(profile),
    );

    if (success) {
      set({ profile });
    }

    return success;
  },

  updateProfile: (updates: Partial<UserProfile>) =>
    set((state) => {
      if (!state.profile) return state;
      const updatedProfile = { ...state.profile, ...updates };
      void runServerAction("updateProfile", () => saveProfile(updatedProfile));
      return { profile: updatedProfile };
    }),

  updateCalorieTarget: (calories: number, macros: SimpleMacros) =>
    set((state) => {
      if (!state.profile) return state;
      const updatedProfile = {
        ...state.profile,
        calorieTarget: calories,
        macros,
        isManual: true,
      };
      void runServerAction("updateCalorieTarget", () =>
        saveProfile(updatedProfile),
      );
      return { profile: updatedProfile };
    }),

  setMealAssignment: (meal: MealTime, group: FoodGroupId, food: string) =>
    set((state) => ({
      mealAssignments: {
        ...state.mealAssignments,
        [meal]: {
          ...state.mealAssignments[meal],
          [group]: food,
        },
      },
    })),

  updateWaterIntake: (amount: number) =>
    set((state) => ({
      waterIntake: Math.max(0, (state.waterIntake || 0) + amount),
    })),

  clearData: async () => {
    const success = await runServerAction("clearProfile", clearProfileCookie);

    if (success) {
      set(initialState);
    }

    return success;
  },

  // New: Initialize store from cookie data (called on app load)
  initializeFromCookie: (profile: UserProfile | null) => {
    if (profile) {
      set({ profile });
    }
  },
}));
