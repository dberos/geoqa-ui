import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NotFound() {
    const headersList = await headers();
    const pathname = headersList?.get("x-current-path") || "/";
    if (pathname.startsWith("/dashboard")) {
        redirect("/dashboard");
    } 
    else {
        redirect("/");
    }
}