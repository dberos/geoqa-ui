"use client";

import {
    SearchCommand,
    SearchCommandGroup,
    SearchCommandInput,
    SearchCommandItem,
    SearchCommandList,
} from "@/components/ui/command"  
import { usePostChatMessage, usePostMessage } from "@/hooks/use-post-message";
import { usePostChat } from "@/hooks/use-post.chat";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Searchbar = () => {

    const { mutate: postChatMutate } = usePostChat();
    const { mutate: postChatMessageMutate } = usePostChatMessage();
    const { mutate: messageMutate } = usePostMessage();

    const router = useRouter();
    const pathname = usePathname();
    const isOnChatPage = pathname.startsWith("/dashboard/chats/");
    const segments = pathname.split('/');
    const chatId = segments[segments.length - 1];

    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const [isSelected, setIsSelected] = useState(false);
    const handleSelect = (text?: string) => {
        if (text) {
            setInputValue(text);
            // Loading state
            setIsSelected(true);
            // If it is the searchbar to start a new chat
            if (!isOnChatPage) {
                setTimeout(() => {
                    postChatMutate({ json: { question: text } }, 
                        {
                            onSuccess: (data) => {
                                setInputValue('');
                                setIsSelected(false);
                                // Narrow down the type for type safety
                                // It can be either { chatId, messageId } or { error }
                                // Error will be caught from !response.ok in the hook
                                // And here with onError
                                // But typescript needs to know
                                if ('chatId' in data && 'messageId' in data) {
                                    router.push(`/dashboard/chats/${data.chatId}`);
                                    setTimeout(() => {
                                        messageMutate({ param: { messageId: data.messageId } },
                                        {
                                            onError: () => {
                                                router.replace('/error');
                                            }
                                        }
                                    )
                                    }, 1000);
                                }
                                else {
                                    router.replace('/error');
                                }
                            },
                            onError: () => {
                                setInputValue('');
                                setIsSelected(false);
                                router.replace('/error');
                            }
                        }
                    )
                }, 200);
            }
            else {
                setTimeout(() => {
                    postChatMessageMutate({ json: { question: text }, param: { chatId } },
                        {
                            onSuccess: (data) => {
                                setInputValue('');
                                setIsSelected(false);
                                setTimeout(() => {
                                    // Narrow down the type for type safety
                                    // It can be either { messageId } or { error }
                                    // Error will be caught from !response.ok in the hook
                                    // And here with onError
                                    // But typescript needs to know
                                    if ('messageId' in data) {
                                        messageMutate({ param: { messageId: data.messageId } },
                                            {
                                                onError: () => {
                                                    router.replace('/error');
                                                }
                                            }
                                        )
                                    }
                                    else {
                                        router.replace('/error');
                                    }
                                    
                                }, 1000);
                            },
                            onError: () => {
                                setInputValue('');
                                setIsSelected(false);
                                router.replace('/error');
                            }
                        }
                    )
                }, 200)
            }
        }
        else {
            setInputValue('');
        }
    }

    const [isMounded, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounded) return null;

    return ( 
        <SearchCommand>
            <SearchCommandInput 
            placeholder="How may I assist you?" 
            disabled={isSelected}
            value={inputValue}
            onChangeCapture={handleInputChange}
            select={handleSelect}
            isSelected={isSelected}
            className="max-xl:text-base disabled:cursor-default"
            />
            {
                /**
                 * Use this logic to show suggestions if needed
                 * The user input command group is hidden anyway
                 * Having this group also prevents auto selecting suggestions if inluded
                 * SearchCommandGroup also has border-t
                 */
                inputValue && !isSelected &&
                <SearchCommandList className="h-auto max-h-48 overflow-y-auto">
                    <SearchCommandGroup 
                    heading="User Input" 
                    className="hidden"
                    >
                        <SearchCommandItem
                        value={inputValue}
                        className="data-[disabled]:pointer-events-auto cursor-pointer data-[disabled]:opacity-80 dark:data-[disabled]:opacity-50 max-xl:text-base"
                        onSelect={() => handleSelect(inputValue)}
                        >
                            {inputValue}
                        </SearchCommandItem>
                    </SearchCommandGroup>
                </SearchCommandList>
            }
        </SearchCommand>
    );
}
 
export default Searchbar;