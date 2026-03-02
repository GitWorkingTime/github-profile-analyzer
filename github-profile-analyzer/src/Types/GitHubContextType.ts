import type { GitHubUser } from "./GitHubUser"
import type { GitHubRepo } from "./GitHubRepos"
import type { GitHubCommit } from "./GitHubCommit"

export interface GitHubContextType {
    user: GitHubUser | null
    repos: GitHubRepo[]
    loading: boolean
    error: string | null
    commits: GitHubCommit[]
    fetchUser: (username: string) => Promise<void>
}