"use client"

import { UserDTO } from "@/api/user/user.dto"
import Macros from "@/components/macros/macros"

const FitnessClient = (props: {
  user: UserDTO
}) => {
  return (
    <>
      <div className="subject">
        <Macros user={props.user} />
      </div>
    </>
  );
}

export default FitnessClient;