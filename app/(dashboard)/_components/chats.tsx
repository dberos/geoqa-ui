"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Ellipsis, PencilLine, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usefindChats } from "@/hooks/use-find-chats";
import { useSession } from "@/hooks/use-session";
import { format } from 'date-fns';
import Link from "next/link";
import { useDashboardMobileMenuStore } from "@/hooks/use-mobile-menu-store";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

const Chats = () => {
    const pathname = usePathname();
    const segments = pathname.split('/');
    const chatId = segments[segments.length - 1];

    const { data } = useSession();
    const { data: chats } = usefindChats(data?.session?.id || "");

    const setIsOpen = useDashboardMobileMenuStore((state) => state.setIsOpen);

    return ( 
        <div className="flex-1 overflow-y-auto">
            <Accordion type="single" collapsible>
                {
                    chats?.chats && chats.chats.map((item) => (
                        <AccordionItem 
                        key={item.id} 
                        value={`item-${item.id}`}
                        className={cn(
                            "cursor-pointer",
                            chatId === item.id && 'bg-neutral-300 dark:bg-neutral-700'
                        )}
                        >
                            <AccordionTrigger 
                            className="cursor-pointer px-6 lg:p-4"
                            >
                                <Link href={`/dashboard/chats/${item.id}`} onClick={() => setIsOpen(false)}>
                                    {item.name}
                                </Link>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground flex flex-row items-center justify-between px-6 lg:px-4">
                                <p className="cursor-pointer">
                                    {format(new Date(item.createdAt), 'dd/MM/yy')}
                                </p>
                                <DropdownMenu modal={false}>
                                <DropdownMenuTrigger>
                                    <Ellipsis className="text-muted-foreground size-4 cursor-pointer"/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuItem className="flex justify-between">
                                        Rename
                                        <PencilLine className="size-3"/>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex justify-between">
                                        Delete Chat
                                        <Trash2 className="size-3 text-destructive"/>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </AccordionContent>
                        </AccordionItem>
                    ))
                }
            </Accordion>
        </div>
    );
}
 
export default Chats;
