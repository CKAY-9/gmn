"use client";

import { UserDTO } from "@/api/user/user.dto";
import style from "../feed/feed.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getExplorePosts, getFeedPosts } from "@/api/feed/feed.api";
import { PostDTO } from "@/api/feed/feed.dto";
import NewPost from "../feed/new-post";
import FeedPost from "../feed/feed-post";
import LoadingWheel from "../loading/loading";

const Explore = (props: { user: UserDTO | null; hide_new?: boolean }) => {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [initial_load, setInitialLoad] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const explore_posts = await getExplorePosts();
      setPosts(explore_posts);
      setInitialLoad(false);
      setLoading(false);
    })();
  }, []);

  if (initial_load) {
    return (
      <>
        <LoadingWheel size_in_rems={5} />
      </>
    );
  }

  return (
    <>
      <div className={style.feed}>
        {posts.length <= 0 ? (
          <>
            <div className="subject">
              <h1>Explore</h1>
              <span>
                We were unable to find anything for you. You can find users and
                communities to follow on our{" "}
                <Link href="/explore">Explore page</Link>.
              </span>
            </div>
            {props.hide_new === undefined && props.user !== null && (
              <NewPost
                user={props.user}
                on_create={(new_post: PostDTO) => {
                  setPosts((old) => [new_post, ...old]);
                }}
              />
            )}
          </>
        ) : (
          <>
            {props.hide_new === undefined && props.user !== null && (
              <NewPost
                user={props.user}
                on_create={(new_post: PostDTO) => {
                  setPosts((old) => [new_post, ...old]);
                }}
              />
            )}
            <div className={style.posts}>
              {posts.map((post, index) => {
                return <FeedPost post={post} user={props.user} key={index} />;
              })}
            </div>
            {loading && <></>}
          </>
        )}
      </div>
    </>
  );
};

export default Explore;
