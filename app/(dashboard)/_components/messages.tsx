"use client";

import { useEffect, useRef } from "react";
import Message from "./message";
import { usefindMessages } from "@/hooks/use-find-messages";
import { MessageType } from "@/types";

const Messages = ({ chatId }: { chatId: string }) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }, []);

    const { data } = usefindMessages(chatId);

    return (
        <div className="flex-1 w-full min-h-0">
            <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
                {
                    data && data.messages && data.messages.map((message: MessageType) => (
                        <div
                        key={message.id}
                        className="h-full w-full snap-start flex items-center justify-center"
                    >
                        <Message message={message}/>
                    </div>
                    ))
                }
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default Messages;
