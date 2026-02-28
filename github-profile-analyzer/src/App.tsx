import { GitHubProvider } from "./Context/GitHubProvider"
import NavBar from "./Components/UI/NavBar"
import UserPage from "./Components/Profile/UserPage"

function App() {
    return (
        <GitHubProvider>
            <div className="bg-(--bg-color) h-screen flex flex-col overflow-hidden">
                <NavBar />
                <UserPage />
            </div>
        </GitHubProvider>
    )
}

export default App