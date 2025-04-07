"use client";

import { useRouter } from "next/navigation";
import Authenticating from "./authenticating";
import { useEffect } from "react";
import { useSignInWithGoogle } from "@/hooks/use-sign-in";

const SignInWithGoogle = ({
    code, 
    state
}: { 
    code: string | undefined | null, 
    state: string | undefined | null 
}) => {
    
    const router = useRouter();
    
        const { mutate } = useSignInWithGoogle();
    
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
                            const redirect = window.localStorage?.getItem('redirect');
                            window.localStorage?.removeItem('redirect');
                            router.push(redirect ? redirect : '/');
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
 
export default SignInWithGoogle;