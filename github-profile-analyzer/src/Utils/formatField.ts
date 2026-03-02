export function formatField(value: string | null, fallback: string = "Not Provided" ) {
    return value ?? fallback;
}