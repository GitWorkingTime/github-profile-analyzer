import type { GitHubUser } from "./GitHubUser"
import type { GitHubRepo } from "./GitHubRepos"
import type { GitHubCommit } from "./GitHubCommit"

export interface GitHubContextType {
    user: GitHubUser | null
    repos: GitHubRepo[]
    commits: GitHubCommit[]
    userB: GitHubUser | null
    reposB: GitHubRepo[]
    commitsB: GitHubCommit[]
    comparisonMode: boolean
    loading: boolean
    error: string | null
    fetchUser: (username: string) => Promise<void>
    fetchUserB: (username: string) => Promise<void>
    clearUserB: () => void
    refreshUser: () => Promise<void>
}