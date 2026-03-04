import { useMemo } from "react"
import { useGitHub } from "../../Hooks/useGitHub"
import { formatDate } from "../../Utils/formatDate"
import { formatField } from "../../Utils/formatField"
import { formatDomain, formatUrl } from "../../Utils/formatUrl"
import CardWrapper from "../UI/CardWrapper"
import RepoCard from "../UI/User/RepoCard"
import { compareValues, getCompareStyle } from "../../Utils/compareValues"
import LanguageDistribution from "../UI/User/LanguageDistribution"

interface UserCardProps {
    isUserB?: boolean
}

function UserCard({ isUserB = false}: UserCardProps) {
    const { user, repos, commits, userB, reposB, comparisonMode, commitsB } = useGitHub()

    const activeUser = isUserB ? userB : user
    const activeRepos = isUserB ? reposB : repos

    const activeCommits = isUserB ? commitsB : commits
    const otherUser = isUserB ? user : userB
    const otherRepos = isUserB ? repos : reposB
    const otherCommits = isUserB ? commits : commitsB

    const myStats = useMemo(() => ({
        commits: activeCommits.reduce((sum, c) => sum + c.count, 0),
        repos: activeRepos.length,
        stars: activeRepos.reduce((sum, r) => sum + r.stargazers_count, 0),
        forks: activeRepos.reduce((sum, r) => sum + r.forks_count, 0),
        followers: activeUser?.followers ?? 0,
        following: activeUser?.following ?? 0,
    }), [activeCommits, activeRepos, activeUser])

    const otherStats = useMemo(() => ({
        commits: otherCommits.reduce((sum, c) => sum + c.count, 0),
        repos: otherRepos.length,
        stars: otherRepos.reduce((sum, r) => sum + r.stargazers_count, 0),
        forks: otherRepos.reduce((sum, r) => sum + r.forks_count, 0),
        followers: otherUser?.followers ?? 0,
        following: otherUser?.following ?? 0,
    }), [otherCommits, otherRepos, otherUser])

    const comparisonRows: { label: string, key: keyof typeof myStats }[] = [
        { label: "Commits", key: "commits" },
        { label: "Repos", key: "repos" },
        { label: "Stars", key: "stars" },
        { label: "Forks", key: "forks" },
        { label: "Followers", key: "followers" },
        { label: "Following", key: "following" },
    ]

    const pfpStyling = [
        comparisonMode === true
            ? "rounded-full w-[clamp(5rem,10vw,10rem)] h-[clamp(5rem,10vw,10rem)] border-4 border-(--text)"
            : "rounded-full w-[clamp(10rem,15vw,20rem)] h-[clamp(10rem,15vw,20rem)] border-4 border-(--text)"
    ].join(" ")

    const usernameStyling = [
        "truncate font-medium",
        comparisonMode === true
            ? "text-[clamp(1rem,3vw,2rem)]"
            : "text-[clamp(2rem,4vw,3rem)]"
    ].join(" ")


    return <CardWrapper>
        <div id="header" className="flex flex-row w-full gap-4 items-center">
            <div id="pfp" className="shrink-0">
                {activeUser && (
                    <img
                        src={activeUser.avatar_url}
                        alt={`${activeUser.login}'s avatar`}
                        className={pfpStyling}
                    />
                )}
            </div>
            <div id="user" className="flex flex-col flex-1 gap-2 min-w-0">
                <div id="login">
                    <h1 className={usernameStyling}>
                        {activeUser && (
                            <a
                                href={activeUser.html_url}
                                target="_blank"
                                rel="noreferrer"
                                >
                                {activeUser.login}
                            </a>
                        )}
                    </h1>
                </div>
                <div id="general-stats" className="w-full border-b-2 border-(--brand-primary) pb-2">
                    <p>

                        {activeUser && (formatField(`Created: ${formatDate(activeUser.created_at)}`, ``))}
                        <br></br> 
                        {activeUser && (formatField(`Updated: ${formatDate(activeUser.updated_at)}`, ``))}
                        {activeUser && activeUser.location && (
                            <>
                                <br />
                                Location: {activeUser.location}
                            </>
                        )}
                        {activeUser && activeUser.blog && (
                            <>
                                <br />
                                <a
                                href={formatUrl(activeUser.blog)}
                                target="_blank"
                                rel="noreferrer"
                                >
                                Website: <span className="underline" > {formatDomain(activeUser.blog)} </span>
                                </a>
                            </>
                        )}
                    </p>
                    <div id="follows" className="flex flex-row flex-1 gap-4 justify-between">
                        <p className="w-1/2">
                            {activeUser && (formatField(`Followers: ${activeUser.followers}`, ``))}
                        </p>
                        <p className="w-1/2">
                            {activeUser && (formatField(`Following: ${activeUser.following}`, ``))}
                        </p>
                    </div>
                </div>
                <div id="bio">
                    <p>
                        {activeUser && (formatField(activeUser.bio, 'Too Cool for a Bio'))}
                    </p>
                </div>
            </div>

        </div>
        {!comparisonMode && (
            <div id="repos" className="flex flex-col flex-1 gap-2 min-h-0">
                <h1 className="py-2 text-5xl font-medium border-b-2 border-(--brand-secondary)">Repositories:</h1>
                <div 
                    id="repo-table"
                    className="flex flex-col flex-1 border-2 border-(--text) rounded-2xl overflow-y-auto pr-1"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "var(--brand-secondary) transparent"
                    }}
                >
                    {activeRepos.map(repo => (
                        <RepoCard key={repo.id} repo={repo} />
                    ))}
                </div>
            </div>
        )}
        {comparisonMode && otherUser && (
            <>
                <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-2xl font-medium border-b-2 border-(--brand-secondary) pb-2">Languages:</h1>
                    <LanguageDistribution repos={activeRepos} columnCount={4} />
                </div>


                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-medium border-b-2 border-(--brand-secondary) pb-2">Comparison:</h1>
                    <div className="flex flex-col gap-1 text-sm">
                        {comparisonRows.map(({ label, key }) => {
                            const myVal = myStats[key]
                            const result = compareValues(myVal, otherStats[key])
                            return (
                                <div key={label} className="flex flex-row justify-between">
                                    <span className="opacity-50">{label}</span>
                                    <span className={getCompareStyle(result)}>{myVal}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>
        )}

    </CardWrapper>
}

export default UserCard