import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const usefindMessage = (messageId: string) => {
    const query = useQuery({
        queryKey: ['message', messageId],
        queryFn: async () => {
            const response = await client.api.messages.message[":messageId"]["$get"]({
                param: { messageId }
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