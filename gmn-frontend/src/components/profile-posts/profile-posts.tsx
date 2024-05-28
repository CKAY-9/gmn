"use client"

import { UserDTO } from "@/api/user/user.dto";
import style from "./posts.module.scss";
import { useEffect, useState } from "react";
import { PostDTO } from "@/api/feed/feed.dto";
import { getFeedPostsFromUserID } from "@/api/feed/feed.api";
import LoadingWheel from "../loading/loading";
import FeedPost from "../feed/feed-post";

const ProfilePosts = (props: {
  user: UserDTO | null,
  profile: UserDTO
}) => {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const ps = await getFeedPostsFromUserID(props.profile.id);
      setPosts(ps);
      setLoading(false);
    })();
  }, [props.profile.id])

  const is_self = props.profile.id === props.user?.id;

  return (
    <div className={style.container}>
      <h2>Recent Posts</h2>
      {loading ? (
        <LoadingWheel size_in_rems={2} />
      ) : (
        <div className={style.posts}>
          {posts.map((post, index) => {
            return (<FeedPost user={props.user} post={post} key={index} />)
          })}
        </div>
      )}
    </div>
  );
}

export default ProfilePosts;