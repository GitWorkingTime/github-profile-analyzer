import { useMemo } from "react"
import LanguagePieChart from "./LanguagePieChart"
import { generateColor } from "../../../Utils/generateColor"
import type { GitHubRepo } from "../../../Types/GitHubRepos"

interface LanguageDistributionProps {
    repos: GitHubRepo[]
    columnCount?: number
}

function LanguageDistribution({ repos, columnCount: columnCountOverride }: LanguageDistributionProps) {
    const languageCounts = useMemo(() => {
        const counts: Record<string, number> = {}
        for (const repo of repos) {
            if (repo.language) {
                counts[repo.language] = (counts[repo.language] ?? 0) + 1
            }
        }
        return counts
    }, [repos])

    const sortedLanguages = useMemo(() => {
        return Object.entries(languageCounts).sort(([, a], [, b]) => b - a)
    }, [languageCounts])

    const totalRepoCount = useMemo(() => {
        return Object.values(languageCounts).reduce((sum, c) => sum + c, 0)
    }, [languageCounts])

    const columnCount = useMemo(() => {
        if (columnCountOverride) return columnCountOverride
        return sortedLanguages.length <= 10 ? 2 : 3
    }, [sortedLanguages, columnCountOverride])

    const legendStyling = ["truncate", columnCount >= 3 ? "text-xs" : "text-sm"].join(" ")

    return (
        <div className="flex flex-row items-center gap-2">
            <LanguagePieChart languageCounts={languageCounts} />
            <div
                className="grid grid-flow-col gap-x-4 gap-y-1"
                style={{ gridTemplateRows: `repeat(${Math.ceil(sortedLanguages.length / columnCount)}, minmax(0, 1fr))` }}
            >
                {sortedLanguages.map(([lang, count], index) => {
                    const percentage = Math.round((count / totalRepoCount) * 100)
                    return (
                        <div key={lang} className="flex flex-row items-center gap-2">
                            <div
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: generateColor(index, sortedLanguages.length) }}
                            />
                            <span className={legendStyling}>{lang} {percentage}%</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default LanguageDistribution