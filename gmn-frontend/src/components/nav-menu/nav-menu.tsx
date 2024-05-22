"use client"

import Link from "next/link";
import style from "./nav-menu.module.scss";
import { UserDTO } from "@/api/user/user.dto";
import UserChip from "../user-chip/user-chip";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const NavMenu = (props: {
	user: UserDTO | null
}) => {
	const [path, setPath] = useState<string[]>(["", "", ""]);

	useEffect(() => {
		if (typeof (window) === undefined || typeof (document) === undefined) return;

		const link = window.location.pathname;
		const paths = link.split("/");
		setPath(paths);
	}, []);

	return (
		<nav className={style.nav_menu}>
			<h1 style={{ "textAlign": "center" }}>GMN</h1>
			<div className={style.container}>
				<section className={style.nav}>
					<Link href="/" style={{ "opacity": path[1] === "" ? "1" : "0.5" }}>
						<Image
							src="/icons/home.svg"
							alt="Home"
							sizes="100%"
							width={0}
							height={0}
						/>
						<span>Home</span>
					</Link>
					<Link href="/explore" style={{ "opacity": path[1] === "explore" ? "1" : "0.5" }}>
						<Image
							src="/icons/explore.svg"
							alt="Explore"
							sizes="100%"
							width={0}
							height={0}
						/>
						<span>Explore</span>
					</Link>
					{props.user === null ? (
						<>

						</>
					) : (
						<>
							<Link href="/feed" style={{ "opacity": path[1] === "feed" ? "1" : "0.5" }}>
								<Image
									src="/icons/trending.svg"
									alt="Feed"
									sizes="100%"
									width={0}
									height={0}
								/>
								<span>Feed</span>
							</Link>
							<Link href="/fitness" style={{ "opacity": path[1] === "fitness" ? "1" : "0.5" }}>
								<Image
									src="/icons/fitness.svg"
									alt="Fitness"
									sizes="100%"
									width={0}
									height={0}
								/>
								<span>Fitness</span>
							</Link>
						</>
					)}
				</section>
				<section className={style.nav}>
					{props.user === null ? (
						<>
							<Link href="/login">Login to GMN</Link>
						</>
					) : (
						<>
							<Link href={`/user/${props.user.id}`} style={{ "padding": "0", "opacity": (path[1] === `user` && path[2] === `${props.user.id}`) ? "1" : "0.5" }}>
								<UserChip user={props.user} />
							</Link>
						</>
					)}
				</section>
			</div>
		</nav>
	);
}

export default NavMenu;