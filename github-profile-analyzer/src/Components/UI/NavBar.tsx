import SearchBar from "./SearchBar"
import LoadingBar from "./LoadingBar"
import CompareSearchBar from "./CompareSearchBar"
import { useGitHub } from "../../Hooks/useGitHub"

function NavBar() {
    const { user, userB, refreshUser, clearUserB, comparisonMode, loading } = useGitHub()

    return (
        <div className="flex w-full h-14 px-2 items-center gap-2">
            <SearchBar variant="navbar" />
            {user && !comparisonMode && (
                <CompareSearchBar />
            )}
            {comparisonMode && userB && (
                <>
                    <span className="text-sm opacity-60">vs</span>
                    <span className="text-sm font-bold">{userB.login}</span>
                    <button
                        onClick={clearUserB}
                        className="text-sm px-3 py-1 rounded-full border border-(--text) transition-colors duration-150 cursor-pointer opacity-60 hover:opacity-100"
                    >
                        ✕ Exit
                    </button>
                </>
            )}
            {user && (
                <button
                    onClick={refreshUser}
                    disabled={loading}
                    className="text-sm px-3 py-1 rounded-full border border-(--text) transition-colors duration-150 cursor-pointer opacity-60 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    ↺ Refresh
                </button>
            )}
            {loading && <LoadingBar />}
        </div>
    )
}

export default NavBar