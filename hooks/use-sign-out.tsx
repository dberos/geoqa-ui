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
                    throw new Error(`Failed to sign out: ${response.statusText}`);
                }
                return await response.json();
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['session'] });
            },
            onError: (error) => {
                console.error("Error signing out:", error);
                queryClient.invalidateQueries({ queryKey: ['session'] });
            },
        })
    return mutation;
}