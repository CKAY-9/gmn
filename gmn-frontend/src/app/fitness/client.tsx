"use client"

import { UserDTO } from "@/api/user/user.dto"
import Exercise from "@/components/exercise/exercise"
import Goals from "@/components/goals/goals"
import Macros from "@/components/macros/macros"

const FitnessClient = (props: {
  user: UserDTO
}) => {
  return (
    <>
      <div className="subject">
        <Goals user={props.user} />
      </div>
      <div className="subject">
        <Macros user={props.user} />
      </div>
      <div className="subject">
        <Exercise user={props.user} />
      </div>
    </>
  );
}

export default FitnessClient;