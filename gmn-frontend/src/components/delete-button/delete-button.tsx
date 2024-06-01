"use client"

import Image from "next/image";
import style from "./delete.module.scss";
import { useState } from "react";

const DeleteButton = (props: {
  on_click: Function
}) => {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <button onClick={async (e) => await props.on_click(e)}>
      <Image 
        src={hovering ? "/icons/delete-filled.svg" : "/icons/delete.svg"}
        alt="Edit"
        sizes="100%"
        width={0}
        height={0}
        className={style.image}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => setHovering(!hovering)}
      />
    </button>
  );
}

export default DeleteButton;