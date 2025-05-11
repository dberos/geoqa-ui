import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<typeof client.api.chats[":chatId"]["$patch"]>;
type ResponseType = InferResponseType<typeof client.api.chats[":chatId"]["$patch"]>;

export const useUpdateChat = (chatId: string) => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({
            mutationFn: async ({ json }) => {
                const response = await client.api.chats[":chatId"]["$patch"]({ 
                    json,
                    param: { chatId }
                 });
                if (!response.ok) {
                    throw new Error("Failed to update the name of the chat");
                }
                return await response.json();
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['chats'] });
            }
        })
    return mutation;
}