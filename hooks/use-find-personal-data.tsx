import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const usefindPersonalData = () => {
    const query = useQuery({
        queryKey: ['personalData'],
        queryFn: async () => {
            const response = await client.api.auth.legal["$get"]();
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
            }

            return await response.json();
        },
    });
    return query;
};