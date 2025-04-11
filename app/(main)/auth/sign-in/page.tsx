import SignIn from "../../_components/sign-in";

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
    const { redirect } = await searchParams;
    return (
        <main className="flex h-screen flex-col items-center justify-between">
            <SignIn redirect={redirect} />
        </main>
    )
}