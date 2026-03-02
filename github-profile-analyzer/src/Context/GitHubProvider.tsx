import { useState } from "react"
import { GitHubContext } from "./GitHubContext"
import type { GitHubUser } from "../Types/GitHubUser"
import type { GitHubRepo } from "../Types/GitHubRepos"

export function GitHubProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<GitHubUser | null>(null)
    const [repos, setRepos] = useState<GitHubRepo[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUser = async (username: string): Promise<void> => {
        setLoading(true)
        setError(null)
        setRepos([])
        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
            ])
            if (!userRes.ok) throw new Error(`HTTP Error: ${userRes.status}`)
            if (!reposRes.ok) throw new Error(`HTTP Error: ${reposRes.status}`)

            const userData: GitHubUser = await userRes.json()
            const reposData: GitHubRepo[] = await reposRes.json()

            const reposWithLanguages = await Promise.all(
                reposData.map(async (repo) => {
                    if (repo.language !== null || repo.size === 0) return repo

                    const langRes = await fetch(`https://api.github.com/repos/${repo.full_name}/languages`)
                    if (!langRes.ok) return repo

                    const langData: Record<string, number> = await langRes.json()
                    const primaryLanguage = Object.keys(langData)[0] ?? null

                    return { ...repo, language: primaryLanguage }
                })
            )

            setUser(userData)
            setRepos(reposWithLanguages)
        } catch (err) {
            if (err instanceof Error) setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <GitHubContext.Provider value={{ user, repos, loading, error, fetchUser }}>
            {children}
        </GitHubContext.Provider>
    )
}