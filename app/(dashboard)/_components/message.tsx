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
import { ChevronDown } from "lucide-react";
import Map from "./map";
import Carousel from "./carousel";
import DataTable from "./data-table";
import { columns, results } from "../_data";
import Question from "./question";

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

    const [tabValue, setTabValue] = useState("question");
    const [resultsTab, setResultsTab] = useState("");

    useEffect(() => {
        if (!isVisible) {
            setTabValue("question");
            setResultsTab("");
        }
    }, [isVisible]);

    return (
        <div
            ref={messageRef}
            className={cn(
                "relative h-80 w-4/5 lg:h-72 xl:h-96 2k:h-[500px] 4k:h-[600px] 4k:w-3/5",
                "rounded-md border border-muted-foreground/50 dark:border-border transition-all duration-500",
                !isVisible && "blur-xl overflow-hidden"
            )}
        >
            <Tabs 
            defaultValue="question" 
            value={tabValue} 
            onValueChange={setTabValue}
            className="size-full"
            >
                <TabsList className="absolute -mt-[38px] max-md:left-1/2 max-md:transform max-md:-translate-x-1/2">
                    <CustomTabsTrigger value="question">Question</CustomTabsTrigger>
                    <CustomTabsTrigger value="query">Query</CustomTabsTrigger>
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
                            <DropdownMenuItem onClick={() => {
                                setTabValue("results");
                                setResultsTab("map");
                            }}>
                                Map
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setTabValue("results");
                                setResultsTab("images");
                            }}>
                                Images
                            </DropdownMenuItem>
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
                </TabsList>
                <TabsContent value="question">
                    <Question />
                </TabsContent>
                <TabsContent value="query">Query here.</TabsContent>
                <TabsContent value="results">
                    {
                        resultsTab === "map" && 
                        <Map />
                    }
                    {
                        resultsTab === "images" && 
                        <Carousel />
                    }
                    {
                        resultsTab === "table" && 
                        <DataTable  columns={columns} data={results} />
                    }
                    {
                        resultsTab === "text" && 
                        <div>
                            Text here.
                        </div>
                    }
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Message;
