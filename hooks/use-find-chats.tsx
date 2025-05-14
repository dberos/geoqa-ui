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
                const errorResponse = await response.json();
                throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
            }

            return await response.json();
        },
    });
    return query;
};