import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type GitHubRequestType = InferRequestType<typeof client.api.auth.github["$post"]>;
type GitHubResponseType = InferResponseType<typeof client.api.auth.github["$post"]>;

type GoogleRequestType = InferRequestType<typeof client.api.auth.google["$post"]>;
type GoogleResponseType = InferResponseType<typeof client.api.auth.google["$post"]>;

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

export const useSignInWithGoogle = () => {
    const mutation = useMutation<
        GoogleResponseType,
        Error,
        GoogleRequestType
        >({
            mutationFn: async ({ json }) => {
                const response = await client.api.auth.google["$post"]({ json });
                if (!response.ok) {
                    throw new Error(`Failed to sign in with Google: ${response.statusText}`);
                }
                return await response.json();
            }
        })
    return mutation;
}