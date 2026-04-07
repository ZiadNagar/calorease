/**
 * CalorEase Type Definitions
 * Barrel export for all types
 */

// User domain types
export type {
  Gender,
  ActivityLevel,
  Goal,
  BMIStatus,
  SimpleMacros,
  ExchangeUnits,
  UserProfile,
  ProfileFormData,
  MealPlan,
  FoodGroup,
  FoodExchange,
  LocalizedText,
  FoodItem,
} from "./user.types";

export { BMI_STATUS_LABELS } from "./user.types";

// Food exchange types
export type { FoodGroupId, FoodGroupData, ExchangeDataMap } from "./food.types";

// Metabolic types
export type { MacroNutrient, Macros } from "./metabolic.types";

// Store types
export type {
  MealTime,
  MealAssignments,
  UserState,
  UserActions,
  UserStore,
} from "./store.types";
