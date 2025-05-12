import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const usefindChats = (userId: string | null | undefined) => {
    const query = useQuery({
        queryKey: ['chats', userId],
        queryFn: async () => {
            if (!userId) {
                // When page reloads
                return { chats: null };
            }
            const response = await client.api.chats.user[":userId"]["$get"]({
                param: { userId }
            });
            if (!response.ok) {
                return { chats: null };
            }

            const { chats } = await response.json() || null;
            return { chats };
        },
    });
    return query;
};