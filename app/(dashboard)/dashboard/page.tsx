import { headers } from "next/headers"

export default async function DashboardPage() {
    await headers();
    return (
        <main className="flex h-screen w-full flex-col items-center justify-between">
        </main>
    )
}