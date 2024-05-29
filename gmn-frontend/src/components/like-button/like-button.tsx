"use client"

import Image from "next/image";
import style from "./like.module.scss";
import { PostDTO } from "@/api/feed/feed.dto";
import { BaseSyntheticEvent, useState } from "react";
import { UserDTO } from "@/api/user/user.dto";
import { likeFeedPostFromID } from "@/api/feed/feed.api";

const LikeButton = (props: {
  post: PostDTO,
  user: UserDTO | null
}) => {
  const [likes, setLikes] = useState<number[]>(props.post.likes || []);
  const [liked, setLiked] = useState<boolean>(likes.includes(props.user?.id || 0));

  const toggleLike = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const like = await likeFeedPostFromID(props.post.id);
    if (like !== null) {
      setLiked(like.likes.includes(props.user?.id || 0));
      setLikes(like.likes);
    }
    setLiked(!liked);
  }

  return (
    <>
      <button onClick={toggleLike} className={`${style.like} hidden`}>
        <Image 
          src={`/icons/${liked ? "fav-filled.svg" : "fav.svg"}`}
          alt="Like"
          sizes="100%"
          width={0}
          height={0}
        />
        {likes.length}
      </button>
    </>
  );
}

export default LikeButton;