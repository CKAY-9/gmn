import { getFeedPostsFromID } from "@/api/feed/feed.api";
import { getUserFromToken } from "@/api/user/user.api";
import NavMenu from "@/components/nav-menu/nav-menu";
import { getStoredToken } from "@/utils/token";
import { Metadata } from "next";
import FeedPostClient from "./client";

export const generateMetadata = async ({params}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  const id = Number.parseInt(params.id);
  const post = await getFeedPostsFromID(id);
  if (post === null) {
    return {
      title: `Invalid Post - GMN`,
      description: "Failed to get post from ID"
    }
  }
  
  return {
    title: `${post.title} - GMN`,
    description: `${post.description.substring(0, 100)}`
  }
}

const FeedPostPage = async ({params}: {
  params: {
    id: string
  }
}) => {
  const id = Number.parseInt(params.id);
  const post = await getFeedPostsFromID(id);
  const user = await getUserFromToken(getStoredToken());

  if (post === null) {
    return (
      <main className="app_container">
        <NavMenu user={user} />
        <div className="content">
          <div className="subject">
            <h1>Error</h1>
            <span>Sorry, we were unable to find the post with the ID {id}.</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="app_container">
        <NavMenu user={user} />
        <div className="content" style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
          <FeedPostClient user={user} post={post} />
        </div>
      </main>
    </>
  );
}

export default FeedPostPage;