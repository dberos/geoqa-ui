"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const Message = () => {
    const messageRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting && entry.intersectionRatio === 1);
            },
            {
                threshold: [0, 1],
            }
        );

        const ref = messageRef.current;
        if (ref)  observer.observe(ref);

        return () => {
            if (ref) observer.unobserve(ref);
        };
    }, []);

    return (
        <div
            ref={messageRef}
            className={cn(
                "h-96 w-4/5 md:h-80 xl:h-96 2k:h-[500px] 4k:h-[600px] 4k:w-3/5",
                "rounded-md border border-muted-foreground/50 dark:border-border transition-all duration-500",
                !isVisible && "blur-2xl"
            )}
        >
        </div>
    );
};

export default Message;
