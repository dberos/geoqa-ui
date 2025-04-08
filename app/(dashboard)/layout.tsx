import Navigation from "./_components/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="h-screen w-full flex ">
            <Navigation />
            <div className="size-full flex flex-col">
                <div className="w-full h-[10vh] md:h-[20vh] 4k:h-[30vh] flex items-center justify-center">
                    <div className="w-0.5 h-full bg-neutral-300 dark:bg-muted" />
                </div>
                {children}
                <div className="w-full h-[10vh] md:h-[20vh] 4k:h-[30vh] flex items-center justify-center">
                    <div className="w-0.5 h-full bg-neutral-300 dark:bg-muted" />
                </div>
            </div>
        </section>
    )
}