"use client"

import { getPersonalGoals, updatePersonalGoalsFromID } from "@/api/goals/goals.api"
import { PersonalGoalDTO } from "@/api/goals/goals.dto"
import { UserDTO } from "@/api/user/user.dto"
import { BaseSyntheticEvent, useEffect, useState } from "react"
import LoadingWheel from "../loading/loading"
import style from "./goals.module.scss"
import { MacrosDTO } from "@/api/macros/macros.dto"
import { getMacrosFromUserID, getWeeklyMacros } from "@/api/macros/macros.api"
import EditButton from "../edit-button/edit-button"
import { WorkoutDTO } from "@/api/workout/workout.dto"
import { getWorkoutsFromUserID } from "@/api/workout/workout.api"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Goals = (props: {
  user: UserDTO,
  on_goal_change?: Function
}) => {
  const [goals, setGoals] = useState<PersonalGoalDTO | null>(null);
  const [weekly, setWeekly] = useState<MacrosDTO[]>([]);
  const [workout, setWorkout] = useState<WorkoutDTO | null>(null);
  const [macros, setMacros] = useState<MacrosDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const g = await getPersonalGoals();
      const m = await getMacrosFromUserID(props.user.id);
      const work = await getWorkoutsFromUserID(props.user.id)
      const w = await getWeeklyMacros(props.user.id || 0);

      setGoals(g);
      setMacros(m);
      setWeekly(w.reverse());
      setWorkout(work);
      setLoading(false);
    })();
  }, []);

  const toggleEdit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (goals === null) return;

    if (edit) {
      const update = await updatePersonalGoalsFromID(
        goals.id,
        goals.height,
        goals.weight,
        goals.calorie_goal,
        goals.weight_goal,
        goals.activity_goal
      );
      if (props.on_goal_change !== undefined) {
        props.on_goal_change(goals);
      }
    }
    setEdit(!edit);
  }

  return (
    <>
      <h2>Goals</h2>
      <span>GMN is dedicated to making sure you stay consistent in your goals, so we have made setting and maintaining goals as easy as possible!</span>
      {(loading || goals === null || macros === null) ? (
        <LoadingWheel size_in_rems={2} />
      ) : (
        <>
          {edit &&
            <>
              <div className={style.goals}>
                <input onChange={(e: BaseSyntheticEvent) => {
                  goals.height = Number.parseInt(e.target.value);
                  setGoals(goals);
                }} min={0} type="number" placeholder="Height (cm)" defaultValue={goals.height} />
                <input onChange={(e: BaseSyntheticEvent) => {
                  goals.weight = Number.parseInt(e.target.value);
                  setGoals(goals);
                }} min={0} type="number" placeholder="Weight (lbs)" defaultValue={goals.weight} />
              </div>
              <div className={style.goals}>
                <input onChange={(e: BaseSyntheticEvent) => {
                  goals.calorie_goal = Number.parseInt(e.target.value);
                  setGoals(goals);
                }} min={0} type="number" placeholder="Calorie Goal (kcal)" defaultValue={goals.calorie_goal} />
                <input onChange={(e: BaseSyntheticEvent) => {
                  goals.weight_goal = Number.parseInt(e.target.value);
                  setGoals(goals);
                }} min={0} type="number" placeholder="Weight Goal (lbs)" defaultValue={goals.weight_goal} />
                <input onChange={(e: BaseSyntheticEvent) => {
                  goals.activity_goal = Number.parseInt(e.target.value);
                  setGoals(goals);
                }} min={1} max={5} type="number" placeholder="Activity Goal (1-5)" defaultValue={goals.activity_goal} />
              </div>
            </>
          }
          {!edit &&
            <div className={style.goals}>
              <div className={style.goal}>
                <div className={style.circle}>
                  <div className={style.middle}>
                    <span>{macros.calories}kcal</span>
                  </div>
                </div>
                <div className={style.bar} style={{ "marginLeft": "-0.5rem", "width": "250px" }}>
                  <div className={style.bar} style={{ "backgroundColor": "var(--accent)", "width": `${(macros.calories / (goals.calorie_goal === 0 ? 1 : goals.calorie_goal)) * 250}px` }} />
                  <span>{goals.calorie_goal}kcal</span>
                </div>
              </div>
              <div className={style.goal}>
                <div className={style.circle}>
                  <div className={style.middle}>
                    <span>{goals.weight}lbs</span>
                  </div>
                </div>
                <div className={style.bar} style={{ "marginLeft": "-0.5rem", "width": "250px" }}>
                  <div className={style.bar} style={{ "backgroundColor": "var(--accent)", "width": `${(goals.weight > goals.weight_goal ? (goals.weight_goal / goals.weight) : (goals.weight / goals.weight_goal)) * 250}px` }} />
                  <span>{goals.weight_goal}lbs</span>
                </div>
              </div>
              <div className={style.goal}>
                <div className={style.circle}>
                  <div className={style.middle}>
                    <span>{goals.activity_level} Activity</span>
                  </div>
                </div>
                <div className={style.bar} style={{ "marginLeft": "-0.5rem", "width": "250px" }}>
                  <div className={style.bar} style={{ "backgroundColor": "var(--accent)", "width": `${(goals.activity_level / (goals.activity_goal === 0 ? 1 : goals.activity_goal)) * 250}px` }} />
                  <span>{goals.activity_goal}</span>
                </div>
              </div>
            </div>
          }
          <span style={{ "opacity": "0.5" }}>(Note: activity level is calculated from your total repititions multiplied by total sets: 1 = 24 (8*3), 5 = 240 (10*24) )</span>

          <Line
            height={50}
            data={{
              labels: weekly.map((v, i) => (i + 1)),
              datasets: [
                {
                  label: "Calories",
                  data: weekly.map((v, i) => v.calories),
                  borderColor: "rgb(100, 100, 200)",
                  backgroundColor: "rgb(100, 100, 200)"
                },
                {
                  label: "Protein",
                  data: weekly.map((v, i) => v.protein),
                  borderColor: "rgb(200, 100, 100)",
                  backgroundColor: "rgb(200, 100, 100)"
                },
                {
                  label: "Fats",
                  data: weekly.map((v, i) => v.fats),
                  borderColor: "rgb(100, 200, 100)",
                  backgroundColor: "rgb(100, 200, 100)"
                },
                {
                  label: "Carbs",
                  data: weekly.map((v, i) => v.carbs),
                  borderColor: "rgb(100, 200, 200)",
                  backgroundColor: "rgb(100, 200, 200)"
                },
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'Daily Nutrients',
                },
              },
            }}
          />

          <div className={style.edit}>
            <EditButton on_click={toggleEdit} />
          </div>
        </>
      )}
    </>
  );
}

export default Goals;