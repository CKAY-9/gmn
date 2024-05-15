import Link from "next/link";
import style from "./nav-menu.module.scss";
import { UserDTO } from "@/api/user/user.dto";

const NavMenu = (props: {
	user: UserDTO | null
}) => {
	return (
		<nav className={style.nav_menu}>
			<h1 style={{ "textAlign": "center" }}>GMN</h1>
			<div className={style.container}>
				<section className={style.nav}>
					<Link href="/">Home</Link>
					<Link href="/feed">Feed</Link>
					{props.user === null ? (
						<>
						
						</>
					) : (
						<>
							<Link href="/fitness">Fitness</Link>
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
						</>
					)}
				</section>
			</div>
		</nav>
	);
}

export default NavMenu;