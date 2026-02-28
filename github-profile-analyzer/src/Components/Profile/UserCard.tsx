import { useGitHub } from "../../Hooks/useGitHub"

function UserCard() {
    const { user } = useGitHub()

    return <>
        <div className="w-1/2 h-full border-2 border-(--text) rounded-4xl">
            <div id="pfp">
                {user && (
                    <img
                        src={user.avatar_url}
                        alt={`${user.login}'s avatar`}
                        className="rounded-full w-24 h-24"
                    />
                )}
            </div>
        </div>
    </>
}

export default UserCard