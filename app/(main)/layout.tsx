import { ThemeToggle } from "@/components/theme-toggle";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <nav className="w-full h-24 bg-neutral-400 dark:bg-neutral-700 flex items-center justify-center">
                <ThemeToggle />
            </nav>
            {children}
        </section>
    )
}