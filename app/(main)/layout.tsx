import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <Navbar />
            {children}
            <Footer />
        </section>
    )
}