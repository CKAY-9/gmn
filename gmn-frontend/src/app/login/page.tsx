import { getUserFromToken } from "@/api/user/user.api";
import NavMenu from "@/components/nav-menu/nav-menu";
import { getStoredToken } from "@/utils/token";
import { Metadata } from "next";
import LoginClient from "./client";

export const generateMetadata = (): Metadata => {
    return {
        title: "Login to GMN",
        description: "Login to GMN using Discord."
    }
}

const LoginPage = async () => {
    const user = await getUserFromToken(getStoredToken());

    return (
        <>
            <main className="app_container">
                <NavMenu user={user} />
                <div className="content">
                    <LoginClient />
                </div>
            </main>
        </>
    );
}

export default LoginPage;