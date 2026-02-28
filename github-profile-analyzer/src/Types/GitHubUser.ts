export interface GitHubUser {
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