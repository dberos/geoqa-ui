"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useWindowScroll } from "react-use";
import { Menu } from "lucide-react";
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
import logo from "../../../public/GEOQA_logo.png"

const NavMobile = () => {

    const { y } = useWindowScroll();

    const isOpen = useMobileMenuStore((state) => state.isOpen);
    const setIsOpen = useMobileMenuStore((state) => state.setIsOpen);

    return ( 
        <nav className={cn(
            "h-20 w-full p-10 flex items-center fixed backdrop-blur-xs bg-inherit z-50",
            y > 20 && "shadow-sm dark:shadow-neutral-700"
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
                        <div className="absolute left-12 bottom-6">
                            <ThemeToggle />
                        </div>
                        <Link href='/'>
                            <Image
                            src={logo}
                            alt='logo'
                            priority
                            height={100}
                            width={100}
                            className="size-40 object-contain"
                            />
                        </Link>
                    </SheetTitle>
                    </SheetHeader>
                    <div className="mt-10 p-4">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="account">
                                <AccordionTrigger>Account</AccordionTrigger>
                                <AccordionContent>
                                    Links
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="dashboard">
                                <AccordionTrigger>Dashboard</AccordionTrigger>
                                <AccordionContent>
                                    Links
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