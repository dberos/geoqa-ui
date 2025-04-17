import NewChat from "../_components/new-chat";
import { authenticateSession } from "@/server/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const success = await authenticateSession();
    if (!success) redirect('/');
    return (
        <main className="size-full flex flex-col items-center justify-between">
            <NewChat />
        </main>
    )
}