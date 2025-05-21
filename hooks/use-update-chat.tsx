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
                    const errorResponse = await response.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
                }
                return await response.json();
            },
            onSuccess: (data) => {
                if ('userId' in data) {
                    queryClient.invalidateQueries({ queryKey: ['chats', data.userId] });
                }
            }
        })
    return mutation;
}