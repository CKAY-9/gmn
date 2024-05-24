"use client"

import { PostDTO } from "@/api/feed/feed.dto";
import { UserDTO } from "@/api/user/user.dto";
import style from "./feed.module.scss";

const FeedPost = (props: {
  post: PostDTO,
  user: UserDTO | null
}) => {
  return (
    <div className={style.post}>
      <h1>{props.post.title}</h1>
    </div>
  );
}

export default FeedPost;