import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<typeof client.api.messages[":messageId"]["$post"]>;
type ResponseType = InferResponseType<typeof client.api.messages[":messageId"]["$post"]>;

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
                queryClient.invalidateQueries({ queryKey: ['messages'] })
            }
        })
    return mutation;
}