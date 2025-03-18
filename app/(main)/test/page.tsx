import { headers } from "next/headers";
import FormComponent from "./_components/form-component";

export default async function TestPage() {
    await headers();
    return (
        <main className="h-screen w-full flex items-center justify-center">
            <FormComponent />
        </main>
    )
}