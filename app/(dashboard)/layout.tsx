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
                <div className="w-full h-[10vh] 4k:h-[15vh] flex items-center justify-center">
                    <div className="w-0.5 h-full bg-muted-foreground/50 dark:bg-border" />
                </div>
                <div className="flex-1 overflow-hidden">
                    {children}
                </div>
                <div className="w-full h-[10vh] 4k:h-[15vh] flex items-center justify-center">
                    <div className="w-0.5 h-full bg-muted-foreground/50 dark:bg-border" />
                </div>
            </div>
        </section>
    )
}