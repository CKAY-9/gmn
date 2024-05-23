"use client"

import { UserDTO } from "@/api/user/user.dto"
import { BaseSyntheticEvent, useState } from "react"

const Follow = (props: {
  user: UserDTO | null,
  profile: UserDTO
}) => {
  const [is_following, setIsFollowing] = useState<boolean>(props.profile.followers.includes(props.user?.id || 0));

  if (props.user === null) {
    return (
      <span>Must be logged in to follow.</span>
    );
  }

  const toggleFollow = async (e: BaseSyntheticEvent) => {

  }

  return (
    <>
      <button onClick={toggleFollow} className="impact">Follow</button>
    </>
  );
}

export default Follow;