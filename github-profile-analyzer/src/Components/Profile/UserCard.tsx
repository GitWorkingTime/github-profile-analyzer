import { useEffect } from "react"
import { useGitHub } from "../../Hooks/useGitHub"
import { formatDate } from "../../Utils/formatDate"
import { formatField } from "../../Utils/formatField"
import { formatDomain, formatUrl } from "../../Utils/formatUrl"
import Card from "../UI/Card"
import RepoCard from "../UI/RepoCard"


function UserCard() {
    const { user, repos } = useGitHub()

    useEffect(() => {
        console.log(user)
        console.log(repos)
    }, [user, repos])

    return <Card>
        <div id="header" className="flex flex-row w-full gap-4 items-center">
            <div id="pfp" className="shrink-0">
                {user && (
                    <img
                        src={user.avatar_url}
                        alt={`${user.login}'s avatar`}
                        className="rounded-full w-[clamp(10rem,15vw,20rem)] h-[clamp(10rem,15vw,20rem)] border-4 border-(--text)"
                    />
                )}
            </div>
            <div id="user" className="flex flex-col flex-1 gap-2 min-w-0">
                <div id="login">
                    <h1 className="text-[clamp(2rem,4vw,3rem)] truncate font-medium">
                        {user && (user.login)}
                    </h1>
                </div>
                <div id="general-stats" className="w-full border-b-2 border-(--primary) pb-2">
                    <p>

                        {user && (formatField(`Created: ${formatDate(user.created_at)}`, ``))}
                        <br></br> 
                        {user && (formatField(`Updated: ${formatDate(user.updated_at)}`, ``))}
                        {user && user.location && (
                            <>
                                <br />
                                Location: {user.location}
                            </>
                        )}
                        {user && user.blog && (
                            <>
                                <br />
                                <a
                                href={formatUrl(user.blog)}
                                target="_blank"
                                rel="noreferrer"
                                >
                                Website: <span className="underline" > {formatDomain(user.blog)} </span>
                                </a>
                            </>
                        )}
                    </p>
                    <div id="follows" className="flex flex-row flex-1 gap-4 justify-between">
                        <p className="w-1/2">
                            {user && (formatField(`Followers: ${user.followers}`, ``))}
                        </p>
                        <p className="w-1/2">
                            {user && (formatField(`Following: ${user.following}`, ``))}
                        </p>
                    </div>
                </div>
                <div id="bio">
                    <p>
                        {user && (formatField(user.bio, 'Too Cool for a Bio'))}
                    </p>
                </div>
            </div>

        </div>
        <div id="repos" className="flex flex-col flex-1 gap-2 min-h-0">
            <h1 className="py-2 text-5xl font-medium border-b-2 border-(--secondary)">Repositories:</h1>
            <div 
                id="repo-table"
                className="flex flex-col flex-1 border-2 border-(--text) rounded-2xl overflow-y-auto pr-1"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "var(--secondary) transparent"
                }}
            >
                {repos.map(repo => (
                    <RepoCard key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    </Card>
}

export default UserCard