import { useState } from "react"

interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  company: string | null
  location: string | null
  blog: string | null
}

interface UseGitHubUserReturn {
  user: GitHubUser | null
  loading: boolean
  error: string | null
  fetchUser: (username: string) => Promise<void>
}

function useGitHubUser(): UseGitHubUserReturn {
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

  return { user, loading, error, fetchUser }
}

export default useGitHubUser