"use client"

import { UserDTO } from "@/api/user/user.dto";
import style from "./feed.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFeedPosts } from "@/api/feed/feed.api";
import { PostDTO } from "@/api/feed/feed.dto";
import NewPost from "./new-post";
import FeedPost from "./feed-post";
import LoadingWheel from "../loading/loading";

const Feed = (props: {
  user: UserDTO | null,
  hide_new?: boolean
}) => {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [initial_load, setInitialLoad] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const feed_posts = await getFeedPosts();
      setPosts(feed_posts);
      setInitialLoad(false);
      setLoading(false);
    })();
  }, [])

  if (props.user === null) {
    return (
      <div className="subject">
        <h1>Error</h1>
        <span>Sorry, you have to be logged in to view the feed page. You can login by clicking <Link href="/login">here</Link>.</span>
      </div>
    )
  }

  if (initial_load) {
    return (
      <>
        <LoadingWheel size_in_rems={5} />
      </>
    )
  }

  return (
    <>
      <div className={style.feed}>
        {posts.length <= 0 ? (
          <div className="subject">
            <h1>Feed</h1>
            <span>We were unable to find anything for you. You can find users and communities to follow on our <Link href="/explore">Explore page</Link>.</span>
          </div>
        ) : (
          <>
            {!props.hide_new && <NewPost user={props.user} on_create={(new_post: PostDTO) => {
              setPosts((old) => [new_post, ...old]);
            }} />}
            <div className={style.posts}>
              {posts.map((post, index) => {
                return (<FeedPost post={post} user={props.user} key={index} />);
              })}
            </div>
            {loading && (
              <>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Feed;