import { getUserFromToken } from "@/api/user/user.api";
import NavMenu from "@/components/nav-menu/nav-menu";
import { getStoredToken } from "@/utils/token";
import { Metadata } from "next";
import Link from "next/link";
import FitnessClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    title: "Fitness - GMN",
    description: "View your fitness goals and fitness tips on GMN."
  };
}

const FitnessPage = async () => {
  const user = await getUserFromToken(getStoredToken());

  return (
    <>
      <main className="app_container">
        <NavMenu user={user} />
        <div className="content" style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
          {user === null ? (
            <div className="subject">
              <h1>Error</h1>
              <span>Sorry, you have to be logged in to view the fitness page. You can login by clicking <Link href="/login">here</Link>.</span>
            </div>
          ) : (
            <>
              <div className="subject">
                <h1>Fitness</h1>
                <span>Here you can setup fitness goals like working out consistently, calorie and other marco trackers, progress, and more.</span>
              </div>
              <FitnessClient user={user} />
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default FitnessPage;