import 'server-only';
import { client } from "@/lib/rpc";
import { verifyJWT } from "@/lib/session";
import { cookies } from "next/headers";


export const findSession = async () => {
    // CookieStore always outside try catch to avoid build warnings
    const cookieStore = await cookies();
    try {
        let mail = null;

        const accessToken = cookieStore?.get('accessToken')?.value || "";
        const verifiedAccessToken = await verifyJWT(accessToken);
        if (verifiedAccessToken) {
            mail = verifiedAccessToken?.email;
        }
        const response = await client.api.test.hello["$get"]();
        if (!response.ok) {
            return { data: null };
        };

        const { message } = await response.json();

        return { data: mail + " " + message };
    }
    catch (error) {
        console.error(error);
        return { data: null };
    }

}