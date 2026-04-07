/**
 * Food Exchange System Types
 * Types for the clinical food exchange system
 */

export type FoodGroupId =
  | "starch"
  | "protein"
  | "fruit"
  | "vegetable"
  | "milk"
  | "fat"
  | "free";

export interface FoodItem {
  nameEn: string;
  nameAr: string;
  portion: string;
  calories: number;
}

export interface FoodGroupData {
  nameEn: string;
  nameAr: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  items: FoodItem[];
}

export type ExchangeDataMap = Record<FoodGroupId, FoodGroupData>;
