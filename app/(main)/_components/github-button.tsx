"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import githubIcon from "../../../public/github.svg";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateCSRFToken } from "@/lib/csrf-token";

const GitHubButton = ({
    isDisabled,
    setIsDisabled
}: {
    isDisabled: boolean,
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [isClicked, setIsClicked] = useState(false);

    const router = useRouter();

    const handleClick = async () => {
        setIsClicked(true);
        setIsDisabled(true);

        // Get the url with read only permissions, and 10m state token to match the code exp
        const githubAuthURL = 
        "https://github.com/login/oauth/authorize?" +
        "client_id=" + (process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string) +
        "&redirect_uri=" + encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL as string + "/auth/github/callback") +
        "&scope=read:user" +
        "&state=" + await generateCSRFToken('10m');
        
        setTimeout(() => {
            setIsClicked(false);
            setIsDisabled(false);

            router.push(githubAuthURL);
        }, 1000);
    }

    return ( 
        <Button 
        variant="ghost" 
        className="w-5/6 h-10 lg:h-12 2k:h-14 lg:w-4/6 flex gap-x-4 2xl:text-base border-2 2k:text-xl cursor-pointer"
        onClick={handleClick}
        disabled={isDisabled}
        >
            {
                isClicked ?
                <i>
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </i> :
                <Image 
                src={githubIcon}
                alt="GitHub logo"
                width={100}
                height={100}
                className="object-contain size-5 dark:filter dark:invert"
                />
            }
            Continue with GitHub
        </Button>
    );
}
 
export default GitHubButton;