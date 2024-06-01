"use client"

import { PostDTO } from "@/api/feed/feed.dto"
import { getUserFromID } from "@/api/user/user.api"
import { UserDTO } from "@/api/user/user.dto"
import LoadingWheel from "@/components/loading/loading"
import UserChip from "@/components/user-chip/user-chip"
import Link from "next/link"
import { BaseSyntheticEvent, useEffect, useState } from "react"
import style from "./post.module.scss";
import LikeButton from "@/components/like-button/like-button"
import { deleteFeedPostFromID, getFeedPostsFromUserID, updateFeedPostFromID } from "@/api/feed/feed.api"
import FeedPost from "@/components/feed/feed-post"
import Feed from "@/components/feed/feed"
import EditButton from "@/components/edit-button/edit-button"
import DeleteButton from "@/components/delete-button/delete-button"

const FeedPostClient = (props: {
  user: UserDTO | null,
  post: PostDTO
}) => {
  const [loading_creator, setLoadingCreator] = useState<boolean>(true);
  const [creator, setCreator] = useState<UserDTO | null>(null);
  const [recommended, setRecommended] = useState<PostDTO[]>([]);
  const [loading_rec, setLoadingRec] = useState<boolean>(true);
  const [title, setTitle] = useState<string>(props.post.title);
  const [description, setDescription] = useState<string>(props.post.description);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const c = await getUserFromID(props.post.user_id);
      setCreator(c);
      setLoadingCreator(false);

      if (props.user === null) return;
      const r = await getFeedPostsFromUserID(props.user.id);
      setRecommended(r);
      setLoadingRec(false);
    })();
  }, [props.post.user_id]);

  const toggleEdit = async () => {
    if (edit) {
      const u = await updateFeedPostFromID(props.post.id, title, description);
    }
    setEdit(!edit);
  }
  
  const deletePost = async () => {
    if (props.user === null) return;

    const d = await deleteFeedPostFromID(props.post.id)
    if (d !== null) {
      window.location.href = `/user/${props.user.id}`; 
    }
  }

  return (
    <>
      <div className="subject">
        <div className={style.post}>
          <section className={style.splash}>
            {edit ? (
              <input type="text" name="" id="" style={{"fontSize": "2rem", "fontWeight": "700"}} defaultValue={title} onChange={(e: BaseSyntheticEvent) => setTitle(e.target.value)} />
            ) : (
              <h1>{title}</h1>
            )}
          </section>
          <section className={style.info}>
            {edit ? (
              <textarea name="" id="" rows={5} style={{"width": "100%"}} defaultValue={description} onChange={(e: BaseSyntheticEvent) => setDescription(e.target.value)} />
            ) : (
              <p>{description}</p>
            )}
            <div className={style.social}>
              {(loading_creator || creator === null) ? (
                <LoadingWheel size_in_rems={2} />
              ) : (
                <>
                  <Link href={`/user/${creator.id}`}>
                    <UserChip user={creator} />
                  </Link>
                  {creator.id === props.user?.id && (
                    <>
                      <DeleteButton on_click={deletePost} />
                      <EditButton on_click={toggleEdit} />
                    </>
                  )}
                </>
              )}
              <LikeButton post={props.post} user={props.user} />
            </div>
          </section>
        </div>
      </div>
      <div className="subject">
        <h2>Posts you may like</h2>
        {props.user === null ? (
          <span>Sorry, you have to be logged in to view the feed. You can login by clicking <Link href="/login">here</Link>.</span>
        ) : (
          <>
            {loading_rec ? (
              <LoadingWheel size_in_rems={5} />
            ) : (
              <Feed user={props.user} hide_new={true} />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default FeedPostClient;