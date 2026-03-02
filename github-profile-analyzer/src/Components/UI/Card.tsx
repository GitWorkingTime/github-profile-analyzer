function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full border-2 border-(--text) rounded-4xl p-4 flex flex-col min-w-0">
            {children}
        </div>
    )
}

export default Card