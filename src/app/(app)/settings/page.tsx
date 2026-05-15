import SettingsClientWrapper from "@/components/features/settings/SettingsClientWrapper";
import { getProfile } from "@/lib/actions/profile";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getProfile();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-3 mx-3 md:mx-0 md:mr-3">
      <SettingsClientWrapper user={user} />
    </div>
  );
}
