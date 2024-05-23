"use client"

import { UserDTO } from "@/api/user/user.dto"

const Goals = (props: {
  user: UserDTO
}) => {
  return (
    <>
      <h2>Goals</h2>
      <span>GMN is dedicated to making sure you stay consistent in your goals, so we have made setting and maintaining goals as easy as possible!</span>
    </>
  );
}

export default Goals;