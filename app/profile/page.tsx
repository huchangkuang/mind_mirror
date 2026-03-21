import { redirect } from "next/navigation";
import { getAuthUserFromCookie } from "@/lib/auth/session";
import { ProfilePageClient } from "./ProfilePageClient";

const PROFILE_PATH = "/profile";

export default async function ProfilePage() {
  const user = await getAuthUserFromCookie();
  if (!user) {
    redirect(`/auth?next=${encodeURIComponent(PROFILE_PATH)}&mode=login`);
  }
  return <ProfilePageClient initialUser={user} />;
}
