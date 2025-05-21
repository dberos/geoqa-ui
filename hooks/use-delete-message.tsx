import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<typeof client.api.messages[":messageId"]["$delete"]>;
type ResponseType = InferResponseType<typeof client.api.messages[":messageId"]["$delete"]>;

export const useDeleteMessage = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({
            mutationFn: async (args: RequestType) => {
                const response = await client.api.messages[":messageId"]["$delete"](args);

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
                }
                return await response.json();
            },
            onSuccess: (data) => {
                if ('chatId' in data) {
                    queryClient.invalidateQueries({ queryKey: ['messages', data.chatId] });
                }
            }
        })
    return mutation;
}