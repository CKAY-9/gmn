"use client"

import Image from "next/image";
import style from "./edit.module.scss";
import { useState } from "react";

const EditButton = (props: {
  on_click: Function
}) => {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <button onClick={() => props.on_click()}>
      <Image 
        src={hovering ? "/icons/edit-fill.svg" : "/icons/edit.svg"}
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

export default EditButton;