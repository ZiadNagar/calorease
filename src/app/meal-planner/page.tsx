import { redirect } from "next/navigation";
import { getProfile } from "@/actions";
import { MealPlannerContent } from "./MealPlannerContent";

const MealPlannerPage = async () => {
  const profile = await getProfile();

  // Redirect to onboarding if no profile exists
  if (!profile) {
    redirect("/");
  }

  return <MealPlannerContent initialProfile={profile} />;
};

export default MealPlannerPage;
