import { Metadata } from "next";

export const metadata: Metadata = {
    title: "GeoQA | Sign In",
    description: "GeoQA UI for the GeoQA engine",
  };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            {children}
        </section>
    )
}