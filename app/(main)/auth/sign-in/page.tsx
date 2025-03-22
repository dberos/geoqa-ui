import { headers } from "next/headers";
import SignIn from "../../_components/sign-in";

export default async function SignInPage() {
    await headers();
    return (
        <main className="flex h-screen flex-col items-center justify-between">
            <div className="mt-20 h-[10vh] md:h-[20vh] 2k:h-[30vh] w-0.5 bg-muted-foreground dark:bg-muted" />
            <SignIn />
            <div className="mb-0 h-[10vh] md:h-[20vh] 2k:h-[30vh] w-0.5 bg-muted-foreground dark:bg-muted" />
        </main>
    )
}