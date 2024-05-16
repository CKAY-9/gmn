"use client"

import { UserDTO } from "@/api/user/user.dto"
import { BaseSyntheticEvent, useState } from "react"
import style from "./records.module.scss";
import EditButton from "../edit-button/edit-button";
import { updatePersonalRecordsFromID } from "@/api/user/user.api";

const PersonalRecords = (props: {
  user: UserDTO | null,
  profile: UserDTO
}) => {
  const [edit_mode, setEditMode] = useState<boolean>(false);
  const [bench, setBench] = useState<number>(props.profile.personal_records[0] || 0);
  const [squat, setSquat] = useState<number>(props.profile.personal_records[1] || 0);
  const [deadlift, setDeadlift] = useState<number>(props.profile.personal_records[2] || 0);
  const is_self = props.profile.id === props.user?.id;

  const toggleEditMode = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (edit_mode && props.user !== null) {
      // save updated info
      const update = await updatePersonalRecordsFromID(props.user.id, bench, squat, deadlift);
    }
    setEditMode(!edit_mode);
  }

  return (
    <>
      <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
        <h2>Personal Records</h2>
        {is_self && <EditButton on_click={toggleEditMode} />}
      </div>
      <div className={style.prs}>
        <div className={style.pr}>
          {edit_mode ? (
            <>
              <label>Bench: </label>
              <input onChange={(e: BaseSyntheticEvent) => setBench(e.target.value)} type="number" placeholder="Bench" defaultValue={bench} />
            </>
          ) : (
            <span>Bench: {bench}lbs</span>
          )}
        </div>
        <div className={style.pr}>
          {edit_mode ? (
            <>
              <label>Squat: </label>
              <input onChange={(e: BaseSyntheticEvent) => setSquat(e.target.value)} type="number" placeholder="Squat" defaultValue={squat} />
            </>
          ) : (
            <span>Squat: {squat}lbs</span>
          )}
        </div>
        <div className={style.pr}>
          {edit_mode ? (
            <>
              <label>Deadlift: </label>
              <input onChange={(e: BaseSyntheticEvent) => setDeadlift(e.target.value)} type="number" placeholder="Deadlift" defaultValue={deadlift} />
            </>
          ) : (
            <span>Deadlift: {deadlift}lbs</span>
          )}
        </div>
      </div>
    </>
  );
}

export default PersonalRecords