import SignInWithGitHub from "@/app/(main)/_components/sign-in-with-github";

export default async function GitHubCallbackPage({searchParams}: { searchParams: Promise<{ [key: string]: string | undefined | null }> }) {
    const { code, state } = await searchParams;

    return (
        <main className="flex h-screen flex-col items-center justify-between">
            <SignInWithGitHub code={code} state={state} />
        </main>
    )
}