import Footer from "./_components/footer";
import NavBar from "./_components/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <NavBar />
            {children}
            <Footer />
        </section>
    )
}