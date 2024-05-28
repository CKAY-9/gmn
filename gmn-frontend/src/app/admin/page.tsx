import { getUserFromToken } from "@/api/user/user.api"
import NavMenu from "@/components/nav-menu/nav-menu"
import { getStoredToken } from "@/utils/token"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import AdminClient from "./client"

export const generateMetadata = (): Metadata => {
  return {
    title: "Admin - GMN",
    description: "GMN's Admin Control Panel. Goodluck pal!"
  }
}

const AdminPage = async () => {
  const user = await getUserFromToken(getStoredToken());

  if (user === null) {
    redirect("/login");
  }

  return (
    <>
      <main className="app_container">
        <NavMenu user={user} />
        <div className="content" style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
          <AdminClient user={user} />
        </div>
      </main>
    </>
  );
}

export default AdminPage;