import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ChatsPage() {
    await headers();
    redirect('/dashboard');
}