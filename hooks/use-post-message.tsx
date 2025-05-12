import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ChatRequestType = InferRequestType<typeof client.api.messages.chat[":chatId"]["$post"]>;
type ChatResponseType = InferResponseType<typeof client.api.messages.chat[":chatId"]["$post"]>;

type RequestType = InferRequestType<typeof client.api.messages[":messageId"]["$post"]>;
type ResponseType = InferResponseType<typeof client.api.messages[":messageId"]["$post"]>;

export const usePostChatMessage = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ChatResponseType,
        Error,
        ChatRequestType
        >({
            mutationFn: async ({ json, ...args }) => {
                const response = await client.api.messages.chat[":chatId"]["$post"]({ json, ...args });
                if (!response.ok) {
                    throw new Error("Failed to add a new message to chat");
                }
                return await response.json();
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['messages'] });
            }
        })
    return mutation;
}

export const usePostMessage = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({
            mutationFn: async (args: RequestType) => {
                const response = await client.api.messages[":messageId"]["$post"](args);
                if (!response.ok) {
                    throw new Error("Failed to update message");
                }
                return await response.json();
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['messages'] });
            }
        })
    return mutation;
}