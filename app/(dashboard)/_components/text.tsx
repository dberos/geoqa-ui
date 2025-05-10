"use client";

import { cn } from "@/lib/utils";
import { MessageSquareText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Text = ({ textualResponse }: { textualResponse: string | undefined | null }) => {
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const el = paragraphRef.current;
        if (el) {
            setIsOverflowing(el.scrollHeight > el.clientHeight);
        }
    }, []);
    return ( 
        <div 
        className={cn(
        "size-full rounded-md grid grid-cols-1 grid-rows-[60%_40%] 2xl:grid-rows-1 2xl:grid-cols-[70%_30%]",
        isOverflowing && "2xl:grid-cols-2"
        )}>
            <div 
            className={cn(
                "size-full flex items-center justify-center p-4 lg:p-6",
                isOverflowing && "p-0 lg:p-0"
            )}
            >
                <p
                ref={paragraphRef}
                className={cn(
                    "text-center md:pr-4 text-lg 2xl:text-2xl 2k:text-3xl 4k:text-4xl 2k:leading-10 4k:leading-12 font-semibold overflow-y-auto break-words max-h-44 2xl:max-h-72 2k:max-h-80 4k:max-h-96 lg:max-w-4/5 2xl:max-w-3xl 4k:max-w-5xl",
                    isOverflowing && "px-4"
                )}
                >
                    {textualResponse}
                </p>
            </div>
            <div className="size-full flex items-center justify-center">
                <MessageSquareText className="size-14 md:size-18 2xl:size-20 2k:size-24 4k:size-28" />
            </div>
        </div>
    );
}
 
export default Text;