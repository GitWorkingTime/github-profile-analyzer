// import SearchBar from "./SearchBar"

function SearchWrapperDefault() {
    return <>
        <div id="screen_wrap" className="flex items-center justify-center h-screen">
            <div id="outline" className="w-1/3 min-w-140 h-1/4 min-h-48 border-4 shadow-[0_0_20px_2px_var(--text)] rounded-3xl p-8 flex items-center justify-center flex-col gap-4">
                <h1 className="text-(--text) font-['IBM_Plex_Mono'] text-4xl font-bold text-center">
                    <span className="text-(--primary)">Github</span> Profile Analyzer
                </h1>
                {/* <SearchBar variant="default" /> */}
            </div>
        </div> 
    </>
}

export default SearchWrapperDefault