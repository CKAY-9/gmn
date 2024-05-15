import { getUserFromToken } from "@/api/user/user.api";
import NavMenu from "@/components/nav-menu/nav-menu";
import { getStoredToken } from "@/utils/token";
import { Metadata } from "next";
import style from "./index.module.scss";

export const generateMetadata = (): Metadata => {
  return {
    title: "Home - GMN"
  };
}

const IndexPage = async () => {
  const user = await getUserFromToken(getStoredToken());
  
  return (
    <>
      <main className="app_container">
        <NavMenu user={user} />
        <div className="content">
          {user === null ? (
            <>
              <h1>Welcome to GMN</h1>
              <p>
                GMN is an online platform for people into fitness and health. We aim to provide a safe, educational, and fun platform for
                people to share their progress, workouts, thoughts, and more. GMN also provides personal tools and benefits such as a calorie
                tracker, workout goals, and other things to keep you on your fitness journey.
              </p>

              <h1>Features</h1>
              <section className={style.features}>
                <div className={style.feature}>
                  <h2 className={style.title}>Trackers</h2>
                  <span>GMN offers easy-to-use trackers for workouts, calories, other nutrients, and more.</span>
                </div>
                <div className={style.feature}>
                  <h2 className={style.title}>Feed</h2>
                  <span>GMN connects you with people also on their fitness journey, allowing for education and growth.</span>
                </div>
              </section>
            </>
          ) : (
            <>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default IndexPage;