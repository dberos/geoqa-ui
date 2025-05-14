import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const usefindMessages = (chatId: string) => {
    const query = useQuery({
        queryKey: ['messages', chatId],
        queryFn: async () => {
            const response = await client.api.messages[":chatId"]["$get"]({
                param: { chatId }
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