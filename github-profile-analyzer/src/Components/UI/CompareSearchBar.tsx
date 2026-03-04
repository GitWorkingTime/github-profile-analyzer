import { useState } from "react"
import { useGitHub } from "../../Hooks/useGitHub"

function CompareSearchBar() {
    const [username, setUsername] = useState("")
    const [showError, setShowError] = useState(false)
    const { fetchUserB } = useGitHub()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
        if (showError) setShowError(false)
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!username.trim()) return
        try {
            await fetchUserB(username)
            setUsername("")
        } catch {
            setShowError(true)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                value={username}
                onChange={handleChange}
                className={`border-2 rounded-3xl italic text-center outline-none text-sm p-4 h-4 font-bold transition-colors duration-150
                    ${showError ? "border-red-500" : "border-(--text)"}`}
                placeholder="Compare with..."
            />
            <button type="submit" className="hidden" />
        </form>
    )
}

export default CompareSearchBar