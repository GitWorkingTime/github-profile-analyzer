import { GitHubProvider } from "./Context/GitHubProvider"
import UserPage from "./Components/Profile/UserPage"

function App() {
    return (
        <GitHubProvider>
            <UserPage />
        </GitHubProvider>
    )
}

export default App