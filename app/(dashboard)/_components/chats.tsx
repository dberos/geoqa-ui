"use client";

import { Accordion } from "@/components/ui/accordion"
import { usefindChats } from "@/hooks/use-find-chats";
import { useSession } from "@/hooks/use-session";
import Chat from "./chat";
import { useRouter } from "next/navigation";

const Chats = () => {

    const router = useRouter();

    const { data } = useSession();
    const { data: chats, error } = usefindChats(data?.session?.id);
    if (error) {
        console.error(error);
        router.replace('/error');
    }

    return ( 
        <div className="flex-1 overflow-y-auto">
            <Accordion type="single" collapsible>
                {
                    chats?.chats && chats.chats.map((item) => (
                        <Chat key={item.id} chat={item} />
                    ))
                }
            </Accordion>
        </div>
    );
}
 
export default Chats;
