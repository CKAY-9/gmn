"use client"

import { followUserFromID } from "@/api/user/user.api"
import { UserDTO } from "@/api/user/user.dto"
import Link from "next/link"
import { BaseSyntheticEvent, useState } from "react"

const Follow = (props: {
  user: UserDTO | null,
  profile: UserDTO
}) => {
  const [is_following, setIsFollowing] = useState<boolean>(props.profile.followers.includes(props.user?.id || 0));

  if (props.user === null) {
    return (
      <Link href="/login">Login in to follow.</Link>
    );
  }

  const toggleFollow = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const follow = await followUserFromID(props.profile.id);
    setIsFollowing(follow);
  }

  return (
    <>
      <button onClick={toggleFollow} className={`impact ${is_following ? "danger" : ""}`}>{is_following ? "Unfollow" : "Follow"}</button>
    </>
  );
}

export default Follow;