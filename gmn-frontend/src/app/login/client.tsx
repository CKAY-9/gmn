"use client"

import { DISCORD_OAUTH_LINK, GITHUB_OAUTH_LINK } from "@/api/resources";
import style from "./login.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { setCookie } from "@/utils/cookies";

const LoginClient = () => {
  const search_params = useSearchParams();
  const token = search_params.get("token");
  if (token !== null) {
    setCookie("token", token, 999);
    window.location.href = "/"
  }

  return (
    <section style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
      <div className="subject">
        <h1>Login to GMN</h1>
        <span>Currently, GMN does not have it&apos;s own dedicated login system. You will have to login using an OAuth2 provider below.</span>
      </div>
      <div className="subject">
        <section className={style.oauths}>
          {DISCORD_OAUTH_LINK &&
            <Link href={DISCORD_OAUTH_LINK || "/login"} className={style.oauth} style={{ "backgroundColor": "#5865F2" }}>
              <Image
                src="/marks/discord-mark-white.svg"
                alt="Discord Logo"
                sizes="100%"
                width={0}
                height={0}
              />
              <span>Login with Discord</span>
            </Link>
          }
          {GITHUB_OAUTH_LINK &&
            <Link href={GITHUB_OAUTH_LINK || "/login"} className={style.oauth} style={{ "backgroundColor": "#181818" }}>
              <Image
                src="/marks/github-mark-white.svg"
                alt="Discord Logo"
                sizes="100%"
                width={0}
                height={0}
              />
              <span>Login with GitHub</span>
            </Link>
          }
        </section>
      </div>
    </section>
  );
}

export default LoginClient;