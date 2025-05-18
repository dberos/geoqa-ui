"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, CustomTabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";  
import { ChevronDown, Loader2 } from "lucide-react";
import Map from "./map";
import Carousel from "./carousel";
import DataTable from "./data-table";
import Question from "./question";
import Query from "./query";
import Text from "./text";
import { MessageType } from "@/types";
import { useDeleteMessage } from "@/hooks/use-delete-message";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { useFindImages } from "@/hooks/use-find-images";
import { useParseQueryResults } from "@/hooks/use-parse-query-results";
import { useFindWkts } from "@/hooks/use-find-wkt";

const Message = ({ message }: { message: MessageType }) => {

    const { parsedResults, columns } = useParseQueryResults(message);

    const { imageUrls } = useFindImages(parsedResults);

    const { wktValues } = useFindWkts(parsedResults);

    const router = useRouter();

    const messageRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    const { mutate: deleteMessageMutate } = useDeleteMessage();

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
            observer.disconnect();
        };
    });

    const [tabValue, setTabValue] = useState("question");
    const [resultsTab, setResultsTab] = useState("");
    const [defaultTab, setDefaultTab] = useState('question');

    useEffect(() => {
        setDefaultTab(message?.question ? 'question' : 'query');
        setTabValue(message?.question ? 'question' : 'query');
    }, [message?.question]);

    useEffect(() => {
        if (!isVisible) {
            setTabValue(message?.question ? 'question' : 'query');
            setResultsTab("");
        }
    }, [isVisible, message?.question]);

    useEffect(() => {
        if (message && message.errorMessage) {
            deleteMessageMutate({ param: { messageId: message.id } },
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
                                                Failed to generate an answer for your request.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ));
                    },
                    onError: () => {
                        console.error('Error deleting message');
                        router.replace('/error');
                    }
                }
            )
        }
    }, [message, router, deleteMessageMutate]);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true) }, []);
    if (!isMounted) return null;

    return (
        <>
            {
                message.isLoading ?
                <div className="relative h-80 w-4/5 lg:h-72 xl:h-96 2k:h-[500px] 4k:h-[600px] 4k:w-3/5
                rounded-md border border-muted-foreground/50 dark:border-border transition-all duration-500 flex items-center justify-center">
                    <Loader2 className="size-10 text-muted-foreground animate-spin" />
                </div> :
                <div
                ref={messageRef}
                className={cn(
                    "relative h-80 w-4/5 lg:h-72 xl:h-96 2k:h-[500px] 4k:h-[600px] 4k:w-3/5",
                    "rounded-md border border-muted-foreground/50 dark:border-border transition-all duration-500",
                    !isVisible && "blur-xl overflow-hidden"
                )}
            >
                <Tabs 
                defaultValue={defaultTab} 
                value={tabValue} 
                onValueChange={setTabValue}
                className="size-full"
                >
                    <TabsList className="absolute -mt-[38px] max-md:left-1/2 max-md:transform max-md:-translate-x-1/2">
                        { message.question && <CustomTabsTrigger value="question">Question</CustomTabsTrigger> }
                        { message.query && <CustomTabsTrigger value="query">Query</CustomTabsTrigger> }
                        {
                            message.queryResults &&
                            <CustomTabsTrigger value="results" asChild>
                                <DropdownMenu>
                                    <DropdownMenuTrigger 
                                    className={cn(
                                        "text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-x-0.5",
                                        "rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow]",
                                        "focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50",
                                        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                                        tabValue === 'results' && 'bg-muted-foreground/20 dark:text-foreground'
                                    )}
                                    >
                                        Results
                                        <ChevronDown className="text-muted-foreground size-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()} className="z-50">
                                    {
                                        wktValues &&
                                        <DropdownMenuItem onClick={() => {
                                            setTabValue("results");
                                            setResultsTab("map");
                                        }}>
                                            Map
                                        </DropdownMenuItem>
                                    }
                                    {
                                        imageUrls &&
                                        <DropdownMenuItem disabled={!imageUrls} onClick={() => {
                                            setTabValue("results");
                                            setResultsTab("images");
                                        }}>
                                            Images
                                        </DropdownMenuItem>
                                    }
                                    <DropdownMenuItem onClick={() => {
                                        setTabValue("results");
                                        setResultsTab("table");
                                    }}>
                                        Table
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        setTabValue("results");
                                        setResultsTab("text");
                                    }}>
                                        Text
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CustomTabsTrigger>
                        }
                    </TabsList>
                    <TabsContent value="question">
                        <Question question={message.question} />
                    </TabsContent>
                    <TabsContent value="query">
                        <Query query={message.query} />
                    </TabsContent>
                    <TabsContent value="results">
                        {
                            resultsTab === "map" && 
                            <Map wktValues={wktValues} />
                        }
                        {
                            resultsTab === "images" && 
                            <Carousel imageUrls={imageUrls} />
                        }
                        {
                            resultsTab === "table" && 
                            <DataTable  columns={columns} data={parsedResults} />
                        }
                        {
                            resultsTab === "text" && 
                            <Text textualResponse={message.textualResponse}/>
                        }
                    </TabsContent>
                </Tabs>
            </div>
            }
        </>
        
        
    );
};

export default Message;
