import { headers } from "next/headers";
import ErrorComponent from "../_components/error-component";

export default async function ErrorPage() {
    await headers();

    return (
        <main className="flex h-screen flex-col items-center justify-between">
            <ErrorComponent />
        </main>
    )
}