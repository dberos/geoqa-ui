import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import dedent from "dedent-js";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import QueryEdit from "./query-edit";
import { useState } from "react";

const Query = ({ query }: { query: string | undefined | null }) => {
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    const [isOpenDesktop, setIsOpenDesktop] = useState(false);
    return ( 
        <div className="size-full rounded-md">
            <div className="h-12 p-2 flex items-center justify-end">
                <Dialog open={isOpenMobile} onOpenChange={setIsOpenMobile}>
                <DialogTrigger asChild>
                    <Button variant='secondary' className="2xl:hidden">
                        Edit
                        <Pencil className="size-4" />
                    </Button>
                </DialogTrigger>
                <QueryEdit setIsOpen={setIsOpenMobile} query={query} />
                </Dialog>
            </div>
            <div className="h-[calc(100%-48px)] w-full p-2 2xl:p-4 2k:p-6 2xl:grid 2xl:grid-rows-1 2xl:grid-cols-2">
                <div>
                    <p className="max-h-54 lg:max-h-42 xl:max-h-61 2xl:max-h-66 2k:max-h-91 4k:max-h-106
                    overflow-hidden overflow-y-auto whitespace-pre-wrap break-words
                    text-left text-base 2k:text-lg 4k:text-xl">
                        {
                        dedent(query || "")
                        }
                        
                    </p>
                </div>
                <div className="hidden 2xl:flex items-center justify-center">
                    <Dialog open={isOpenDesktop} onOpenChange={setIsOpenDesktop}>
                    <DialogTrigger asChild>
                        <Button variant='secondary' className="2k:p-6 4k:p-10 2k:text-lg 4k:text-xl">
                            Edit Query
                            <Pencil className="size-4 2k:size-6 4k:size-8" />
                        </Button>
                    </DialogTrigger>
                    <QueryEdit setIsOpen={setIsOpenDesktop} query={query} />
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
 
export default Query;