"use client"

import { UserDTO } from "@/api/user/user.dto"
import style from "./user.module.scss";
import Image from "next/image";
import EditButton from "@/components/edit-button/edit-button";
import { useState } from "react";

const UserClient = (props: {
  profile: UserDTO,
  user: UserDTO | null
}) => {
  const [edit_mode, setEditMode] = useState<boolean>(false);
  const is_self = props.profile.id === props.user?.id;

  return (
    <>
      <div className={style.profile}>
        <header className={style.subject}>
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
            <span>{props.profile.bio}</span>
          </section>
        </header>
        <section className={style.subject}>
          <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
            <h2>Personal Records</h2>
            {is_self && <EditButton on_click={() => setEditMode(!edit_mode)} />}
          </div>
          <div className={style.prs}>
            <div className={style.pr}>
              {edit_mode ? (
                <>
                  <label>Bench: </label>
                  <input type="number" placeholder="Bench" defaultValue={props.profile.personal_records[0] || 0} />
                </>
              ) : (
                <span>Bench: {props.profile.personal_records[0] || 0}lbs</span>
              )}
            </div>
            <div className={style.pr}>
              {edit_mode ? (
                <>
                  <label>Squat: </label>
                  <input type="number" placeholder="Squat" defaultValue={props.profile.personal_records[1] || 0} />
                </>
              ) : (
                <span>Squat: {props.profile.personal_records[1] || 0}lbs</span>
              )}
            </div>
            <div className={style.pr}>
              {edit_mode ? (
                <>
                  <label>Deadlift: </label>
                  <input type="number" placeholder="Deadlift" defaultValue={props.profile.personal_records[2] || 0} />
                </>
              ) : (
                <span>Deadlift: {props.profile.personal_records[2] || 0}lbs</span>
              )}
            </div>
          </div>
        </section >
      </div >
    </>
  );
}

export default UserClient;