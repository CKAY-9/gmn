"use client"

import { UserDTO } from "@/api/user/user.dto";
import style from "./workouts.module.scss";
import { useEffect, useState } from "react";
import { WorkoutDTO } from "@/api/workout/workout.dto";
import { getAllWorkoutsFromUserID } from "@/api/workout/workout.api";
import LoadingWheel from "../loading/loading";
import WorkoutPreview from "../workouts/workout-preview";

const ProfileWorkouts = (props: {
  user: UserDTO | null,
  profile: UserDTO
}) => {
  const [workouts, setWorkouts] = useState<WorkoutDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
        const w = await getAllWorkoutsFromUserID(props.profile.id);
        setWorkouts(w.filter((v, i) => v.title.length >= 1));
        setLoading(false);
    })();
  }, [props.profile.id]);

  const is_self = props.profile.id === props.user?.id;

  return (
    <div className={style.container}>
      <h2>Recent Workouts</h2>
      {loading ? (
        <LoadingWheel size_in_rems={2} />
      ) : (
        <>
          {workouts.length <= 0 ? (
            <span>This user hasn't made any public workouts.</span>
          ) : ( 
            <div className={style.workouts}>
              {workouts.map((v, i) => {
                return (<WorkoutPreview workout={v} key={i} />)
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProfileWorkouts;