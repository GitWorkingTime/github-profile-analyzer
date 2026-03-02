import { useState } from "react"
import Card from "../UI/Card"
import { useGitHub } from "../../Hooks/useGitHub"
import CommitHeatMap from "../UI/User/CommitsHeatmap"

const RANGES = [
    { label: "3 Months", months: 3 },
    { label: "6 Months", months: 6 },
    { label: "1 Year", months: 12 },
]

function UserStats() {
    const { commits } = useGitHub()
    const [range, setRange] = useState(12)

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - range)

    return (
        <Card>
            <div className="flex flex-col gap-4 h-full">
                <div className="flex flex-row justify-between items-center border-b-2 border-(--secondary) pb-2">
                    <h1 className="text-2xl font-medium">Commits:</h1>
                    <div className="flex flex-row gap-2">
                        {RANGES.map(r => (
                            <button
                                key={r.months}
                                onClick={() => setRange(r.months)}
                                className={`text-sm px-3 py-1 rounded-full border transition-colors duration-150 cursor-pointer
                                    ${range === r.months
                                        ? "border-(--text) bg-(--text) text-(--bg-color)"
                                        : "border-(--text) opacity-60 hover:opacity-100"
                                    }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>
                <CommitHeatMap commits={commits} startDate={startDate} />
            </div>
        </Card>
    )
}

export default UserStats