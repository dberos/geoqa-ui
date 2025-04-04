import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
    const query = useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const response = await client.api.auth["$get"]();
            if (!response.ok) {
                return { session: null };
            };
            
            const { session } = await response.json();
            
            return { session };
        },
    })
    return query;
}