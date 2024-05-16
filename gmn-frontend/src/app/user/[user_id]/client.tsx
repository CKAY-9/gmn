"use client"

import { UserDTO } from "@/api/user/user.dto"
import style from "./user.module.scss";
import Image from "next/image";
import PersonalRecords from "@/components/personal-records/personal-records";
import ProfileHeader from "@/components/profile-header/profile-header";
import ProfileWorkouts from "@/components/profile-workouts/profile-workouts";

const UserClient = (props: {
  profile: UserDTO,
  user: UserDTO | null
}) => {
  return (
    <>
      <div className={style.profile}>
        <header className={"subject"}>
          <ProfileHeader user={props.user} profile={props.profile} />
        </header>
        <section className={"subject"}>
          <PersonalRecords user={props.user} profile={props.profile} />
        </section>
        <section className={style.row}>
          <section className={"subject"}>
            <ProfileWorkouts user={props.user} profile={props.profile} />
          </section>
          <section className={"subject"}>

          </section>
        </section>
      </div >
    </>
  );
}

export default UserClient;