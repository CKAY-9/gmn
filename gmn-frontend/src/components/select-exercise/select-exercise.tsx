"use client"

import { BaseSyntheticEvent, useEffect, useState } from "react";
import Popup from "../popup/popup";
import { ExerciseDTO } from "@/api/exercise/exercise.dto";
import { getAllExercises } from "@/api/exercise/exercise.api";
import LoadingWheel from "../loading/loading";
import style from "./select.module.scss";
import Exercise from "../exercise/exercise";

const SelectExercise = (props: {
  on_select: Function
  on_close: Function
}) => {
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected_index, setSelectedIndex] = useState<number>(-1);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    (async () => {
      const ex = await getAllExercises();
      setExercises(ex);
      setLoading(false);
    })();
  }, [selected_index]);

  return (
    <>
      <Popup close={props.on_close}>
        <>
          <h2>Select Exercise</h2>
          {loading ? (
            <LoadingWheel size_in_rems={2} />
          ) : (
            <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
              <input type="text" placeholder="Search" onChange={(e: BaseSyntheticEvent) => setSearch(e.target.value.toLowerCase())} />
              <div className={style.exercises}>
                {exercises.filter((v, i) => v.name.toLowerCase().includes(search)).map((ex, index) => {
                  return (
                    <button onClick={() => {
                      props.on_select(ex);
                      setSelectedIndex(index);
                    }} className={style.select} style={{ "borderColor": selected_index === index ? "var(--primary)" : "var(--secondary)" }}>
                      <Exercise exercise={ex} key={index} />
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </>
      </Popup>
    </>
  );
}

export default SelectExercise;