import Link from "next/link";
import style from "./nav-menu.module.scss";

const NavMenu = () => {
    return (
        <nav className={style.nav_menu}>
            <section>
                <Link href="/">Home</Link>
                <Link href=""></Link>
            </section>
        </nav>
    );
}

export default NavMenu;