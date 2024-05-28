"use client"

import { UserDTO } from "@/api/user/user.dto";
import style from "./workouts.module.scss";
import { useState } from "react";
import { WorkoutDTO } from "@/api/workout/workout.dto";

const ProfileWorkouts = (props: {
  user: UserDTO | null,
  profile: UserDTO
}) => {
  const [workouts, setWorkouts] = useState<WorkoutDTO[]>([]);

  const is_self = props.profile.id === props.user?.id;

  return (
    <div className={style.container}>
      <h2>Recent Workouts</h2>
    </div>
  );
}

export default ProfileWorkouts;