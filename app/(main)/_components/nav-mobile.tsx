"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useWindowScroll } from "react-use";
import { Menu, User } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"  
import { useMobileMenuStore } from "@/hooks/use-mobile-menu-store";
import { ThemeToggle } from "@/components/theme-toggle";
import logo from "../../../public/logo.svg";
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
import { useRouter } from "next/navigation";
import { useSignOut } from "@/hooks/use-sign-out";

const NavMobile = () => {

    const { y } = useWindowScroll();

    const isOpen = useMobileMenuStore((state) => state.isOpen);
    const setIsOpen = useMobileMenuStore((state) => state.setIsOpen);

    const { isAboveHero } = useNavbarStyle("homeHeroId", "mainNavbarMobileId");

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

    return ( 
        <nav
        id="mainNavbarMobileId"
        className={cn(
            "h-20 w-full p-10 flex items-center fixed z-50",
            y > 20 && "shadow-sm dark:shadow-neutral-700",
            isAboveHero ? "bg-inherit backdrop-blur-xs" : "bg-background backdrop-blur-none"
        )}>
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
                                className="size-32 object-contain"
                                />
                                <h1 className="text-5xl text-muted-foreground">
                                    GeoQA
                                </h1>
                            </div>
                            
                        </Link>
                    </SheetTitle>
                    </SheetHeader>
                    <div className="mt-10 p-4">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="dashboard">
                                <AccordionTrigger>Dashboard</AccordionTrigger>
                                <AccordionContent>
                                    <Link href='/dashboard'>
                                        Continue to GeoQA
                                    </Link>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="legal">
                                <AccordionTrigger>Legal</AccordionTrigger>
                                <AccordionContent>
                                    Links
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </SheetContent>
            </Sheet>
        </nav>
     );
}
 
export default NavMobile;