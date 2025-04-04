import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGis = () => {
    const query = useQuery({
        queryKey: ['gis'],
        queryFn: async () => {
            const response = await client.api.test.gis["$get"]();
            if (!response.ok) {
                return { answer: null };
            };

            const { answer } = await response.json() || null;
            return { answer };
        }
    })
    return query;
}