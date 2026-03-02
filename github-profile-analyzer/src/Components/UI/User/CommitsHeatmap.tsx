import { useState } from "react"
import HeatMap from "@uiw/react-heat-map"
import type { GitHubCommit } from "../../../Types/GitHubCommit"

interface CommitHeatMapProps {
    commits: GitHubCommit[]
    startDate: Date
}

function CommitHeatMap({ commits, startDate }: CommitHeatMapProps) {
    const [tooltip, setTooltip] = useState<{ date: string, count: number, x: number, y: number } | null>(null)

    return (
        <div className="relative heatmap-container">
            <HeatMap
                rectSize={13}
                space={2}
                value={commits}
                startDate={startDate}
                endDate={new Date()}
                weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                panelColors={{
                    0: 'color-mix(in srgb, var(--secondary) 15%, transparent)',
                    2: 'color-mix(in srgb, var(--secondary) 35%, transparent)',
                    5: 'color-mix(in srgb, var(--secondary) 55%, transparent)',
                    10: 'color-mix(in srgb, var(--secondary) 75%, transparent)',
                    15: 'var(--secondary)',
                }}
                style={{ color: 'var(--text)' } as React.CSSProperties}
                rectProps={{ rx: 2 }}
                rectRender={(props, data) => (
                    <rect
                        {...props}
                        onMouseEnter={(e) => setTooltip({
                            date: data.date,
                            count: data.count || 0,
                            x: e.clientX,
                            y: e.clientY,
                        })}
                        onMouseLeave={() => setTooltip(null)}
                    />
                )}
            />
            {tooltip && (
                <div
                    className="fixed z-50 px-2 py-1 text-xs rounded border border-(--text) bg-(--bg-color) pointer-events-none"
                    style={{ left: tooltip.x + 10, top: tooltip.y - 30 }}
                >
                    {tooltip.date} — {tooltip.count} commit{tooltip.count !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    )
}

export default CommitHeatMap