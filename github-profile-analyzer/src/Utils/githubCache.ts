import type { GitHubUser } from "../Types/GitHubUser"
import type { GitHubRepo } from "../Types/GitHubRepos"
import type { GitHubCommit } from "../Types/GitHubCommit"

const TTL_MS = 15 * 60 * 1000 // 15 minutes

interface CacheEntry {
    user: GitHubUser
    repos: GitHubRepo[]
    commits: GitHubCommit[]
    timestamp: number
}

const cache = new Map<string, CacheEntry>()

export function getCached(username: string): CacheEntry | null {
    const entry = cache.get(username.toLowerCase())
    if (!entry) return null

    const isStale = Date.now() - entry.timestamp > TTL_MS
    if (isStale) {
        cache.delete(username.toLowerCase())
        return null
    }

    return entry
}

export function setCached(
    username: string,
    user: GitHubUser,
    repos: GitHubRepo[],
    commits: GitHubCommit[]
): void {
    cache.set(username.toLowerCase(), {
        user,
        repos,
        commits,
        timestamp: Date.now()
    })
}

export function clearCache(): void {
    cache.clear()
}

export function deleteCached(username: string): void {
    cache.delete(username.toLowerCase())
}