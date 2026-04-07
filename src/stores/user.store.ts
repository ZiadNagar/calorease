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

const createEmptyMealAssignments = (): MealAssignments => ({
  breakfast: {} as Record<FoodGroupId, string>,
  lunch: {} as Record<FoodGroupId, string>,
  dinner: {} as Record<FoodGroupId, string>,
  snacks: {} as Record<FoodGroupId, string>,
});

const cloneMealAssignments = (
  mealAssignments: MealAssignments,
): MealAssignments => ({
  breakfast: { ...mealAssignments.breakfast },
  lunch: { ...mealAssignments.lunch },
  dinner: { ...mealAssignments.dinner },
  snacks: { ...mealAssignments.snacks },
});

const createInitialState = () => ({
  profile: null as UserProfile | null,
  mealAssignments: createEmptyMealAssignments(),
  waterIntake: 0,
});

const initialState = createInitialState();

const syncServerAction = (
  actionName: string,
  action: () => Promise<unknown>,
  onError?: () => void,
): void => {
  void action().catch((error) => {
    console.error(`[UserStore] ${actionName} failed`, error);
    onError?.();
  });
};

export const useUserStore = create<UserStore>()((set, get) => ({
  ...initialState,

  setProfile: (profile: UserProfile) => {
    const previousProfile = get().profile;
    set({ profile });
    syncServerAction("saveProfile", () => saveProfile(profile), () => {
      set({ profile: previousProfile });
    });
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    const currentProfile = get().profile;
    if (!currentProfile) return;

    const updatedProfile = { ...currentProfile, ...updates };
    set({ profile: updatedProfile });

    syncServerAction("updateProfile", () => saveProfile(updatedProfile), () => {
      set({ profile: currentProfile });
    });
  },

  updateCalorieTarget: (calories: number, macros: SimpleMacros) => {
    const currentProfile = get().profile;
    if (!currentProfile) return;

    const updatedProfile = {
      ...currentProfile,
      calorieTarget: calories,
      macros,
      isManual: true,
    };

    set({ profile: updatedProfile });

    syncServerAction(
      "updateCalorieTarget",
      () => saveProfile(updatedProfile),
      () => {
        set({ profile: currentProfile });
      },
    );
  },

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

  clearData: () => {
    const currentState = get();
    const previousState = {
      profile: currentState.profile,
      mealAssignments: cloneMealAssignments(currentState.mealAssignments),
      waterIntake: currentState.waterIntake,
    };

    set(createInitialState());

    syncServerAction("clearProfile", clearProfileCookie, () => {
      set(previousState);
    });
  },

  // New: Initialize store from cookie data (called on app load)
  initializeFromCookie: (profile: UserProfile | null) => {
    if (profile) {
      set({ profile });
    }
  },
}));
