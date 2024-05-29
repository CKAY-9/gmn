"use client";

import { ExerciseDTO } from "@/api/exercise/exercise.dto";
import { UserDTO } from "@/api/user/user.dto";
import style from "./exercise.module.scss";

const Exercise = (props: { exercise: ExerciseDTO }) => {
  return (
    <div className={style.exercise}>
      <section>
        <span className={style.name}>{props.exercise.name}</span>
        <p>{props.exercise.description}</p>
      </section>
      <section>
        {props.exercise.example_video.includes("youtube") && (
          <iframe
            width="300"
            height="300"
            src={`https://www.youtube.com/embed/${props.exercise.example_video.split("?v=")[1]}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className={style.iframe}
          ></iframe>
        )}
      </section>
    </div>
  );
};

export default Exercise;
