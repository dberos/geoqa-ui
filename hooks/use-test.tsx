import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.test.login["$post"]>;
type RequestType = InferRequestType<typeof client.api.test.login["$post"]>;

type HelloResponseType = InferResponseType<typeof client.api.test.hello["$post"]>;
type HelloRequestType = InferRequestType<typeof client.api.test.hello["$post"]>;


export const useLogin = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({
            mutationFn: async ({ json }) => {
                const response = await client.api.test.login["$post"]({ json });
                return await response.json();
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['cookie'] });
            }
        })
    return mutation;
}

export const useHello = () => {
    const mutation = useMutation<
        HelloResponseType,
        Error,
        HelloRequestType
        >({
            mutationFn: async ({ json }) => {
                const response = await client.api.test.hello["$post"]({ json });
                return await response.json();
            },
            onSuccess: (data) => {
                // Log the data
                console.log('Response from /test/hello/', data);
            },
            onError: (data) => {
                console.log('Response from /test/hello', data);
            }
        })
    return mutation;
}

export const useCookie = () => {
    const query = useQuery({
        queryKey: ['cookie'],
        queryFn: async () => {
            const response = await client.api.test["$get"]();
            if (!response.ok) {
                return { session: null };
            };
            
            const { session } = await response.json() || null;
            
            return { session };
        },
    })
    return query;
}

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