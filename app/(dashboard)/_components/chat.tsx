"use client";

import { ChatType } from "@/types";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Ellipsis, Loader2, PencilLine, Trash2, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from 'date-fns';
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardMobileMenuStore } from "@/hooks/use-mobile-menu-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UpdateChatNameSchema } from "@/schemas";
import { useUpdateChat } from "@/hooks/use-update-chat";
import { useState } from "react";
import { useDeleteChat } from "@/hooks/use-delete-chat";

const Chat = ({ chat }: { chat: ChatType }) => {

    const pathname = usePathname();
    const segments = pathname.split('/');
    const chatId = segments[segments.length - 1];

    const router = useRouter();

    const setIsOpen = useDashboardMobileMenuStore((state) => state.setIsOpen);

    const { mutate: updateMutate } = useUpdateChat(chat.id);
    const { mutate: deleteMutate } = useDeleteChat();


    const [isOpenOptions, setIsOpenOptions] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

    const form = useForm<z.infer<typeof UpdateChatNameSchema>>({
        resolver: zodResolver(UpdateChatNameSchema),
        defaultValues: {
            name: "",
        },
    })
    
    function onSubmit(values: z.infer<typeof UpdateChatNameSchema>) {
        setIsSubmittingEdit(true);
        setTimeout(() => {
            const chatId = chat.id;
            updateMutate({ json: values, param: { chatId } }, {
                onError: () => {
                    router.replace('/error');
                }
            });
            form.reset();
            setIsOpenEdit(false);
            setIsOpenOptions(false);
            setIsSubmittingEdit(false);
        }, 1000);
    }

    const handleDelete = () => {
        setIsSubmittingDelete(true);
        setTimeout(() => {
            const chatId = chat.id;
            deleteMutate({ param: { chatId } }, {
                onError: () => {
                    router.replace('/');
                }
            });
            setIsOpenDelete(false);
            setIsOpenOptions(false);
            setIsSubmittingDelete(false);
            router.replace('/dashboard');
        }, 1000);
    }

    return ( 
        <AccordionItem 
        key={chat.id} 
        value={`item-${chat.id}`}
        className={cn(
            "cursor-pointer",
            chatId === chat.id && 'bg-neutral-300 dark:bg-neutral-700'
        )}
        >
            <AccordionTrigger 
            className="cursor-pointer px-6 lg:p-4"
            >
                <Link href={`/dashboard/chats/${chat.id}`} onClick={() => setIsOpen(false)}>
                    {chat.name}
                </Link>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground flex flex-row items-center justify-between px-6 lg:px-4">
                <p className="cursor-pointer">
                    {format(new Date(chat.createdAt), 'dd/MM/yy')}
                </p>
                <DropdownMenu 
                open={isOpenOptions}
                onOpenChange={setIsOpenOptions}
                modal={false}
                >
                <DropdownMenuTrigger>
                    <Ellipsis className="text-muted-foreground size-4 cursor-pointer"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' onCloseAutoFocus={(e) => e.preventDefault()}>
                    <Dialog
                    open={isOpenEdit}
                    onOpenChange={setIsOpenEdit}
                    >
                    <DialogTrigger asChild>
                        <DropdownMenuItem 
                        className="flex justify-between" 
                        onSelect={(e) => e.preventDefault()}
                        >
                            Rename
                        <PencilLine className="size-3"/>
                    </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle className="text-center">
                            {chat.name}
                        </DialogTitle>
                        </DialogHeader>
                                <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Rename Chat</FormLabel>
                                        <FormControl>
                                            <Input placeholder={chat.name || "New Chat"} {...field} disabled={isSubmittingEdit}/>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <Button type="submit" disabled={isSubmittingEdit}>
                                        {
                                            isSubmittingEdit ?
                                            <>
                                                <Loader2 className="text-muted-foreground size-4 animate-spin" />
                                                Submitting
                                            </> :
                                            <>
                                                Submit
                                            </>
                                        }
                                    </Button>
                                </form>
                            </Form>
                    </DialogContent>
                    </Dialog>
                    <Dialog
                    open={isOpenDelete}
                    onOpenChange={setIsOpenDelete}
                    >
                        <DialogTrigger asChild>
                            <DropdownMenuItem 
                            className="flex justify-between"
                            onSelect={(e) => e.preventDefault()}
                            >
                                Delete Chat
                                <Trash2 className="size-3 text-destructive"/>
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. The selected chat will be deleted.
                            </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button 
                                variant='secondary' 
                                disabled={isSubmittingDelete}
                                onClick={() => {
                                    setIsOpenDelete(false);
                                    setIsOpenOptions(false);
                                }}>
                                    <X className="size-4" />
                                    Cancel
                                </Button>
                                <Button 
                                variant='destructive' 
                                disabled={isSubmittingDelete}
                                onClick={handleDelete}
                                >
                                    {
                                        isSubmittingDelete ?
                                        <>
                                            <Loader2 className="text-muted-foreground size-4 animate-spin" />
                                            Deleting
                                        </> :
                                        <>
                                            <Trash2 className="size-4" />
                                            Confirm
                                        </>
                                    }
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuContent>
                </DropdownMenu>
            </AccordionContent>
        </AccordionItem>
    );
}
 
export default Chat;