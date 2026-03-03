export const generateColor = (index: number, total: number) => {
    const hue = (index / total) * 360
    return `hsl(${hue}, 70%, 60%)`
}