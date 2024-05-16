"use client"

import { UserDTO } from "@/api/user/user.dto";
import style from "./workouts.module.scss";
import NewButton from "../new-button/new-button";

const ProfileWorkouts = (props: {
  user: UserDTO | null,
  profile: UserDTO
}) => {
  const is_self = props.profile.id === props.user?.id;

  return (
    <div className={style.container}>
      <h2>Recent Workouts</h2>
      {(is_self && props.user !== null) &&
        <section className={style.options}>
          <NewButton user={props.user} />
        </section>
      }
    </div>
  );
}

export default ProfileWorkouts;