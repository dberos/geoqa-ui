import { headers } from "next/headers"
import NewChat from "../_components/new-chat";

export default async function DashboardPage() {
    await headers();
    return (
        <main className="flex h-screen w-full flex-col items-center justify-between">
            <NewChat />
        </main>
    )
}