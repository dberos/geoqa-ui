import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ChatRequestType = InferRequestType<typeof client.api.messages.chat[":chatId"]["$post"]>;
type ChatResponseType = InferResponseType<typeof client.api.messages.chat[":chatId"]["$post"]>;

type MessageRequestType = InferRequestType<typeof client.api.messages[":messageId"]["$patch"]>;
type MessageResponseType = InferResponseType<typeof client.api.messages[":messageId"]["$patch"]>;

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
                    const errorResponse = await response.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
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
        MessageResponseType,
        Error,
        MessageRequestType
        >({
            mutationFn: async (args: MessageRequestType) => {
                const response = await client.api.messages[":messageId"]["$patch"](args);
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