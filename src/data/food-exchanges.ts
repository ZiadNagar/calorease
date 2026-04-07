/**
 * Food Exchange System Database
 * Clinical nutritional formulas for exchange-based meal planning
 */

import type { FoodGroupId } from "@/types";

export type FoodGroupKey = FoodGroupId;

export interface FoodItem {
  nameEn: string;
  nameAr: string;
  portion: string;
  calories: number;
}

export interface FoodGroupWithItems {
  nameEn: string;
  nameAr: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  items: FoodItem[];
}

export const FOOD_GROUPS: Record<FoodGroupKey, FoodGroupWithItems> = {
  starch: {
    nameEn: "Starches",
    nameAr: "النشويات",
    calories: 80,
    carbs: 15,
    protein: 3,
    fat: 1,
    items: [
      {
        nameEn: "Rice (cooked)",
        nameAr: "أرز (مطبوخ)",
        portion: "1/3 cup",
        calories: 80,
      },
      { nameEn: "Toast", nameAr: "توست", portion: "1 slice", calories: 80 },
      {
        nameEn: "Samoli bread",
        nameAr: "صامولي",
        portion: "1/4 piece",
        calories: 80,
      },
      {
        nameEn: "Arabic bread (large)",
        nameAr: "خبز عربي (كبير)",
        portion: "1/4 piece",
        calories: 80,
      },
      { nameEn: "Popcorn", nameAr: "فشار", portion: "3 cups", calories: 80 },
      {
        nameEn: "Cooked Pasta",
        nameAr: "مكرونة مطبوخة",
        portion: "1/2 cup",
        calories: 80,
      },
      {
        nameEn: "Potato",
        nameAr: "بطاطس",
        portion: "1/2 medium",
        calories: 80,
      },
      { nameEn: "Oatmeal", nameAr: "شوفان", portion: "1/2 cup", calories: 80 },
      { nameEn: "Corn", nameAr: "ذرة", portion: "1/2 cup", calories: 80 },
    ],
  },
  protein: {
    nameEn: "Proteins",
    nameAr: "البروتينات",
    calories: 75,
    carbs: 0,
    protein: 7,
    fat: 5,
    items: [
      { nameEn: "Chicken", nameAr: "دجاج", portion: "30g", calories: 75 },
      { nameEn: "Fish", nameAr: "سمك", portion: "30g", calories: 75 },
      { nameEn: "Meat", nameAr: "لحم", portion: "30g", calories: 75 },
      { nameEn: "Egg", nameAr: "بيضة", portion: "1 whole", calories: 75 },
      {
        nameEn: "Cheese (low fat)",
        nameAr: "جبنة (قليلة الدسم)",
        portion: "30g",
        calories: 75,
      },
      { nameEn: "Tuna", nameAr: "تونة", portion: "30g", calories: 75 },
      { nameEn: "Shrimp", nameAr: "روبيان", portion: "30g", calories: 75 },
      {
        nameEn: "Cottage Cheese",
        nameAr: "جبنة قريش",
        portion: "1/4 cup",
        calories: 75,
      },
    ],
  },
  fruit: {
    nameEn: "Fruits",
    nameAr: "الفواكه",
    calories: 60,
    carbs: 15,
    protein: 0,
    fat: 0,
    items: [
      { nameEn: "Apple", nameAr: "تفاح", portion: "1 small", calories: 60 },
      { nameEn: "Dates", nameAr: "تمر", portion: "3 pieces", calories: 60 },
      { nameEn: "Banana", nameAr: "موز", portion: "1/2 medium", calories: 60 },
      { nameEn: "Orange", nameAr: "برتقال", portion: "1 medium", calories: 60 },
      { nameEn: "Grapes", nameAr: "عنب", portion: "15 pieces", calories: 60 },
      { nameEn: "Watermelon", nameAr: "بطيخ", portion: "1 cup", calories: 60 },
      { nameEn: "Mango", nameAr: "مانجو", portion: "1/2 small", calories: 60 },
    ],
  },
  vegetable: {
    nameEn: "Vegetables",
    nameAr: "الخضروات",
    calories: 25,
    carbs: 5,
    protein: 2,
    fat: 0,
    items: [
      {
        nameEn: "Raw Leafy Vegetables",
        nameAr: "خضروات ورقية خام",
        portion: "1 cup",
        calories: 25,
      },
      {
        nameEn: "Cooked Vegetables",
        nameAr: "خضروات مطبوخة",
        portion: "1/2 cup",
        calories: 25,
      },
      { nameEn: "Tomato", nameAr: "طماطم", portion: "1 medium", calories: 25 },
      { nameEn: "Cucumber", nameAr: "خيار", portion: "1 medium", calories: 25 },
      { nameEn: "Carrot", nameAr: "جزر", portion: "1 medium", calories: 25 },
      {
        nameEn: "Bell Pepper",
        nameAr: "فلفل رومي",
        portion: "1 medium",
        calories: 25,
      },
      {
        nameEn: "Broccoli",
        nameAr: "بروكلي",
        portion: "1/2 cup",
        calories: 25,
      },
    ],
  },
  milk: {
    nameEn: "Milk",
    nameAr: "الحليب",
    calories: 120,
    carbs: 12,
    protein: 8,
    fat: 5,
    items: [
      { nameEn: "Milk", nameAr: "حليب", portion: "1 cup", calories: 120 },
      { nameEn: "Yogurt", nameAr: "زبادي", portion: "1 cup", calories: 120 },
      {
        nameEn: "Powdered Milk",
        nameAr: "حليب بودرة",
        portion: "1/3 cup",
        calories: 120,
      },
      {
        nameEn: "Greek Yogurt",
        nameAr: "زبادي يوناني",
        portion: "3/4 cup",
        calories: 120,
      },
    ],
  },
  fat: {
    nameEn: "Fats",
    nameAr: "الدهون",
    calories: 45,
    carbs: 0,
    protein: 0,
    fat: 5,
    items: [
      { nameEn: "Oil", nameAr: "زيت", portion: "1 tsp", calories: 45 },
      { nameEn: "Butter", nameAr: "زبدة", portion: "1 tsp", calories: 45 },
      {
        nameEn: "Olive Oil",
        nameAr: "زيت زيتون",
        portion: "1 tsp",
        calories: 45,
      },
      { nameEn: "Olives", nameAr: "زيتون", portion: "6 pieces", calories: 45 },
      {
        nameEn: "Avocado",
        nameAr: "أفوكادو",
        portion: "1/8 whole",
        calories: 45,
      },
      { nameEn: "Nuts", nameAr: "مكسرات", portion: "6 pieces", calories: 45 },
      { nameEn: "Tahini", nameAr: "طحينة", portion: "1 tsp", calories: 45 },
    ],
  },
  free: {
    nameEn: "Free Foods",
    nameAr: "أطعمة حرة",
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    items: [
      { nameEn: "Water", nameAr: "ماء", portion: "Unlimited", calories: 0 },
      {
        nameEn: "Black Coffee",
        nameAr: "قهوة سوداء",
        portion: "Unlimited",
        calories: 0,
      },
      {
        nameEn: "Green Tea",
        nameAr: "شاي أخضر",
        portion: "Unlimited",
        calories: 0,
      },
      { nameEn: "Lemon", nameAr: "ليمون", portion: "Unlimited", calories: 0 },
      {
        nameEn: "Herbs & Spices",
        nameAr: "أعشاب وبهارات",
        portion: "Unlimited",
        calories: 0,
      },
      { nameEn: "Vinegar", nameAr: "خل", portion: "Unlimited", calories: 0 },
    ],
  },
};
