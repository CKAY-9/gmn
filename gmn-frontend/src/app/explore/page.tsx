import { getUserFromToken } from "@/api/user/user.api";
import Explore from "@/components/explore/explore";
import NavMenu from "@/components/nav-menu/nav-menu";
import { getStoredToken } from "@/utils/token";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Explore - GMN",
    description: "Find users and communities to follow on GMN."
  }
}

const ExplorePage = async () => {
  const user = await getUserFromToken(getStoredToken());
  
  return (
    <>
      <main className="app_container">
        <NavMenu user={user} />
        <div className="content">
          <Explore user={user} />
        </div>
      </main>
    </>
  );
}

export default ExplorePage;