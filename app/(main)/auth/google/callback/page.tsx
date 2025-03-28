import SignInWithGoogle from "@/app/(main)/_components/sign-in-with-google";

export default async function GoogleCallbackPage({
    searchParams
}: { 
    searchParams: Promise<{ [key: string]: string | undefined | null }> 
}) {
    const { code, state } = await searchParams;

    return (
        <main className="flex h-screen flex-col items-center justify-between">
            <SignInWithGoogle code={code} state={state} />
        </main>
    )
}