import { getUserFromToken } from "@/api/user/user.api";
import NavMenu from "@/components/nav-menu/nav-menu";
import { getStoredToken } from "@/utils/token";
import { Metadata } from "next";
import style from "./index.module.scss";
import Goals from "@/components/goals/goals";
import Welcome from "@/components/welcome/welcome";
import RecentActivity from "@/components/recent-activity/recent-activity";

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
        <div className="content" style={{ "display": "flex", "flexDirection": "column", "gap": "1rem", "alignItems": "center" }}>
          {user === null ? (
            <>
              <div className="subject" style={{ "textAlign": "center" }}>
                <h1>Welcome to GMN</h1>
                <p>
                  GMN is an online platform for people into fitness and health. We aim to provide a safe, educational, and fun platform for
                  people to share their progress, workouts, thoughts, and more. GMN also provides personal tools and benefits such as a calorie
                  tracker, workout goals, and other things to keep you on your fitness journey.
                </p>
              </div>

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
            <div style={{ "display": "flex", "flexDirection": "column", "gap": "1rem" }}>
              <div className="subject">
                <Welcome user={user} />
              </div>
              <div className="subject">
                <Goals user={user} />
              </div>
              <div className="subject">
                <RecentActivity user={user} />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default IndexPage;