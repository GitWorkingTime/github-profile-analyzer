import type { GitHubUser } from "./GitHubUser"
import type { GitHubRepo } from "./GitHubRepos"
import type { GitHubCommit } from "./GitHubCommit"

export interface GitHubContextType {
    user: GitHubUser | null
    repos: GitHubRepo[]
    commits: GitHubCommit[]
    loading: boolean
    error: string | null
    fetchUser: (username: string) => Promise<void>
    refreshUser: () => Promise<void>
}