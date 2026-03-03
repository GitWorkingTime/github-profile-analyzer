import { useGitHub } from "../../Hooks/useGitHub"

function LoadingBar() {
    const { loading } = useGitHub()

    if (!loading) return null

    return (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-(--bg-color) overflow-hidden rounded-full">
            <div
                className="h-full bg-(--brand-primary) rounded-full"
                style={{
                    animation: "loadingBar 1.5s ease-in-out infinite",
                }}
            />
        </div>
    )
}

export default LoadingBar