import SignInWithGitHub from "@/app/(main)/_components/sign-in-with-github";
import { headers } from "next/headers";

export default async function GitHubCallbackPage() {
    await headers();

    return (
        <main className="flex h-screen flex-col items-center justify-between">
            <SignInWithGitHub />
        </main>
    )
}