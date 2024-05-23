"use client"

import { eraseCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";

const Logout = () => {
  const logout = () => {
    if (typeof(document) === undefined || typeof(window) === undefined) return;
    eraseCookie("token");
    window.location.href = "/login"
  }
  
  return (
    <>
      <button className="impact danger" onClick={logout}>Logout</button>
    </>
  );
}

export default Logout;