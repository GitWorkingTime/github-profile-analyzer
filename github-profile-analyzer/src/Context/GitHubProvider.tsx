import { useState } from "react"
import { GitHubContext } from "./GitHubContext"
import type { GitHubUser } from "../Types/GitHubUser"

export function GitHubProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<GitHubUser | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUser = async (username: string): Promise<void> => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`https://api.github.com/users/${username}`)
            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`)
            }
            const data: GitHubUser = await res.json()
            setUser(data)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <GitHubContext.Provider value={{ user, loading, error, fetchUser }}>
            {children}
        </GitHubContext.Provider>
    )
}