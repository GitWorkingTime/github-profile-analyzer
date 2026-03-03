import { useState } from "react"
import { useGitHub } from "../../Hooks/useGitHub"

interface SearchBarProps {
    variant: "default" | "navbar"
}

function SearchBar({ variant }: SearchBarProps) {
    const [username, setUsername] = useState("")
    const { fetchUser } = useGitHub()

    const getUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!username.trim()) return
        await fetchUser(username)
        setUsername("")
    }

    const inputStyling = [
        "border-2 border-(--text) rounded-3xl italic text-center outline-none w-full",
        variant === "default"
            ? "p-6 text-1xl"
            : "h-4 text-sm p-4 font-bold"
    ].join(" ")

    const formStyling = [
        variant === "default"
            ? "w-2/3"
            : "w-1/4"
    ].join(" ")

    return <>
        <form onSubmit={handleSubmit} className={formStyling}>
            <input
                type="text"
                value={username}
                onChange={getUsername}
                className={inputStyling}
                placeholder="Type in your github username"
            />
            <button type="submit" className="hidden" />
        </form>
    </>
}

export default SearchBar