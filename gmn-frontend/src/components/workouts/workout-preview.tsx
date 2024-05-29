"use client"

import { WorkoutDTO, WorkoutExerciseDTO } from "@/api/workout/workout.dto"
import style from "./workouts.module.scss";
import { useEffect, useState } from "react";
import { UserDTO } from "@/api/user/user.dto";
import { getUserFromID } from "@/api/user/user.api";
import UserChip from "../user-chip/user-chip";
import LoadingWheel from "../loading/loading";
import Link from "next/link";

const WorkoutPreview = (props: {
  workout: WorkoutDTO
}) => {
	const [user, setUser] = useState<UserDTO | null>(null);
	const [loading_user, setLoadingUser] = useState<boolean>(true);
	const [total_volume, setTotalVolume] = useState<number>(0);

	useEffect(() => {
		(async () => {
			const u = await getUserFromID(props.workout.user_id);
			setUser(u);
			setLoadingUser(false);
		})();

		let total = 0;
		for (const exercise in props.workout.exercises) {
			const parse: WorkoutExerciseDTO = JSON.parse(exercise);
			total += (parse.reps * parse.sets * parse.weight);
		}
		setTotalVolume(total);
	}, [props.workout.user_id, props.workout.exercises]);

	return (
		<>
			<Link href={`/workout/${props.workout.id}`} className={style.entry}>
				<span className={style.name}>{props.workout.title}</span>
				<p style={{"margin": "0"}}>{props.workout.description.substring(0, 100)}</p>
				<span style={{"opacity": "0.5"}}>(Total Volume: {total_volume}lbs)</span>
				{(loading_user || user === null) ? (
					<LoadingWheel size_in_rems={2} />
				) : (
					<Link href={`/user/${props.workout.user_id}`}>
						<UserChip user={user} />
					</Link>
				)}
			</Link>
		</>
	);
}

export default WorkoutPreview;