"use client"

import { createNewExercise, getAllExercises } from "@/api/exercise/exercise.api";
import { ExerciseDTO } from "@/api/exercise/exercise.dto";
import { UserDTO } from "@/api/user/user.dto";
import Exercise from "@/components/exercise/exercise";
import LoadingWheel from "@/components/loading/loading";
import { BaseSyntheticEvent, useEffect, useState } from "react";

const AdminClient = (props: {
  user: UserDTO
}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [example_video, setExampleVideo] = useState<string>("");
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const ex = await getAllExercises();
      setExercises(ex); 
      setLoading(false);
    })();
  }, []);

  const createNew = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const create = await createNewExercise(name, description, example_video);
    if (create !== null) {
      const ex = await getAllExercises();
      setExercises(ex); 
    }
  }

  return (
    <>
      <div className="subject">
        <h1>Control Panel</h1>
        <span>Modify GMN</span>
      </div>
      <div className="subject">
        <h2>Exercises</h2>
        <div style={{"display": "flex", "flexDirection": "column", "gap": "0.5rem"}}>
          <h3>Create New</h3>
          <input type="text" placeholder="Name" onChange={(e: BaseSyntheticEvent) => setName(e.target.value)} />
          <textarea name="" id="" cols={50} rows={10} placeholder="Description" onChange={(e: BaseSyntheticEvent) => setDescription(e.target.value)} />
          <input type="text" placeholder="Example Video URL" onChange={(e: BaseSyntheticEvent) => setExampleVideo(e.target.value)} />
          <input type="submit" value="Create" onClick={createNew} />
        </div>
        <div style={{"display": "flex", "flexDirection": "column", "gap": "0.5rem"}}>
          <h3>Existing Exercises</h3>
          {loading && <LoadingWheel size_in_rems={2} />}
          <div style={{"display": "flex", "gap": "1rem"}}>
            {(!loading && exercises.length <= 0) && <span>There are no existing exercises.</span>}
            {exercises.map((e, index) => {
              return (<Exercise key={index} exercise={e} />)
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminClient;