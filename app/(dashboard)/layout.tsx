import { Metadata } from "next";
import Navigation from "./_components/navigation";

export const metadata: Metadata = {
    title: "GeoQA | Dashboard",
    description: "GeoQA UI for the GeoQA engine",
  };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="h-screen w-full flex">
            <Navigation />
            <div className="size-full flex flex-col">
                <div className="w-full h-[10vh] 2k:h-[15vh] 4k:h-[20vh] flex items-center justify-center">
                    <div className="w-0.5 h-full bg-border" />
                </div>
                {children}
                <div className="w-full h-[10vh] 2k:h-[15vh] 4k:h-[20vh] flex items-center justify-center">
                    <div className="w-0.5 h-full bg-border" />
                </div>
            </div>
        </section>
    )
}