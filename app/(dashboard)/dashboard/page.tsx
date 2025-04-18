import { headers } from "next/headers";
import NewChat from "../_components/new-chat";

export default async function DashboardPage() {
    await headers();
    return (
        <main className="size-full flex flex-col items-center justify-between">
            <NewChat />
        </main>
    )
}