/**
 * Metabolic Definitions & Tooltips
 * Educational content for health metrics
 */

export const METRIC_DEFINITIONS = {
  bmr: {
    label: "BMR",
    fullName: "Basal Metabolic Rate",
    description:
      "The number of calories your body burns at complete rest to maintain vital functions like breathing, circulation, and cell production. This is your minimum daily energy requirement.",
  },
  tdee: {
    label: "TDEE",
    fullName: "Total Daily Energy Expenditure",
    description:
      "Your total calories burned per day including all physical activities. Calculated by multiplying your BMR by an activity factor based on your lifestyle.",
  },
  bmi: {
    label: "BMI",
    fullName: "Body Mass Index",
    description:
      "A measure of body fat based on weight relative to height. While useful for general health assessment, it doesn't account for muscle mass or body composition.",
  },
  calorieTarget: {
    label: "Daily Target",
    fullName: "Daily Calorie Target",
    description:
      "Your recommended daily calorie intake adjusted for your specific goal. This accounts for your TDEE plus any surplus or deficit needed to reach your target weight.",
  },
  macros: {
    label: "Macros",
    fullName: "Macronutrients",
    description:
      "The three main nutrients that provide energy: Protein (builds muscle, 4 cal/g), Carbohydrates (primary fuel, 4 cal/g), and Fat (hormone function, 9 cal/g).",
  },
  protein: {
    label: "Protein",
    fullName: "Protein Intake",
    description:
      "Essential for muscle repair and growth. Each gram provides 4 calories. Higher protein intake helps preserve muscle mass during weight loss.",
  },
  carbs: {
    label: "Carbs",
    fullName: "Carbohydrates",
    description:
      "Your body's preferred energy source. Each gram provides 4 calories. Choose complex carbs like whole grains for sustained energy.",
  },
  fat: {
    label: "Fat",
    fullName: "Dietary Fat",
    description:
      "Essential for hormone production and nutrient absorption. Each gram provides 9 calories. Focus on healthy fats from nuts, fish, and olive oil.",
  },
  exchangeUnits: {
    label: "Exchange Units",
    fullName: "Food Exchange System",
    description:
      "A clinical meal planning system where foods are grouped by similar nutritional value. One unit from each group provides roughly the same calories and nutrients.",
  },
  activityLevel: {
    label: "Activity",
    fullName: "Activity Level",
    description:
      "Your daily physical activity multiplier used to calculate TDEE. Ranges from Sedentary (desk job, no exercise) to Elite (professional athlete training).",
  },
} as const;

export type MetricKey = keyof typeof METRIC_DEFINITIONS;

/**
 * Activity Level Descriptions
 */
export const ACTIVITY_DESCRIPTIONS: Record<string, string> = {
  sedentary:
    "Little to no exercise, desk job. You spend most of your day sitting.",
  light:
    "Light exercise 1-3 days per week. Regular walking or light activities.",
  moderate:
    "Moderate exercise 3-5 days per week. Regular gym sessions or sports.",
  active:
    "Hard exercise 6-7 days per week. Intensive training or physical job.",
  elite: "Professional athlete or very heavy physical training twice daily.",
};

/**
 * Goal Descriptions
 */
export const GOAL_DESCRIPTIONS: Record<string, string> = {
  aggressive_cut:
    "Maximum fat loss with ~750 calorie deficit. For rapid results, best short-term.",
  lose_fat:
    "Sustainable fat loss with ~500 calorie deficit. Recommended for most people.",
  maintain:
    "Maintain current weight. Perfect for body recomposition with strength training.",
  lean_bulk:
    "Slow muscle gain with ~250 calorie surplus. Minimal fat gain, steady progress.",
  build_muscle:
    "Maximum muscle gain with ~500 calorie surplus. Faster gains, some fat gain expected.",
};

/**
 * Food Group Descriptions
 */
export const FOOD_GROUP_DESCRIPTIONS: Record<string, string> = {
  starch:
    "Complex carbohydrates that provide sustained energy. ~80 calories per exchange (15g carbs, 3g protein).",
  protein:
    "Lean proteins for muscle building and repair. ~75 calories per exchange (7g protein, 5g fat).",
  fruit:
    "Natural sugars and vitamins. ~60 calories per exchange (15g carbs). Best consumed whole.",
  vegetable:
    "Nutrient-dense, low-calorie foods. ~25 calories per exchange. Eat freely for fiber and vitamins.",
  milk: "Calcium and protein source. ~90-150 calories per exchange depending on fat content.",
  fat: "Essential fatty acids for hormone function. ~45 calories per exchange (5g fat). Use sparingly.",
  free: "Very low calorie foods and beverages. Enjoy freely without counting toward daily totals.",
};
