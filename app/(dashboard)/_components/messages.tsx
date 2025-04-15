"use client";

import { useEffect, useRef } from "react";
import Message from "./message";

const Messages = () => {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }, []);

    return (
        <div className="flex-1 w-full min-h-0">
            <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-full w-full snap-start flex items-center justify-center"
                    >
                        <Message />
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default Messages;
