import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<typeof client.api.auth["delete-user"][":userId"]["$delete"]>;
type ResponseType = InferResponseType<typeof client.api.auth["delete-user"][":userId"]["$delete"]>;

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({
            mutationFn: async (args: RequestType) => {
                const response = await client.api.auth["delete-user"][":userId"]["$delete"](args);
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