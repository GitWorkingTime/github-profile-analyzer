import type { GitHubUser } from "./GitHubUser"

export interface GitHubContextType {
    user: GitHubUser | null
    loading: boolean
    error: string | null
    fetchUser: (username: string) => Promise<void>
}