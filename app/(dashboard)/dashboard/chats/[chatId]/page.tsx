import Messages from "@/app/(dashboard)/_components/messages";
import Searchbar from "@/app/(dashboard)/_components/searchbar";
import { redirect } from "next/navigation";

// TODO: Make sure chat exists and belongs to current user

export default async function ChatIdPage({ params }: { params: Promise<{ chatId: string }> }) {
    const { chatId } = await params;
    if (!chatId) redirect('/dashboard');
    return (
        <main className="h-full w-full flex flex-col items-center justify-between">
            <Messages chatId={chatId} />
            <div className="w-full md:w-3/5 xl:w-2/5 4k:w-2/6 h-20 flex items-center justify-center p-8 mb-4">
                <Searchbar />
            </div>
        </main>
    )
}