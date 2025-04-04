"use client";

import { useEffect } from "react";
import Authenticating from "./authenticating";
import { useRouter } from "next/navigation";
import { useSignInWithGitHub } from "@/hooks/use-sign-in";

const SignInWithGitHub = ({
    code, 
    state
}: { 
    code: string | undefined | null, 
    state: string | undefined | null 
}) => {

    const router = useRouter();

    const { mutate } = useSignInWithGitHub();

    useEffect(() => {
        const handleSignIn = () => {
            // Check for search params
            if (!code || !state) {
                router.push('/error');
                return;
            }
            mutate({ json: { code, state } },
                {
                    onSuccess: () => {
                        router.push('/');
                    },
                    onError: (error) => {
                        // Error will be present from the mutation, error thrown
                        // Otherwise the c.json.. from the route handler goes on the onSuccess
                        console.error(error);
                        router.push('/error');
                    }
                }
            )
        }
        const timeoutId = setTimeout(() => {
            handleSignIn();
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [router, mutate, code, state])

    return ( 
        <Authenticating />
    );
}
 
export default SignInWithGitHub;