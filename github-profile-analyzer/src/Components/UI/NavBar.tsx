import SearchBar from "./SearchBar"

function NavBar() {
    return <>
        <div id="container" className="flex w-full h-14 px-2 items-center">
            <SearchBar variant="navbar" />
        </div>
    
    </>
}

export default NavBar