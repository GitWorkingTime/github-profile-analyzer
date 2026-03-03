export interface GitHubRepoDetails {
    languages: Record<string, number>
    contributors: { login: string; contributions: number; avatar_url: string }[]
    readme: string | null
}