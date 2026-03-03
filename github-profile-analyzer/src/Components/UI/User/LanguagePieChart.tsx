import { Pie, PieChart, Cell, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { generateColor } from "../../../Utils/generateColor"

interface LanguagePieChartProps {
    languageCounts: Record<string, number>
}

function LanguagePieChart({ languageCounts }: LanguagePieChartProps) {
    const total = Object.values(languageCounts).reduce((sum, count) => sum + count, 0)

    const data = Object.entries(languageCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([language, count]) => ({
            language,
            count,
            percentage: Math.round((count / total) * 100)
        }))

    const chartConfig = data.reduce((config, { language }, index) => ({
        ...config,
        [language]: {
            label: language,
            color: generateColor(index, data.length),
        }
    }), {}) satisfies ChartConfig

    return (
        <ChartContainer config={chartConfig} className="h-35 w-35 shrink-0">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="count"
                    nameKey="language"
                    innerRadius={30}
                    outerRadius={50}
                    strokeWidth={2}
                    stroke="var(--bg-color)"
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={generateColor(index, data.length)} />
                    ))}
                </Pie>
                <Tooltip
                    content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const { language, count, percentage } = payload[0].payload
                        return (
                            <div className="border border-(--text) bg-(--bg-color) px-3 py-2 rounded-xl text-xs">
                                <p className="font-medium">{language}</p>
                                <p className="opacity-60">{count} repo{count !== 1 ? "s" : ""} — {percentage}%</p>
                            </div>
                        )
                    }}
                />
            </PieChart>
        </ChartContainer>
    )
}

export default LanguagePieChart