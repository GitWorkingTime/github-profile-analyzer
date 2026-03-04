export type CompareResult = "higher" | "lower" | "equal"

export function compareValues(a: number, b: number): CompareResult {
    if (a > b) return "higher"
    if (a < b) return "lower"
    return "equal"
}

export function getCompareStyle(result: CompareResult): string {
    if (result === "higher") return "text-(--brand-primary) font-medium"
    if (result === "lower") return "opacity-40"
    return ""
}