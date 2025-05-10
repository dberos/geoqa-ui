import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const usefindMessages = (chatId: string) => {
    const query = useQuery({
        queryKey: ['messages', chatId],
        queryFn: async () => {
            const response = await client.api.chats[":chatId"]["$get"]({
                param: { chatId },
            });
            if (!response.ok) {
                return { messages: null };
            }

            const { messages } = await response.json() || null;
            return { messages };
        },
    });
    return query;
};