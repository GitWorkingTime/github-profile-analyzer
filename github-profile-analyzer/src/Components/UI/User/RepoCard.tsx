import type { GitHubRepo } from "../../../Types/GitHubRepos"

function RepoCard({ repo }: { repo: GitHubRepo }) {
    return (
        <div key={repo.id} className="flex flex-col p-3 pr-2 border-b border-(--text) last:border-0 gap-1 hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] transition-colors duration-150">
            <div className="flex flex-row justify-between items-center gap-2">
                <a href={repo.html_url} target="_blank" rel="noreferrer" className="underline font-medium">
                    {repo.name}
                </a>
                <span className="text-sm opacity-80">
                    {repo.language ?? (repo.size === 0 ? "Empty" : "Unknown")}
                </span>
            </div>
            <div>
                <span className="text-sm opacity-50">{repo.description ?? "No Description Provided"}</span>
            </div>
        </div>
    )
}

export default RepoCard