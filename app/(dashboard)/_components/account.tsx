"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

const Account = () => {
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
        <div className="w-full h-14 flex items-center justify-between p-4 border-b-1">
            <ThemeToggle />
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
    );
}
 
export default Account;