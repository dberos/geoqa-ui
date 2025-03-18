import { findSession } from "@/server/test";

export default async function DashboardPage() {
    const { data } = await findSession();
    console.log(data);
    return (
        <div className="w-full h-screen flex items-center justify-center">
            Dashboard Page
        </div>
    )
}