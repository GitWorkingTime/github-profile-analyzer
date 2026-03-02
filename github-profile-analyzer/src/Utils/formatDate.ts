export function formatDate(isoString: string): string {
    const date = new Date(isoString)
    const pad = (n: number) => n.toString().padStart(2, "0")

    const mm = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const yyyy = date.getFullYear()

    const rawHours = date.getHours()
    const ampm = rawHours >= 12 ? "PM" : "AM"
    const hh = pad(rawHours % 12 || 12)
    const min = pad(date.getMinutes())
    const ss = pad(date.getSeconds())

    return `${mm}/${dd}/${yyyy} @ ${hh}:${min}:${ss} ${ampm}`
}