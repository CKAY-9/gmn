"use client"

import { UserDTO } from "@/api/user/user.dto";
import style from "./feed.module.scss";
import Link from "next/link";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { createNewFeedPost, getFeedPosts } from "@/api/feed/feed.api";
import { PostDTO } from "@/api/feed/feed.dto";

const NewPost = (props: {
  user: UserDTO | null
}) => {
  const [show_expanded, setShowExpanded] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (typeof (document) === undefined || typeof (window) === undefined) {
      return;
    }

    const title_input = document.getElementById("new_post_title_input");
    if (title_input !== null) {
      title_input.onclick = () => {
        setShowExpanded(true);
      }
    }
  }, []);

  const create = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const response = await createNewFeedPost(title, description, files);
    if (response) {
      // created post
    }
  }

  return (
    <>
      <div className="subject">
        {show_expanded && (
          <>
            <h2>Post to your feed</h2>
          </>
        )}
        <input type="text" id="new_post_title_input" placeholder="Create a new post" style={{ "width": "auto" }} onChange={(e: BaseSyntheticEvent) => setTitle(e.target.value)} />
        {show_expanded && (
          <>
            <textarea style={{ "width": "auto" }} placeholder="Description" onChange={(e: BaseSyntheticEvent) => setDescription(e.target.value)} />
            <span>Files</span>
            <input type="file" />
            <section style={{"display": "flex", "gap": "1rem"}}>
              <input type="submit" value="Post" onClick={create} />
              <button onClick={() => setShowExpanded(false)}>Cancel</button>
            </section>
          </>
        )}
      </div>
    </>
  )
}

const FeedPost = (props: {
  post: PostDTO,
  user: UserDTO | null
}) => {
  return (
    <>
    </>
  );
}

const Feed = (props: {
  user: UserDTO | null
}) => {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [initial_load, setInitialLoad] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  if (props.user === null) {
    return (
      <div className="subject">
        <h1>Error</h1>
        <span>Sorry, you have to be logged in to view the feed page. You can login by clicking <Link href="/login">here</Link>.</span>
      </div>
    )
  }

  useEffect(() => {
    (async () => {
      const feed_posts = await getFeedPosts();
      setPosts(feed_posts);
      if (initial_load) {
        setInitialLoad(false);
      }
    })();
  }, [])

  if (initial_load) {
    return (
      <>
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
            {posts.map((post, index) => {
              return (<FeedPost post={post} user={props.user} key={index}></FeedPost>);
            })}
            {loading && (
              <>
              </>
            )}
          </>
        )}
        <NewPost user={props.user} />
      </div>
    </>
  );
}

export default Feed;