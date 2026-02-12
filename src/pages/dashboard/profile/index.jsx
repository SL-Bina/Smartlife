import React from "react";
import { useAuth } from "@/store/exports";
import { ProfileHeader, ProfileSidebar, ProfileTabs, ProfileComplexInfo, ProfileAdditionalInfo } from "./components";
import { useProfileMessages } from "./hooks";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const messages = useProfileMessages();

  return (
    <div className="h-full flex flex-col">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">
        {/* LEFT */}
        <ProfileSidebar user={user} />

        {/* RIGHT TABS */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <ProfileTabs user={user} refreshUser={refreshUser} messages={messages} />
        </div>

        {/* BOTTOM */}
        <div className="flex flex-row gap-3 w-full lg:col-span-3 flex-1 min-h-0">
          <ProfileComplexInfo user={user} />
          <ProfileAdditionalInfo user={user} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
