import { authenticateSession } from "@/server/session";
import { redirect } from "next/navigation";

export default async function ChatsPage() {
    const success = await authenticateSession();
    if (!success) redirect('/');
    redirect('/dashboard');
}