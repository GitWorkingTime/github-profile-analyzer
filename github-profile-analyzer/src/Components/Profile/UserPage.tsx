import UserCard from "./UserCard"
import NavBar from "../UI/NavBar"
import UserStats from "./UserStats"

function UserPage() {
    return <>
        <div className="bg-(--bg-color) h-screen flex flex-col overflow-hidden font-['IBM_Plex_Mono'] text-(--text)">
            <NavBar />
            <div className="flex flex-row flex-1 min-h-0 p-4 gap-4">
                <div className="w-1/2 h-full min-h-0">
                    <UserCard />
                </div>
                <div className="w-1/2 h-full min-h-0">
                    <UserStats />
                </div>
            </div>
        </div>
    </>
}

export default UserPage