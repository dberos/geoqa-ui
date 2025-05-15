import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<typeof client.api.chats[":chatId"]["$delete"]>;
type ResponseType = InferResponseType<typeof client.api.chats[":chatId"]["$delete"]>;

export const useDeleteChat = (chatId: string) => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({
            mutationFn: async () => {
                const response = await client.api.chats[":chatId"]["$delete"]({
                    param: { chatId }
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
                }
                return await response.json();
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['chats'] });
            }
        })
    return mutation;
}