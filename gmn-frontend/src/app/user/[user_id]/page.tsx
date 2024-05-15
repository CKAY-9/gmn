import { getUserFromID, getUserFromToken } from "@/api/user/user.api";
import NavMenu from "@/components/nav-menu/nav-menu";
import { getStoredToken } from "@/utils/token";
import UserClient from "./client";
import { Metadata } from "next";

export const generateMetadata = async ({params}: {
  params: {
    user_id: string
  }
}): Promise<Metadata> => {
  const profile_id = Number.parseInt(params.user_id);
  const profile = await getUserFromID(profile_id);

  if (profile === null) {
    return {
      title: "Invalid Profile - GMN",
      description: "Failed to get the user with the specified ID."
    };
  }

  return {
    title: `${profile.username}'s Profile - GMN`,
    description: `View ${profile.username}'s profile on GMN. See their personal records, workouts, and more!`
  };
}

const UserPage = async ({params}: {
  params: {
    user_id: string
  }
}) => {
  const profile_id = Number.parseInt(params.user_id);
  const profile = await getUserFromID(profile_id);
  const user = await getUserFromToken(getStoredToken());

  return (
    <>
      <main className="app_container">
        <NavMenu user={user} />
        <div className="content">
          {profile === null ? (
            <>
              <h1>Error</h1>
              <span>Sorry, we were unable to find the user with the ID {profile_id}.</span>
            </>
          ) : (
            <>
              <UserClient user={user} profile={profile} />
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default UserPage;