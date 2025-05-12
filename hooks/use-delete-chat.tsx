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
                    throw new Error("Failed to delete chat");
                }
                return await response.json();
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['chats'] });
            }
        })
    return mutation;
}