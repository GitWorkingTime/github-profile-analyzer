import { useEffect } from "react"
import { useGitHub } from "../../Hooks/useGitHub"
import { formatDate } from "../../Utils/formatDate"
import { formatField } from "../../Utils/formatField"
import { formatDomain, formatUrl } from "../../Utils/formatUrl"

function UserCard() {
    const { user } = useGitHub()

    useEffect(() => {
        console.log(user)
    }, [user])

    return <>
        <div className="w-1/2 h-full border-2 border-(--text) rounded-4xl p-4">
            <div id="header" className="flex flex-row w-full gap-4">
                <div id="pfp">
                    {user && (
                        <img
                            src={user.avatar_url}
                            alt={`${user.login}'s avatar`}
                            className="rounded-full w-80 h-80 border-4 border-(--text)"
                        />
                    )}
                </div>
                <div id="user" className="flex flex-col flex-1 gap-4">
                    <div id="login">
                        <h1 className="text-5xl font-medium">
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
                                    Blog: <span className="underline" > {formatDomain(user.blog)} </span>
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

        </div>
    </>
}

export default UserCard