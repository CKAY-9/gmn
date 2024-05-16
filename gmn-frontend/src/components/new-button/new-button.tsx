"use client"

import { UserDTO } from "@/api/user/user.dto"
import style from "./new.module.scss";
import Image from "next/image";

const NewButton = (props: {
  user: UserDTO
}) => {
  return (
    <div className={style.container}>
      <button className={style.add}>
        <Image 
          src="/icons/add.svg"
          alt="New"
          sizes="100%"
          width={0}
          height={0}
        />
      </button>
      <div className={style.menu}>

      </div>
    </div>
  );
}

export default NewButton;