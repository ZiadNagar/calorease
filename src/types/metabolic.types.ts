/**
 * Metabolic Calculation Types
 * Types for metabolic calculations and macros
 */

export interface MacroNutrient {
  grams: number;
  cals: number;
  percent: number;
}

export interface Macros {
  protein: MacroNutrient;
  carbs: MacroNutrient;
  fat: MacroNutrient;
}
