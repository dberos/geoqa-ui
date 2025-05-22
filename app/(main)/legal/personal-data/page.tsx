import { headers } from "next/headers";
import PersonalData from "../../_components/personal-data";

export default async function PersonalDataPage() {
    await headers();
    return (
        <main className="flex h-screen flex-col items-center justify-center">
            <PersonalData />
        </main>
    )
}