import SignInWithGoogle from "@/app/(main)/_components/sign-in-with-google";
import { headers } from "next/headers";

export default async function GoogleCallbackPage() {
    await headers();

    return (
        <main className="flex h-screen flex-col items-center justify-between">
            <SignInWithGoogle />
        </main>
    )
}