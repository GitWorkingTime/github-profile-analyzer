import { useEffect, useState } from "react"
import type { GitHubRepo } from "../../../Types/GitHubRepos"
import type { GitHubRepoDetails } from "../../../Types/GitHubRepoDetails"
import { generateColor } from "../../../Utils/generateColor"

interface RepoDetailsProps {
    repo: GitHubRepo
}

const GITHUB_HEADERS = {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
}

function RepoDetails({ repo }: RepoDetailsProps) {
    const [details, setDetails] = useState<GitHubRepoDetails | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true)
            setDetails(null)
            try {
                const [langRes, contribRes, readmeRes] = await Promise.all([
                    fetch(`https://api.github.com/repos/${repo.full_name}/languages`, { headers: GITHUB_HEADERS }),
                    fetch(`https://api.github.com/repos/${repo.full_name}/contributors?per_page=5`, { headers: GITHUB_HEADERS }),
                    fetch(`https://api.github.com/repos/${repo.full_name}/readme`, { headers: GITHUB_HEADERS }),
                ])

                const languages: Record<string, number> = langRes.ok ? await langRes.json() : {}
                const contributors = contribRes.ok ? await contribRes.json() : []
                let readme: string | null = null

                if (readmeRes.ok) {
                    const readmeData = await readmeRes.json()
                    readme = atob(readmeData.content.replace(/\n/g, ""))
                }

                setDetails({ languages, contributors, readme })
            } catch (err) {
                console.error("Failed to fetch repo details", err)
            } finally {
                setLoading(false)
            }
        }

        fetchDetails()
    }, [repo.full_name])

    const totalBytes = details ? Object.values(details.languages).reduce((sum, b) => sum + b, 0) : 0

    return (
        <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1 animate-fade-in"
            style={{
                animation: "fadeIn 0.3s ease-in-out",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--brand-secondary) transparent"
            }}
        >
            {/* Title */}
            <div className="border-b-2 border-(--brand-secondary) pb-2">
                <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-xl font-medium underline">
                    {repo.name}
                </a>
                <p className="text-sm opacity-60 mt-1">{repo.description ?? "No description provided"}</p>
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-1 text-sm">
                <p>Created: {new Date(repo.created_at).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
                <p>Stars: {repo.stargazers_count}</p>
                <p>Forks: {repo.forks_count}</p>
                <p>Visibility: {repo.visibility}</p>
            </div>

            {loading && <p className="text-sm opacity-60">Loading details...</p>}

            {/* Languages */}
            {details && Object.keys(details.languages).length > 0 && (
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium border-b border-(--brand-primary) pb-1">Languages:</p>
                    {Object.entries(details.languages)
                        .sort(([, a], [, b]) => b - a)
                        .map(([lang, bytes], index, arr) => (
                            <div key={lang} className="flex flex-row items-center gap-2 text-xs">
                                <div
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: generateColor(index, arr.length) }}
                                />
                                <span>{lang}</span>
                                <span className="opacity-60 ml-auto">{Math.round((bytes / totalBytes) * 100)}%</span>
                            </div>
                        ))
                    }
                </div>
            )}

            {/* Contributors */}
            {details && details.contributors.length > 0 && (
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium border-b border-(--brand-primary) pb-1">Top Contributors:</p>
                    {details.contributors.map(contributor => (
                        <div key={contributor.login} className="flex flex-row items-center gap-2 text-xs">
                            <img
                                src={contributor.avatar_url}
                                alt={contributor.login}
                                className="w-5 h-5 rounded-full"
                            />
                            <span>{contributor.login}</span>
                            <span className="opacity-60 ml-auto">{contributor.contributions} commits</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Readme */}
            {details?.readme && (
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium border-b border-(--brand-primary) pb-1">README:</p>
                    <pre className="text-xs opacity-70 whitespace-pre-wrap wrap-break-words">
                        {details.readme.slice(0, 500)}{details.readme.length > 500 ? "..." : ""}
                    </pre>
                </div>
            )}
        </div>
    )
}

export default RepoDetails