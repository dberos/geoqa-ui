"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useWindowScroll } from "react-use";
import { Globe, Menu, SquarePen, User } from "lucide-react";
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
import logo from "../../../public/logo.png";
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
import gitHub from "../../../public/github.svg";
import linkedin from "../../../public/linkedin.png";

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
                    <SheetHeader className="mt-5 h-30 md:h-36 w-full flex items-center justify-center">
                    <SheetTitle className="size-full">
                        <div className="w-full h-30 md:h-36 grid grid-rows-2 grid-cols-1">
                            <div className="size-full relative flex items-center justify-between p-4 2k:p-6 border-b-1">
                                <Link href='/' onClick={() => setIsOpen(!isOpen)}>
                                    <Image 
                                    src={logo}
                                    alt="GeoQA logo"
                                    width={100}
                                    height={100}
                                    className="object-contain size-12"
                                    />
                                </Link>
                                {
                                    data?.session ?
                                    <DropdownMenu>
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
                                </DropdownMenu> :
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarFallback>
                                            <User className="size-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="text-center">
                                    <DropdownMenuItem>
                                    <Link href="/auth/sign-in" onClick={() => setIsOpen(!isOpen)}>
                                        Sign In
                                    </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                                }
                            </div>
                            <div className="relative size-full flex items-center justify-around pl-4 pr-4">
                                <div className="absolute w-[1px] h-full bg-border left-1/2" />
                                <ThemeToggle />
                                <Button size='icon' variant='outline' className="cursor-pointer p-2" onClick={() => setIsOpen(!isOpen)}>
                                    <Link href='/dashboard'>
                                        <SquarePen className="size-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </SheetTitle>
                    </SheetHeader>
                    <div className="mt-10 p-4 flex flex-col">
                        <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="dashboard">
                                <AccordionTrigger>Dashboard</AccordionTrigger>
                                <AccordionContent>
                                <Button variant="link" size="sm" className='cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                                    <Link href="/dashboard">
                                        Start a new chat
                                    </Link>
                                </Button>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="legal">
                                <AccordionTrigger>Legal</AccordionTrigger>
                                <AccordionContent>
                                <ul>
                                    <li>
                                        <Button variant="link" size="sm" className='cursor-pointer'>
                                            Privacy Policy
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" size="sm" className='cursor-pointer'>
                                            Cookie Policy
                                        </Button>
                                    </li>
                                </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="contact">
                                <AccordionTrigger>Contact</AccordionTrigger>
                                <AccordionContent>
                                <ul>
                                    <li>
                                        <Button variant="link" size="sm" className='cursor-pointer'>
                                            <Link href="https://www.di.uoa.gr/" target="_blank">
                                                DIT
                                            </Link>
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" size="sm" className='cursor-pointer'>
                                        <Link href="https://www.uoa.gr/" target="_blank">
                                                UoA
                                            </Link>
                                        </Button>
                                    </li>
                                </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="about">
                                <AccordionTrigger>About Us</AccordionTrigger>
                                <AccordionContent>
                                <ul className="flex justify-around">
                                    <li>
                                    <Link href="https://ai.di.uoa.gr/" target="_blank">
                                        <Button variant="link" size="sm" className='cursor-pointer'>
                                            <Globe className="size-5"/>
                                        </Button>
                                    </Link>
                                    </li>
                                    <li>
                                    <Link href="https://github.com/AI-team-UoA" target="_blank">
                                        <Button variant="link" size="sm" className='cursor-pointer'>
                                            <Image 
                                            src={gitHub}
                                            alt='github icon'
                                            width={100}
                                            height={100}
                                            className="object-contain size-5 dark:filter dark:invert"
                                            />
                                        </Button>
                                    </Link>
                                    </li>
                                    <li>
                                    <Link href="https://linkedin.com/company/ai-team-uoa" target="_blank">
                                        <Button variant="link" size="sm" className='cursor-pointer'>
                                            <Image 
                                            src={linkedin}
                                            alt='github icon'
                                            width={100}
                                            height={100}
                                            className="object-contain size-5 dark:filter dark:invert"
                                            />
                                        </Button>
                                    </Link>
                                    </li>
                                </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <div className="w-full flex-1"/>
                    <div className="w-full h-30 md:h-40 border-t-1 p-6 2k:p-8 flex items-center justify-center flex-col gap-y-2 2k:gap-y-5">
                    <p className="text-xs leading-4 2k:text-lg 2k:leading-6 4k:text-2xl 4k:leading-7 text-muted-foreground text-center">
                        Department of Informatics & Telecommunications
                        <br />
                        National and Kapodistrian University of Athens, Greece
                    </p>
                    <p className="text-base 2k:text-xl 4k:text-3xl text-muted-foreground">
                        &copy; 2025 AI Team
                    </p>
                </div>
                </SheetContent>
            </Sheet>
        </nav>
     );
}
 
export default NavMobile;