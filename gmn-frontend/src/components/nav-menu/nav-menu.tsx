"use client";

import Link from "next/link";
import style from "./nav-menu.module.scss";
import { UserDTO } from "@/api/user/user.dto";
import UserChip from "../user-chip/user-chip";
import Image from "next/image";
import { useEffect, useState } from "react";

const NavMenu = (props: { user: UserDTO | null }) => {
  const [path, setPath] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    if (typeof window === undefined || typeof document === undefined) return;

    const link = window.location.pathname;
    const paths = link.split("/");
    setPath(paths);
  }, []);

  const index_check = path[1] === "";
  const explore_check = path[1] === "explore";
  const feed_check = path[1] === "feed";
  const fitness_check = path[1] === "fitness";

  return (
    <nav className={style.nav_menu}>
      <h1 style={{ textAlign: "center" }}>GMN</h1>
      <div className={style.container}>
        <section className={style.nav}>
          <Link
            href="/"
            style={{
              opacity: index_check ? "1" : "0.65",
              backgroundColor: index_check ? "var(--accent)" : "transparent",
            }}
          >
            <Image
              src="/icons/home.svg"
              alt="Home"
              sizes="100%"
              width={0}
              height={0}
            />
            <span>Home</span>
          </Link>
          <Link
            href="/explore"
            style={{
              opacity: explore_check ? "1" : "0.65",
              backgroundColor: explore_check ? "var(--accent)" : "transparent",
            }}
          >
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
            <></>
          ) : (
            <>
              <Link
                href="/feed"
                style={{
                  opacity: feed_check ? "1" : "0.65",
                  backgroundColor: feed_check ? "var(--accent)" : "transparent",
                }}
              >
                <Image
                  src="/icons/trending.svg"
                  alt="Feed"
                  sizes="100%"
                  width={0}
                  height={0}
                />
                <span>Feed</span>
              </Link>
              <Link
                href="/fitness"
                style={{
                  opacity: fitness_check ? "1" : "0.65",
                  backgroundColor: fitness_check
                    ? "var(--accent)"
                    : "transparent",
                }}
              >
                <Image
                  src="/icons/fitness.svg"
                  alt="Fitness"
                  sizes="100%"
                  width={0}
                  height={0}
                />
                <span>Fitness</span>
              </Link>
              {path[1] === "admin" && (
                <Link href="/admin" style={{ opacity: "1" }}>
                  <Image
                    src="/icons/shield.svg"
                    alt="Admin"
                    sizes="100%"
                    width={0}
                    height={0}
                  />
                  <span>Admin</span>
                </Link>
              )}
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
              <Link
                href={`/user/${props.user.id}`}
                style={{
                  margin: "0 auto",
                  padding: "0",
                  opacity:
                    path[1] === `user` && path[2] === `${props.user.id}`
                      ? "1"
                      : "0.65",
                }}
              >
                <UserChip user={props.user} />
              </Link>
            </>
          )}
          <footer className={style.footer}>
            <Link style={{"opacity": "0.65"}} href="https://github.com/CKAY-9/gmn">
              <Image
                src="/marks/github-mark-white.svg"
                alt="GitHub"
                sizes="100%"
                width={0}
                height={0}
                className={style.github}
              />
            </Link>
          </footer>
        </section>
      </div>
    </nav>
  );
};

export default NavMenu;
