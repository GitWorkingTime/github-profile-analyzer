import { createContext } from "react"
import type { GitHubContextType } from "../Types/GitHubContextType"

export const GitHubContext = createContext<GitHubContextType | null>(null)