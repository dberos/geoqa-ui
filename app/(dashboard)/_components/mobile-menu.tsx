"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { CirclePlus, Menu, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/hooks/use-session";
import { useSignOut } from "@/hooks/use-sign-out";
import { useRouter } from "next/navigation";
import { useDashboardMobileMenuStore } from "@/hooks/use-mobile-menu-store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import logo from "../../../public/logo.svg";
import { useEffect, useState } from "react";
import FooterMobile from "./footer-mobile";

const MobileMenu = () => {

    const isOpen = useDashboardMobileMenuStore((state) => state.isOpen);
    const setIsOpen = useDashboardMobileMenuStore((state) => state.setIsOpen);
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
                        setIsOpen(false);
                    },
                    onError: (error) => {
                        console.error(error);
                        router.push('/error');
                    }
                }
            );
        }

        const [isMounted, setIsMounted] = useState(false);
        useEffect(() => {
            setIsMounted(true);
        }, [])
        if (!isMounted) return null;
        
    return ( 
      <nav className="absolute top-6 left-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className='cursor-pointer'>
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent className="size-full">
                    <SheetHeader className="mt-5 relative flex items-center justify-center">
                    <SheetTitle>
                        <div className="absolute left-12 bottom-4">
                            <ThemeToggle />
                        </div>
                        <div className="absolute right-12 bottom-4">
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
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarFallback>
                                                <User className="size-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="text-center">
                                        <DropdownMenuItem>
                                        <Link href="/auth/sign-in" onClick={() => setIsOpen(false)}>
                                            Sign In
                                        </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            }
                        </div>
                        <Link href='/'>
                            <div className="flex items-center justify-center flex-col gap-y-4">
                                <Image
                                src={logo}
                                alt='logo'
                                priority
                                height={100}
                                width={100}
                                className="size-24 object-contain"
                                />
                                <h1 className="text-4xl text-muted-foreground">
                                    GeoQA
                                </h1>
                            </div>
                        </Link>
                    </SheetTitle>
                    </SheetHeader>
                    <div className="w-full h-8 flex items-center justify-end pr-12">
                        <Link href='/dashboard' onClick={() => setIsOpen(false)}>
                            <CirclePlus className="size-8 text-muted-foreground" />
                        </Link>
                    </div>
                    <div className="size-full flex flex-col">
                        <div className="w-full h-2/3 md:h/3/5">

                        </div>
                        <FooterMobile />
                    </div>
                </SheetContent>
            </Sheet>
      </nav>  
    );
}
 
export default MobileMenu;
