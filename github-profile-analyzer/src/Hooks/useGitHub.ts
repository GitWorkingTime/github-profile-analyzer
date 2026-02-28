import { useContext } from "react"
import { GitHubContext } from "../Context/GitHubContext"
import type { GitHubContextType } from "../Types/GitHubContextType"

export function useGitHub(): GitHubContextType {
    const context = useContext(GitHubContext)
    if (!context) {
        throw new Error("useGitHub must be used within a GitHubProvider")
    }
    return context
}