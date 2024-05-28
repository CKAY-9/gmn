"use client";

import { UserDTO } from "@/api/user/user.dto";
import Image from "next/image";
import style from "./workouts.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import SelectExercise from "../select-exercise/select-exercise";
import { ExerciseDTO } from "@/api/exercise/exercise.dto";
import { WorkoutDTO, WorkoutExerciseDTO } from "@/api/workout/workout.dto";
import { getExerciseFromID } from "@/api/exercise/exercise.api";
import LoadingWheel from "../loading/loading";
import EditButton from "../edit-button/edit-button";
import { getWorkoutsFromUserID, updateWorkoutEntriesFromWorkoutID } from "@/api/workout/workout.api";

const ExerciseEntry = (props: {
  exercise: WorkoutExerciseDTO;
  on_edit: Function;
  index: number;
}) => {
  const [exercise_data, setExerciseData] = useState<ExerciseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reps, setReps] = useState<number>(props.exercise.reps);
  const [sets, setSets] = useState<number>(props.exercise.sets);
  const [weight, setWeight] = useState<number>(props.exercise.weight);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const ex = await getExerciseFromID(props.exercise.exercise_id);
      setExerciseData(ex);
      setLoading(false);
    })();
  }, [props.exercise.exercise_id]);

  const toggleEditMode = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (edit) {
      const update: WorkoutExerciseDTO = {
        exercise_id: props.exercise.exercise_id,
        weight,
        reps,
        sets,
      };
      props.on_edit(update, props.index);
    }
    setEdit(!edit);
  };

  return (
    <div>
      {loading || exercise_data === null ? (
        <LoadingWheel size_in_rems={2} />
      ) : (
        <div className={style.entry}>
          <span className={style.name}>{exercise_data.name}</span>
          {edit ? (
            <>
              <input
                type="number"
                placeholder="Weight (lbs)"
                defaultValue={weight}
                onChange={(e: BaseSyntheticEvent) =>
                  setWeight(Number.parseInt(e.target.value))
                }
              />
              <input
                type="number"
                placeholder="Reps"
                defaultValue={reps}
                onChange={(e: BaseSyntheticEvent) =>
                  setReps(Number.parseInt(e.target.value))
                }
              />
              <input
                type="number"
                placeholder="Sets"
                defaultValue={sets}
                onChange={(e: BaseSyntheticEvent) =>
                  setSets(Number.parseInt(e.target.value))
                }
              />
            </>
          ) : (
            <>
              <span>Weight: {weight}lbs</span>
              <span>Reps: {reps}</span>
              <span>Sets: {sets}</span>
            </>
          )}
          <span style={{ opacity: "0.5" }}>
            Volume: {weight * reps * sets}lbs
          </span>
          <div className={style.edit}>
            <EditButton on_click={toggleEditMode} />
          </div>
        </div>
      )}
    </div>
  );
};

const Workouts = (props: { user: UserDTO }) => {
  const [workout, setWorkout] = useState<WorkoutDTO | null>(null);
  const [show_select, setShowSelect] = useState<boolean>(false);
  const [exercises, setExercises] = useState<WorkoutExerciseDTO[]>([]);
  const [raw_exercises, setRawExercises] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const w = await getWorkoutsFromUserID(props.user.id);
      if (w === null) return;

      setWorkout(w);
      let parsed = []
      for (const raw of w.exercises) {
        parsed.push(JSON.parse(raw));
      }
      setExercises(parsed);
    })();
  }, [props.user.id]);

  const openSelect = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setShowSelect(true);
  };

  const onExerciseEdit = async (update: WorkoutExerciseDTO, index: number) => {
    if (workout === null) return;
    
    exercises[index] = update;
    setExercises(exercises);

    const raw = [];
    for (const exercise of exercises) {
      raw.push(JSON.stringify(exercise));
    }
    setRawExercises(raw);

    const u = await updateWorkoutEntriesFromWorkoutID(workout.id, raw);
  }

  return (
    <>
      {show_select && (
        <SelectExercise
          on_close={() => setShowSelect(false)}
          on_select={(exercise: ExerciseDTO) => {
            setExercises((old) => [
              ...old,
              {
                exercise_id: exercise.id,
                sets: 0,
                reps: 0,
                weight: 0,
              },
            ]);
            setShowSelect(false);
          }}
        />
      )}
      <h2>Workouts</h2>
      {workout === null ? (
        <LoadingWheel size_in_rems={2} />
      ) : (
        <>
          <input type="text" placeholder="Title (Optional)" />
          <textarea name="" id="" cols={50} rows={10} placeholder="Description (Optional)"></textarea>
          <span style={{"opacity": "0.5"}}>(Optional: if a title is given, this workout entry will become public and visible on your profile)</span>
          <button onClick={openSelect} className={style.add}>
            <Image
              src="/icons/add.svg"
              alt="Add"
              sizes="100%"
              width={0}
              height={0}
            />
            <span>Add Exercise</span>
          </button>
          <div className={style.entries}>
            {exercises.map((ex, index) => {
              return (
                <ExerciseEntry index={index} on_edit={onExerciseEdit} exercise={ex} key={index} />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Workouts;
