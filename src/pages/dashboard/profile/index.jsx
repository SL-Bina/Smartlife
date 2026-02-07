import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfileMessages } from "./hooks";

import ProfilePage from "./components/ProfilePage";

const Profile = () => {


  return (
    <>
      <ProfilePage />
    </>

  );
};

export default Profile;