import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type SignOutRequestType = InferRequestType<typeof client.api.auth["sign-out"]["$post"]>;
type SignOutResponseType = InferResponseType<typeof client.api.auth["sign-out"]["$post"]>;

export const useSignOut = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        SignOutResponseType,
        Error,
        SignOutRequestType
        >({
            mutationFn: async () => {
                const response = await client.api.auth["sign-out"]["$post"]();
                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
                }
                return await response.json();
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['session'] });
            }
        })
    return mutation;
}