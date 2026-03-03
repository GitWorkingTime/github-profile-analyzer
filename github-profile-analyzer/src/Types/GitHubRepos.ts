export type GitHubRepo = {
    id: number
    name: string
    size: number
    full_name: string
    description: string | null
    html_url: string
    stargazers_count: number
    forks_count: number
    language: string | null
    created_at: string
    updated_at: string
    visibility: string
}