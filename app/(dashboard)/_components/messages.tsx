"use client";

import { useEffect, useRef } from "react";
import Message from "./message";
import { usefindMessages } from "@/hooks/use-find-messages";
import { MessageType } from "@/types";
import { useRouter } from "next/navigation";
import { useDeleteChat } from "@/hooks/use-delete-chat";
import toast from 'react-hot-toast';

const Messages = ({ chatId }: { chatId: string }) => {

    const router = useRouter();

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const originalLength = useRef<number | null>(null);

    const { data, error } = usefindMessages(chatId);
    if (error) {
        console.error(error);
        router.replace('/error');
    }

    const { mutate: deleteChatMutate } = useDeleteChat();

    useEffect(() => {
        if (data?.messages) {
            if (originalLength.current === null) {
                // Set the original length on the first load
                // So it scrolls instantly on bottom
                originalLength.current = data.messages.length;
                bottomRef.current?.scrollIntoView({ behavior: "instant" });
            }
            else {
                // Smooth scroll when a new message is added
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [data?.messages]);

    useEffect(() => {
        if (data && data.messages && data?.messages.length === 0) {
            deleteChatMutate({ param: { chatId } }, 
                {
                    onSuccess: () => {
                        // Use toast.custom from react-hot-toast because nothing else works with the current CSP
                        toast.custom((t) => (
                            <div
                                className={`${
                                    t.visible ? 'animate-enter' : 'animate-leave'
                                } mb-2 mr-2 max-w-sm w-full bg-neutral-200 dark:bg-neutral-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                            >
                                <div className="flex-1 w-0 p-4">
                                    <div className="flex items-start">
                                        <div className="ml-1 flex-1">
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Empty chat was deleted.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ));
                        router.replace('/dashboard');
                    },
                    onError: () => {
                        console.error('Failed to delete chat');
                        router.replace('/error');
                    }
                }
            )
        }
        }, [data, chatId, data?.messages, deleteChatMutate, router])

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
