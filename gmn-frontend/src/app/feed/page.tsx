import { getUserFromToken } from "@/api/user/user.api";
import NavMenu from "@/components/nav-menu/nav-menu";
import { getStoredToken } from "@/utils/token";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
    return {
        title: "Feed - GMN",
        description: "View what people have posted and said on your feed."
    }
}

const FeedPage = async () => {
    const user = await getUserFromToken(getStoredToken());

    return (
        <>
            <main className="app_container">
                <NavMenu user={user} />
                <div className="content">
                    
                </div>
            </main>
        </>
    );
}

export default FeedPage;