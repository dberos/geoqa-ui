import SignIn from "../../_components/sign-in";

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
    const { redirect } = await searchParams;
    return (
        <main className="flex h-screen flex-col items-center justify-between">
            <div className="mt-20 h-[10vh] md:h-[20vh] 2k:h-[30vh] w-0.5 bg-border" />
            <SignIn redirect={redirect} />
            <div className="mb-0 h-[10vh] md:h-[20vh] 2k:h-[30vh] w-0.5 bg-border" />
        </main>
    )
}