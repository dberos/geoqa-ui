"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useWindowScroll } from "react-use";
import logo from "../../../public/logo.png";
import { LogIn, User } from "lucide-react";
import { useNavbarStyle } from "@/hooks/use-navbar-style";
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSignOut } from "@/hooks/use-sign-out";
import { useRouter } from "next/navigation";

const NavDesktop = () => {
    
    const { y } = useWindowScroll();

    const { isAboveHero } = useNavbarStyle("homeHeroId", "mainNavbarDesktopId");

    const { data, error, isLoading } = useSession();
    if (!isLoading && !error) {
        console.log(data?.session);
    }

    const { mutate } = useSignOut();

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
        <nav 
        id="mainNavbarDesktopId" 
        className={cn(
            "h-20 w-full p-8 flex items-center justify-between fixed z-50",
            y > 20 && "shadow-sm dark:shadow-neutral-700",
            isAboveHero ? "bg-inherit backdrop-blur-xs" : "bg-background backdrop-blur-none"
        )}>
            <div className="flex items-center justify-center flex-row">
                <Link href='/'>
                    <Image
                    src={logo}
                    alt='logo'
                    priority
                    height={100}
                    width={100}
                    className="size-14 object-contain"
                    />
                </Link>
                <ul className="flex items-center space-x-10 ml-8">
                    <li>
                        <Button variant="link" size="sm" className='cursor-pointer'>
                            <Link href='/dashboard'>
                                Dashboard
                            </Link>
                        </Button>
                    </li>
                    <li>
                        <Button variant="link" size="sm" className='cursor-pointer'>
                            Legal
                        </Button>
                    </li>
                </ul>
            </div>
            <div className="flex items-center justify-center gap-x-6">
                <ThemeToggle />
                {
                    data?.session ? 
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
                     :
                    <Button className='cursor-pointer'>
                        <Link href="/auth/sign-in" className="flex items-center justify-center gap-x-2">
                            Sign In
                            <LogIn className="size-4" />
                        </Link>
                    </Button>
                }
                
            </div>
            
        </nav>
     );
}
 
export default NavDesktop;