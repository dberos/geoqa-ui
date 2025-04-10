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

const Chats = () => {
    const chats = Array.from({ length: 15 }, (_, index) => ({
        id: index + 1,
        title: 'New Chat',
        description: "10/4/2025",
    }));
    return ( 
        <div className="flex-1 overflow-y-auto pl-6 pr-6 lg:p-4 [&::-webkit-scrollbar]:hidden">
            <Accordion type="single" collapsible>
                {
                    chats.map((item) => (
                        <AccordionItem key={item.id} value={`item-${item.id}`}>
                            <AccordionTrigger className="cursor-pointer">
                                {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground flex flex-row items-center justify-between">
                                <p className="cursor-pointer">
                                    {item.description}
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
