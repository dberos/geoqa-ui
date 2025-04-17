import Messages from "@/app/(dashboard)/_components/messages";
import Searchbar from "@/app/(dashboard)/_components/searchbar";
import { authenticateSession } from "@/server/session";
import { redirect } from "next/navigation";

export default async function ChatIdPage({ params }: { params: Promise<{ chatId: string }> }) {
    await params;
    const success = await authenticateSession();
    if (!success) redirect('/');
    return (
        <main className="h-full w-full flex flex-col items-center justify-between">
            <Messages />
            <div className="w-full md:w-3/5 xl:w-2/5 4k:w-2/6 h-20 flex items-center justify-center p-8 mb-4">
                <Searchbar />
            </div>
        </main>
    )
}