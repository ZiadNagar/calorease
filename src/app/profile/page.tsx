import { redirect } from "next/navigation";
import { getProfile } from "@/actions";
import { ProfileContent } from "./ProfileContent";

const ProfilePage = async () => {
  // Server-side profile check - no hydration issues!
  const profile = await getProfile();

  // If no profile, redirect to onboarding
  if (!profile) {
    redirect("/");
  }

  // Pass profile to client component for rendering
  return <ProfileContent initialProfile={profile} />;
};

export default ProfilePage;
