export function formatUrl(url: string): string {
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url
    }
    return `https://${url}`
}

export function formatDomain(url: string): string {
    try {
        const fullUrl = formatUrl(url)
        return new URL(fullUrl).hostname.replace('www.', '')
    } catch {
        return url
    }
}