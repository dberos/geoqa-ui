import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<typeof client.api.chats["$post"]>;
type ResponseType = InferResponseType<typeof client.api.chats["$post"]>;

export const usePostChat = () => {
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({
            mutationFn: async ({ json }) => {
                const response = await client.api.chats["$post"]({ json });
                if (!response.ok) {
                    throw new Error("Failed to create a new chat");
                }
                return await response.json();
            },
        })
    return mutation;
}