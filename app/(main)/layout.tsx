import NavBar from "./_components/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <NavBar />
            {children}
        </section>
    )
}