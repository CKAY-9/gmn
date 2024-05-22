"use client"

import { UserDTO } from "@/api/user/user.dto";
import style from "./feed.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";

const NewPost = (props: {
  user: UserDTO | null
}) => {
  const [show_expanded, setShowExpanded] = useState<boolean>(false);

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

  return (
    <>
      <div className="subject">
        {show_expanded && (
          <>
            <h2>Post to your feed</h2>
          </>
        )}
        <input type="text" id="new_post_title_input" placeholder="Create a new post" style={{ "width": "auto" }} />
        {show_expanded && (
          <>
            <textarea style={{ "width": "auto" }} placeholder="Description" />
            <span>Files</span>
            <input type="file" />
            <section style={{"display": "flex", "gap": "1rem"}}>
              <input type="submit" value="Post" />
              <button onClick={() => setShowExpanded(false)}>Cancel</button>
            </section>
          </>
        )}
      </div>
    </>
  )
}

const Feed = (props: {
  user: UserDTO | null
}) => {
  const [posts, setPosts] = useState<any[]>([]);

  if (props.user === null) {
    return (
      <div className="subject">
        <h1>Error</h1>
        <span>Sorry, you have to be logged in to view the feed page. You can login by clicking <Link href="/login">here</Link>.</span>
      </div>
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
          </>
        )}
        <NewPost user={props.user} />
      </div>
    </>
  );
}

export default Feed;