"use client"

import { getUserFromID } from "@/api/user/user.api";
import { UserDTO } from "@/api/user/user.dto";
import { useEffect, useState } from "react";
import Popup from "../popup/popup";
import style from "./list.module.scss";
import Image from "next/image";
import Link from "next/link";

const FollowList = (props: {
  user_ids: number[],
  title: string,
  close: Function
}) => {
  const [users, setUsers] = useState<UserDTO[]>([]);

  useEffect(() => {
    (async () => {
      setUsers([]);
      for (let i = 0; i < props.user_ids.length; i++) {
        const temp = await getUserFromID(props.user_ids[i]);
        if (temp === null) return;
        setUsers((old) => [...old, temp]);
      }
    })();
  }, [props.user_ids])

  return (
    <>
      <Popup close={props.close}>
        <>
          <h2>{props.title}</h2>
          <div className={style.users}>
            {users.map((v, i) => {
              return (
                <Link href={`/user/${v.id}`} className={style.user}>
                  <Image 
                    src={v.avatar}
                    alt="Profile Picture"
                    sizes="100%"
                    width={0}
                    height={0}
                    className={style.pfp}
                  />
                  <span>{v.username}</span>
                </Link>
              )
            })}
            {users.length <= 0 && <span>This user has no {props.title.toLowerCase()}</span>}
          </div>
        </>
      </Popup>
    </>
  );
}

export default FollowList;