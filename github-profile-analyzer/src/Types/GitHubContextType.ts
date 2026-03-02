import type { GitHubUser } from "./GitHubUser"
import type { GitHubRepo } from "./GitHubRepos"

export interface GitHubContextType {
    user: GitHubUser | null
    repos: GitHubRepo[]
    loading: boolean
    error: string | null
    fetchUser: (username: string) => Promise<void>
}