"use client"

import { UserDTO } from "@/api/user/user.dto"
import style from "./header.module.scss";
import Image from "next/image";
import EditButton from "../edit-button/edit-button";
import { BaseSyntheticEvent, useState } from "react";
import { updateUserFromID } from "@/api/user/user.api";
import Logout from "../logout-button/logout";
import Follow from "../follow-button/follow-button";
import FollowList from "../follow-list/follow-list";

const ProfileHeader = (props: {
  profile: UserDTO,
  user: UserDTO | null
}) => {
  const [edit_mode, setEditMode] = useState<boolean>(false);
  const [bio, setBio] = useState<string>(props.profile.bio || "No bio provided.");
  const [show_followers, setShowFollowers] = useState<boolean>(false);
  const [show_following, setShowFollowing] = useState<boolean>(false);
  const is_self = props.profile.id === props.user?.id;

  const toggleEditMode = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (edit_mode && props.user !== null) {
      // save changes
      const u = await updateUserFromID(props.user.id, bio);
    }
    setEditMode(!edit_mode);
  }

  return (
    <div className={style.header}>
      {show_followers && (
        <>
          <FollowList close={() => setShowFollowers(false)} user_ids={props.profile.followers} title="Followers" />
        </>
      )}
      {show_following && (
        <>
          <FollowList close={() => setShowFollowing(false)} user_ids={props.profile.following} title="Following" />
        </>
      )}
      <section className={style.splash}>
        <Image
          src={props.profile.avatar}
          alt="Avatar"
          sizes="100%"
          width={0}
          height={0}
          className={style.avatar}
        />
        <h2 className={style.username}>{props.profile.username}</h2>
      </section>
      <section>
        <div style={{"display": "flex", "gap": "0.5rem"}}>
          <button className="hidden" onClick={() => setShowFollowers(!show_followers)}>
            <span><span style={{"fontWeight": "800"}}>{props.profile.followers.length}</span> Followers</span>
          </button>
          <button className="hidden" onClick={() => setShowFollowing(!show_following)}>
            <span><span style={{"fontWeight": "800"}}>{props.profile.following.length}</span> Following</span>
          </button>
        </div>
        {edit_mode ? (
          <>
            <textarea onChange={(e: BaseSyntheticEvent) => setBio(e.target.value)} placeholder="User Bio" defaultValue={bio} cols={50} rows={5}></textarea>
          </>
        ) : (
          <>
            <p>{bio}</p>
          </>
        )}
      </section>
      {!is_self ? (
        <section>
          <Follow user={props.user} profile={props.profile} />
        </section>
      ) : (
        <section>
          <Logout />
        </section>
      )}
      {is_self &&
        <div className={style.edit}>
          <EditButton on_click={toggleEditMode} />
        </div>
      }
    </div>
  );
}

export default ProfileHeader;