"use client"

import { PostDTO } from "@/api/feed/feed.dto";
import { UserDTO } from "@/api/user/user.dto";
import style from "./feed.module.scss";
import UserChip from "../user-chip/user-chip";
import { useEffect, useState } from "react";
import { getUserFromID } from "@/api/user/user.api";
import Link from "next/link";

const FeedPost = (props: {
  post: PostDTO,
  user: UserDTO | null
}) => {
  const [creator, setCreator] = useState<UserDTO | null>(null);

  useEffect(() => {
    (async () => {
      const c = await getUserFromID(props.post.user_id);
      setCreator(c);
    })();
  }, [props.post.user_id]);

  return (
    <div className={style.post}>
      <section>
        <h2>{props.post.title}</h2>
        <span>{props.post.description}</span>
      </section>
      <section>
        {creator !== null && (
          <Link href={`/user/${props.post.user_id}`}>
            <UserChip user={creator} />
          </Link>
        )}
      </section>
    </div>
  );
}

export default FeedPost;