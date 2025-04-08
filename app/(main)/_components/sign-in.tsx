"use client";

import Image from "next/image";
import logo from "../../../public/logo.svg";
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
        <div className="size-full grid grid-cols-1 grid-rows-[30%_70%]">
            <div className="flex items-center justify-center flex-col">
                <h2 className="text-3xl lg:text-4xl">
                    Continue to
                </h2>
                <h1 className="text-6xl lg:text-7xl 2k:text-8xl 4k:text-9xl font-semibold">
                    GeoQA
                </h1>
            </div>
            <div className="flex size-full items-center justify-center">
                <div className="h-4/6 w-3/4 md:w-2/4 lg:w-2/4 lg:h-9/12 xl:w-1/4 4k:w-1/6 4k:h-7/12 border-2 rounded-md grid grid-cols-1 grid-rows-[40%_60%]">
                    <div className="relative flex flex-col items-center justify-center">
                        <Image 
                        src={logo}
                        alt="GeoQA logo"
                        width={100}
                        height={100}
                        className="object-contain size-4/6"
                        />
                        <div className="absolute w-full h-0.5 bg-border bottom-0" />
                    </div>
                    <div className="flex items-center justify-center flex-col gap-y-4">
                        <GitHubButton isDisabled={isDisabled} setIsDisabled={setIsDisabled}/>
                        <GoogleButton isDisabled={isDisabled} setIsDisabled={setIsDisabled}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default SignIn;