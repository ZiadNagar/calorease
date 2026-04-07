# CalorEase

CalorEase is a modern nutrition planning application that combines metabolic calculations with practical meal planning.
It helps users estimate daily energy needs, generate macro targets, plan meals using a food exchange system, and track hydration in one workflow.

---

## Why CalorEase

CalorEase is designed to bridge the gap between nutrition science and day-to-day execution:

- Personalized calculations based on user profile and activity level
- Goal-based calorie and macro recommendations
- Exchange-based meal planning with flexible food swaps
- Clean dashboard for profile metrics, insights, and hydration tracking

---

## Core Features

- Guided onboarding (3-step profile setup)
- Metabolic engine for:
  - BMR (Mifflin-St Jeor, with Katch-McArdle when body fat is available)
  - TDEE (activity multiplier model)
  - Goal-adjusted calorie targets
  - Macro split recommendations (protein, carbs, fat)
  - BMI and status classification
  - Exchange unit estimation for meal planning
- Profile dashboard with:
  - Daily calorie target
  - BMR, TDEE, BMI, and macro visuals
  - Goal-aware health insights
  - Hydration tracker with progress feedback
- Meal planner with food exchange groups and swapable items
- Persistent user profile via secure server-side cookies
- SSR-first profile loading to avoid hydration mismatch
- Light and dark theme support

---

## Tech Stack

- Framework: Next.js 16 (App Router)
- UI: React 19, Tailwind CSS 4, Radix UI primitives
- Forms and validation: React Hook Form + Zod
- State management: Zustand
- Animations and charts: Framer Motion, Recharts
- Notifications: Sonner
- Language: TypeScript

---

## Typical User Flow

1. User completes onboarding profile.
2. CalorEase computes metabolic metrics and daily targets.
3. User reviews dashboard insights and macro distribution.
4. User plans meals using exchange groups and food swaps.
5. User tracks daily hydration progress.
