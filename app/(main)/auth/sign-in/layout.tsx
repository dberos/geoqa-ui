"use client";

import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInLayout({ children }: { children: React.ReactNode }) {
    const { data } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (data?.session) {
            router.replace('/');
        }
    }, [data?.session, router])
    return (
        <section>
            {children}
        </section>
    )
}