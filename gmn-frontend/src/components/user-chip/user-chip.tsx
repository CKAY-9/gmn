import { UserDTO } from "@/api/user/user.dto"
import style from "./user-chip.module.scss";
import Image from "next/image";

const UserChip = (props: {
  user: UserDTO
}) => {
  return (
    <div className={style.user_chip}>
      <Image 
        src={props.user.avatar}
        alt="Avatar"
        sizes="100%"
        width={0}
        height={0}
        className={style.avatar}
      />
      <span className={style.username}>{props.user.username}</span>
    </div>
  );
}

export default UserChip;