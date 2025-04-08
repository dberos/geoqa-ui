"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "@/hooks/use-session";
import { useSignOut } from "@/hooks/use-sign-out";
import { SquarePen, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Toolbar = () => {
    const { mutate } = useSignOut();
    
    const { data, error, isLoading } = useSession();
        if (!isLoading && !error) {
            console.log(data?.session);
        }
    
    const router = useRouter();

    const handleSignOut = () => {
        mutate({},
            {
                onSuccess: () => {
                    router.replace('/');
                },
                onError: (error) => {
                    console.error(error);
                    router.push('/error');
                }
            }
        );
    }

    return ( 
        <div className="w-full h-40 2k:h-52 4k:h-60 grid grid-rows-2 grid-cols-1">
            <div className="size-full relative flex items-center justify-between p-4 2k:p-6 border-b-1">
                <div className="absolute w-0.5 h-full bg-muted left-1/2" />
                <Link href='/' className="text-2xl font-semibold text-muted-foreground">
                    GeoQA
                </Link>
                {
                    data?.session &&
                    <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src={data?.session.avatarUrl} />
                            <AvatarFallback>
                                <User className="size-4" />
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="text-center">
                        <DropdownMenuLabel>
                            {data?.session.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                }
            </div>
            <div className="relative size-full border-b-1 flex items-center justify-around pl-4 pr-4">
                <div className="absolute w-0.5 h-full bg-muted left-1/2" />
                <ThemeToggle />
                <Button size='icon' variant='outline' className="cursor-pointer p-2">
                    <Link href='/dashboard'>
                        <SquarePen className="size-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
 
export default Toolbar;
