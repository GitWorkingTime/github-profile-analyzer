import { useEffect, useState } from "react"
import useGitHubUser from "../../Hooks/useGitHubAPI"

function SearchBar() {
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
    
    return <>
        <form onSubmit={handleSubmit}  className="w-2/3">
            <input type="text" 
                value={username}
                onChange={getUsername}
                className="border-2 border-(--text) w-full rounded-3xl p-6 text-(--text) italic text-center text-1xl font-['IBM_Plex_Mono'] outline-none"
                placeholder="Type in your github username"
            />
            <button type="submit" className="hidden"/>
        </form>
    </>
}

export default SearchBar