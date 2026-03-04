import UserCard from "./UserCard"
import NavBar from "../UI/NavBar"
import UserStats from "./UserStats"
import SearchWrapperDefault from "../UI/SearchWrapperDefault"
import { useGitHub } from "../../Hooks/useGitHub"

function UserPage() {
    const { user, userB, comparisonMode } = useGitHub()

    if (!user) return <SearchWrapperDefault />

    return (
        <div className="bg-(--bg-color) h-screen flex flex-col overflow-hidden font-['IBM_Plex_Mono'] text-(--text)">
            <NavBar />
            <div className="flex flex-row flex-1 min-h-0 p-4 gap-4">
                <div className="w-1/2 h-full min-h-0">
                    <UserCard />
                </div>
                {comparisonMode && userB
                    ? (
                        <div
                            className="w-1/2 h-full min-h-0"
                            style={{ animation: "fadeIn 0.3s ease-in-out" }}
                        >
                            <UserCard isUserB />
                        </div>
                    ) : (
                        <div className="w-1/2 h-full min-h-0">
                            <UserStats />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default UserPage