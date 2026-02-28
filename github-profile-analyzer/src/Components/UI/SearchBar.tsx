import { useEffect, useState } from "react"
import useGitHubUser from "../../Hooks/useGitHubAPI"

interface SearchBarProps {
    variant: "default" | "navbar"
}

function SearchBar({variant} : SearchBarProps) {
    const [username, setUsername] = useState("");
    const {user, fetchUser} = useGitHubUser()

    useEffect(() => {
     console.log(user)   
    }, [user])

    const getUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!username.trim()) return;
        await fetchUser(username)
        setUsername("")
    }

    const inputStyling = [
        "border-2 border-(--text) rounded-3xl text-(--text) italic text-center font-['IBM_Plex_Mono'] outline-none",
        variant === "default"
            ? "w-full p-6 text-1xl"
            : "w-1/4 h-4 text-sm p-4 font-bold"
    ].join(" ")

    return <>
        <form onSubmit={handleSubmit}  className="w-2/3">
            <input type="text" 
                value={username}
                onChange={getUsername}
                className={inputStyling}
                placeholder="Type in your github username"
            />
            <button type="submit" className="hidden"/>
        </form>
    </>
}

export default SearchBar