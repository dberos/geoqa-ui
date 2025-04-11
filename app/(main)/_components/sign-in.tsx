"use client";

import GitHubButton from "./github-button";
import GoogleButton from "./google-button";
import { useEffect, useState } from "react";

const SignIn = ({ redirect }: { redirect?: string }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {
        if (redirect) {
            // Set in the localstorage the redirect route for the callback page
            // Since i can't add another searchParam in the OAuth link
            window.localStorage.setItem('redirect', redirect);
        }
    }, [redirect]);
    return ( 
        <div className="size-full flex items-center justify-center">
            <div 
            className="w-4/5 h-[400px] md:w-1/2 lg:h-[410px] xl:w-1/3 xl:h-[450px] 2xl:w-1/4 2xl:h-1/2 2k:h-1/3 2k:w-1/3 
            border-2 border-muted-foreground/50 dark:border-border rounded-lg flex flex-col
            ">
                <div className="w-full h-14 xl:h-24">
                    <div className="w-0.5 h-full ml-auto mr-auto bg-muted-foreground/50 dark:bg-border" />
                </div>
                <div className="size-full flex flex-col">
                    <div className="w-full h-1/2 flex items-center justify-center">
                        <h1 className="text-center text-2xl lg:text-3xl 4k:text-4xl">
                            Continue to <br />
                            <span className="text-3xl lg:text-4xl font-semibold 4k:text-5xl">
                                GeoQA
                            </span>
                        </h1>
                    </div>
                    <div className="w-full h-1/2 flex flex-col gap-y-4 lg:gap-y-6 items-center justify-start">
                    <GitHubButton isDisabled={isDisabled} setIsDisabled={setIsDisabled}/>
                    <GoogleButton isDisabled={isDisabled} setIsDisabled={setIsDisabled}/>
                    </div>
                </div>
                <div className="w-full h-14 xl:h-24">
                    <div className="w-0.5 h-full ml-auto mr-auto bg-muted-foreground/50 dark:bg-border" />
                </div>
            </div>
        </div>
    );
}
 
export default SignIn;