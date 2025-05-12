"use client";

import { useEffect, useRef } from "react";
import Message from "./message";
import { usefindMessages } from "@/hooks/use-find-messages";
import { MessageType } from "@/types";

const Messages = ({ chatId }: { chatId: string }) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const originalLength = useRef<number | null>(null);

    const { data } = usefindMessages(chatId);

    useEffect(() => {
        if (data?.messages) {
            if (originalLength.current === null) {
                // Set the original length on the first load
                // So it scrolls instantly on bottom
                originalLength.current = data.messages.length;
                bottomRef.current?.scrollIntoView({ behavior: "instant" });
            } 
            else if (data.messages.length !== originalLength.current) {
                // Smooth scroll when a new message is added
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [data?.messages]);

    return (
        <div className="flex-1 w-full min-h-0">
            <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
                {
                    data && data.messages && data.messages.map((message: MessageType) => (
                        <div
                        key={message.id}
                        className="h-full w-full snap-start flex items-center justify-center"
                    >
                        <Message message={message} messages={data.messages} />
                    </div>
                    ))
                }
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default Messages;
