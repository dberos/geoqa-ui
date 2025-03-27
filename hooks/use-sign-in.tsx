import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type GitHubRequestType = InferRequestType<typeof client.api.auth.github["$post"]>;
type GitHubResponseType = InferResponseType<typeof client.api.auth.github["$post"]>;

export const useSignInWithGitHub = () => {
    const mutation = useMutation<
        GitHubResponseType,
        Error,
        GitHubRequestType
        >({
            mutationFn: async ({ json }) => {
                const response = await client.api.auth.github["$post"]({ json });
                if (!response.ok) {
                    throw new Error(`Failed to sign in with GitHub: ${response.statusText}`);
                }
                return await response.json();
            }
        })
    return mutation;
}