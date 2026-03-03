import { useState, useMemo } from "react"
import CardWrapper from "../UI/CardWrapper"
import { useGitHub } from "../../Hooks/useGitHub"
import CommitHeatMap from "../UI/User/CommitsHeatmap"
import LanguagePieChart from "../UI/User/LanguagePieChart"
import { generateColor } from "../../Utils/generateColor"
import RepoCard from "../UI/User/RepoCard"
import RepoDetails from "../UI/User/RepoDetails"
import type { GitHubRepo } from "../../Types/GitHubRepos"

const RANGES = [
    { label: "3 Months", months: 3 },
    { label: "6 Months", months: 6 },
    { label: "1 Year", months: 12 },
]

function UserStats() {
    const { commits, repos } = useGitHub()
    const [range, setRange] = useState(12)
    const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)

    const totalCommits = useMemo(() => {
        return commits.reduce((sum, commit) => sum + commit.count, 0)
    }, [commits])

    const totalRepos = repos.length

    const totalForkedRepos = useMemo(() => {
        return repos.reduce((sum, repo) => sum + repo.forks_count, 0)
    }, [repos])

    const totalStars = useMemo(() => {
        return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    }, [repos])

    const languageCounts = useMemo(() => {
        const counts: Record<string, number> = {}
        for (const repo of repos) {
            if (repo.language) {
                counts[repo.language] = (counts[repo.language] ?? 0) + 1
            }
        }
        return counts
    }, [repos])

    const sortedLanguages = useMemo(() => {
        return Object.entries(languageCounts)
            .sort(([, a], [, b]) => b - a)
    }, [languageCounts])

    const totalRepoCount = useMemo(() => {
        return Object.values(languageCounts).reduce((sum, c) => sum + c, 0)
    }, [languageCounts])

    const columnCount = useMemo(() => {
        return sortedLanguages.length <= 10 ? 2 : 3
    }, [sortedLanguages])

    const legendStyling = [
        "truncate",
        columnCount >= 3 ? "text-xs" : "text-sm"
    ].join(" ")

    const { currentStreak, longestStreak } = useMemo(() => {
        if (commits.length === 0) return { currentStreak: 0, longestStreak: 0 }

        const commitDates = new Set(commits.map(c => c.date))
        const sorted = [...commitDates].sort()

        let longest = 0
        let streak = 0
        for (let i = 0; i < sorted.length; i++) {
            if (i === 0) {
                streak = 1
            } else {
                const prev = new Date(sorted[i - 1].replace(/\//g, "-"))
                const curr = new Date(sorted[i].replace(/\//g, "-"))
                const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
                streak = diff === 1 ? streak + 1 : 1
            }
            longest = Math.max(longest, streak)
        }

        let current = 0
        const lastCommitDate = new Date(sorted[sorted.length - 1].replace(/\//g, "-"))
        for (let i = 0; i < 365; i++) {
            const date = new Date(lastCommitDate)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split("T")[0].replace(/-/g, "/")
            if (commitDates.has(dateStr)) {
                current++
            } else {
                break
            }
        }

        return { currentStreak: current, longestStreak: longest }
    }, [commits])

    // Derive validated selection — resets automatically when repos changes
    const validatedSelectedRepo = selectedRepo && repos.some(r => r.id === selectedRepo.id)
        ? selectedRepo
        : null

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - range)

    return (
        <CardWrapper>
            <div className="flex flex-col gap-2 h-full">
                <div className="flex flex-row gap-6">
                    <div className="flex flex-col gap-2 w-1/3">
                        <h1 className="text-2xl font-medium border-b-2 border-(--brand-secondary) pb-2">Activity:</h1>
                        <div className="flex flex-col text-sm">
                            <p>Total Commits: {totalCommits}</p>
                            <p>Total Repos: {totalRepos}</p>
                            <p>Total Forks: {totalForkedRepos}</p>
                            <p>Total Stars: {totalStars}</p>
                            <p>Current Streak: {currentStreak} days</p>
                            <p>Longest Streak: {longestStreak} days</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-2/3">
                        <h1 className="text-2xl font-medium border-b-2 border-(--brand-secondary) pb-2">Languages:</h1>
                        <div className="flex flex-row items-center gap-2">
                            <LanguagePieChart languageCounts={languageCounts} />
                            <div
                                className="grid grid-flow-col gap-x-4 gap-y-1"
                                style={{ gridTemplateRows: `repeat(${Math.ceil(sortedLanguages.length / columnCount)}, minmax(0, 1fr))` }}
                            >
                                {sortedLanguages.map(([lang, count], index) => {
                                    const percentage = Math.round((count / totalRepoCount) * 100)
                                    return (
                                        <div key={lang} className="flex flex-row items-center gap-2">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                                style={{ backgroundColor: generateColor(index, sortedLanguages.length) }}
                                            />
                                            <span className={legendStyling}>{lang} {percentage}%</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center border-b-2 border-(--brand-secondary) pb-2">
                    <h1 className="text-2xl font-medium">Commits:</h1>
                    <div className="flex flex-row gap-2">
                        {RANGES.map(r => (
                            <button
                                key={r.months}
                                onClick={() => setRange(r.months)}
                                className={`text-sm px-3 py-1 rounded-full border transition-colors duration-150 cursor-pointer
                                    ${range === r.months
                                        ? "border-(--text) bg-(--text) text-(--bg-color)"
                                        : "border-(--text) opacity-60 hover:opacity-100"
                                    }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>
                <CommitHeatMap commits={commits} startDate={startDate} />
                <h1 className="text-2xl border-b-2 border-(--brand-primary) pb-1">Repository Activities:</h1>
                <div id="repo-activities" className="flex flex-row flex-1 min-h-0 gap-2 pt-2">
                    <div
                        id="repo-table"
                        className="w-1/3 flex flex-col border-2 border-(--text) rounded-2xl overflow-y-auto pr-1"
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "var(--brand-secondary) transparent"
                        }}
                    >
                        {repos.map(repo => (
                            <div
                                key={repo.id}
                                onClick={() => setSelectedRepo(repo)}
                                className={`cursor-pointer transition-colors duration-150 ${validatedSelectedRepo?.id === repo.id ? "bg-[color-mix(in_srgb,var(--brand-primary)_15%,transparent)]" : ""}`}
                            >
                                <RepoCard repo={repo} />
                            </div>
                        ))}
                    </div>
                    <div id="repo-detailed" className="flex-1 min-h-0">
                        {validatedSelectedRepo
                            ? <RepoDetails repo={validatedSelectedRepo} />
                            : <p className="text-sm opacity-40 text-center mt-4">Choose a repository to view its details</p>
                        }
                    </div>
                </div>
            </div>
        </CardWrapper>
    )
}

export default UserStats