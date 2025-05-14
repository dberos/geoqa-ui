import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type GitHubRequestType = InferRequestType<typeof client.api.auth.github.token["$post"]>;
type GitHubResponseType = InferResponseType<typeof client.api.auth["sign-in"]["$post"]>;

type GoogleRequestType = InferRequestType<typeof client.api.auth.google.token["$post"]>;
type GoogleResponseType = InferResponseType<typeof client.api.auth["sign-in"]["$post"]>;

export const useSignInWithGitHub = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        GitHubResponseType,
        Error,
        GitHubRequestType
        >({
            mutationFn: async ({ json }) => {
                // Fetch the GitHub access token
                const tokenResponse = await client.api.auth.github.token["$post"]({ json });
                if (!tokenResponse.ok) {
                    const errorResponse = await tokenResponse.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
                }

                const { accessToken } = await tokenResponse.json();

                // Fetch the GitHub user info
                const userResponse = await client.api.auth.github.user["$post"]({ json: { accessToken } });
                if (!userResponse.ok) {
                    const errorResponse = await userResponse.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
                }

                const { user } = await userResponse.json();

                // Authenticate the user
                const signInResponse = await client.api.auth["sign-in"]["$post"]({ json: { user } });
                if (!signInResponse.ok) {
                    const errorResponse = await signInResponse.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
                }
                return await signInResponse.json();
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['session'] });
            }
        })
    return mutation;
}

export const useSignInWithGoogle = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        GoogleResponseType,
        Error,
        GoogleRequestType
        >({
            mutationFn: async ({ json }) => {
                // Fetch the Google access token
                const tokenResponse = await client.api.auth.google.token["$post"]({ json });
                if (!tokenResponse.ok) {
                    const errorResponse = await tokenResponse.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
                }

                const { accessToken } = await tokenResponse.json();

                // Fetch the Google user info
                const userResponse = await client.api.auth.google.user["$post"]({ json: { accessToken } });
                if (!userResponse.ok) {
                    const errorResponse = await userResponse.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
                }

                const { user } = await userResponse.json();

                // Authenticate the user
                const signInResponse = await client.api.auth["sign-in"]["$post"]({ json: { user } });
                if (!signInResponse.ok) {
                    const errorResponse = await signInResponse.json();
                    throw new Error('error' in errorResponse ? errorResponse.error : 'Unknown error');
                }
                return await signInResponse.json();
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['session'] });
            }
        })
    return mutation;
}