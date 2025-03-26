"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import googleIcon from "../../../public/google.svg";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const GoogleButton = ({
    isDisabled,
    setIsDisabled
}: {
    isDisabled: boolean,
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [isClicked, setIsClicked] = useState(false);

    const router = useRouter();
    
    const handleClick = () => {
        setIsClicked(true);
        setIsDisabled(true);

        setTimeout(() => {
            setIsClicked(false);
            setIsDisabled(false);
            router.push('/auth/google/callback');
        }, 1000);
    }

    return ( 
        <Button 
        variant="ghost" 
        className="w-5/6 h-10 lg:h-12 2k:h-14 lg:w-4/6 flex gap-x-4 2xl:text-base border-2 border-muted-foreground dark:border-muted 2k:text-xl cursor-pointer"
        onClick={handleClick}
        disabled={isDisabled}
        >
            {
                isClicked ?
                <i>
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </i> :
                <Image 
                src={googleIcon}
                alt="Google logo"
                width={100}
                height={100}
                className="object-contain size-5"
                />
            }
            Continue with Google
        </Button>
    );
}
 
export default GoogleButton;