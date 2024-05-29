import { createNewFeedPost } from "@/api/feed/feed.api";
import { UserDTO } from "@/api/user/user.dto"
import { BaseSyntheticEvent, useEffect, useState } from "react";

const NewPost = (props: {
  user: UserDTO,
  on_create?: Function
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
    if (typeof (document) === undefined || typeof (window) === undefined) {
      return;
    }

    e.preventDefault();
    const response = await createNewFeedPost(title, description, files);
    if (response) {
      const title_input: HTMLInputElement = document.getElementById("new_post_title_input") as HTMLInputElement;
      if (title_input !== null) {
        title_input.value = "";
      }
      const desc_input: HTMLInputElement = document.getElementById("new_post_desc_input") as HTMLInputElement;
      if (desc_input !== null) {
        desc_input.value = "";
      }

      setTitle("");
      setDescription("");
      setFiles([]);
      setShowExpanded(false);

      if (props.on_create !== undefined) {
        props.on_create(response);
      }
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
            <textarea id="new_post_desc_input" style={{ "width": "auto" }} placeholder="Description" onChange={(e: BaseSyntheticEvent) => setDescription(e.target.value)} />
            <span>Files</span>
            <input type="file" />
            <section style={{"display": "flex", "gap": "1rem"}}>
              <input className="impact" type="submit" value="Post" onClick={create} />
              <button className="impact danger" onClick={() => setShowExpanded(false)}>Cancel</button>
            </section>
          </>
        )}
      </div>
    </>
  )
}

export default NewPost;