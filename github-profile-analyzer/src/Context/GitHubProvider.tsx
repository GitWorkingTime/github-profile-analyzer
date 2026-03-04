import { useState } from "react"
import { GitHubContext } from "./GitHubContext"
import type { GitHubUser } from "../Types/GitHubUser"
import type { GitHubRepo } from "../Types/GitHubRepos"
import type { GitHubCommit } from "../Types/GitHubCommit"
import { getCached, setCached, deleteCached } from "../Utils/githubCache"

const GITHUB_HEADERS = {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
}

const fetchAllCommits = async (
    repoFullName: string,
    username: string,
    sinceISO: string
): Promise<{ commit: { author: { date: string } } }[]> => {
    const allCommits: { commit: { author: { date: string } } }[] = []
    let page = 1
    const CAP = 50

    while (true) {
        const res = await fetch(
            `https://api.github.com/repos/${repoFullName}/commits?author=${username}&since=${sinceISO}&per_page=100&page=${page}`,
            { headers: GITHUB_HEADERS }
        )
        if (!res.ok) {
            if (res.status === 403 || res.status === 429) {
                console.warn("GitHub API rate limit hit during commit fetch.")
            } else if (res.status === 409) {
                console.warn(`Repo "${repoFullName}" is empty, skipping commits.`)
            }
            break
        }

        const data: { commit: { author: { date: string } } }[] = await res.json()
        if (data.length === 0) break

        allCommits.push(...data)
        if (allCommits.length >= CAP || data.length < 100) break

        page++
    }

    return allCommits
}

const fetchGitHubData = async (username: string) => {
    const cached = getCached(username)
    if (cached) {
        console.log(`Cache hit for "${username}"`)
        return cached
    }

    console.log(`Cache miss for "${username}", fetching...`)

    const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers: GITHUB_HEADERS }),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers: GITHUB_HEADERS })
    ])

    if (userRes.status === 403 || userRes.status === 429) {
        console.warn("GitHub API rate limit hit.")
        throw new Error(`HTTP Error: ${userRes.status}`)
    }
    if (userRes.status === 404) {
        console.warn(`User "${username}" not found.`)
        throw new Error(`HTTP Error: ${userRes.status}`)
    }
    if (!userRes.ok) throw new Error(`HTTP Error: ${userRes.status}`)
    if (!reposRes.ok) throw new Error(`HTTP Error: ${reposRes.status}`)

    const userData: GitHubUser = await userRes.json()
    const reposData: GitHubRepo[] = await reposRes.json()

    const reposWithLanguages = await Promise.all(
        reposData.map(async (repo) => {
            if (repo.language !== null || repo.size === 0) return repo
            const langRes = await fetch(
                `https://api.github.com/repos/${repo.full_name}/languages`,
                { headers: GITHUB_HEADERS }
            )
            if (!langRes.ok) return repo
            const langData: Record<string, number> = await langRes.json()
            const primaryLanguage = Object.keys(langData)[0] ?? null
            return { ...repo, language: primaryLanguage }
        })
    )

    const since = new Date()
    since.setFullYear(since.getFullYear() - 1)
    const sinceISO = since.toISOString()
    const commitCounts: Record<string, number> = {}

    await Promise.all(
        reposData.map(async (repo) => {
            const commitData = await fetchAllCommits(repo.full_name, username, sinceISO)
            commitData.forEach(({ commit }) => {
                const date = commit.author.date.split("T")[0].replace(/-/g, "/")
                commitCounts[date] = (commitCounts[date] ?? 0) + 1
            })
        })
    )

    const commitsArray: GitHubCommit[] = Object.entries(commitCounts).map(([date, count]) => ({
        date,
        count
    }))

    setCached(username, userData, reposWithLanguages, commitsArray)

    return { user: userData, repos: reposWithLanguages, commits: commitsArray }
}

export function GitHubProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<GitHubUser | null>(null)
    const [repos, setRepos] = useState<GitHubRepo[]>([])
    const [commits, setCommits] = useState<GitHubCommit[]>([])
    const [userB, setUserB] = useState<GitHubUser | null>(null)
    const [reposB, setReposB] = useState<GitHubRepo[]>([])
    const [commitsB, setCommitsB] = useState<GitHubCommit[]>([])
    const [comparisonMode, setComparisonMode] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUser = async (username: string): Promise<void> => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchGitHubData(username)
            setUser(data.user)
            setRepos(data.repos)
            setCommits(data.commits)
        } catch (err) {
            if (err instanceof Error) setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const fetchUserB = async (username: string): Promise<void> => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchGitHubData(username)
            setUserB(data.user)
            setReposB(data.repos)
            setCommitsB(data.commits)
            setComparisonMode(true)
        } catch (err) {
            if (err instanceof Error) setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const clearUserB = (): void => {
        setUserB(null)
        setReposB([])
        setCommitsB([])
        setComparisonMode(false)
    }

    const refreshUser = async (): Promise<void> => {
        if (!user) return
        deleteCached(user.login)
        console.log(`Cache cleared for "${user.login}", refreshing...`)
        await fetchUser(user.login)
    }

    return (
        <GitHubContext.Provider value={{
            user, repos, commits,
            userB, reposB, commitsB,
            comparisonMode,
            loading, error,
            fetchUser, fetchUserB, clearUserB, refreshUser
        }}>
            {children}
        </GitHubContext.Provider>
    )
}