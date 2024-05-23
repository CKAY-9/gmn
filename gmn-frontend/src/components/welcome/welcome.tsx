"use client"

import { UserDTO } from "@/api/user/user.dto"
import Image from "next/image"
import { useState } from "react"
import style from "./welcome.module.scss"

const Welcome = (props: {
  user: UserDTO
}) => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <>
      <section className={style.welcome_splash}>
        <Image
          src={props.user.avatar}
          alt="Profile Picture"
          sizes="100%"
          width={0}
          height={0}
          className={style.pfp}
        />
        <h1>{props.user.username}</h1>
      </section>
      <span>Today is {date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
    </>
  );
}

export default Welcome;