"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useWindowScroll } from "react-use";
import logoNoLetters from "../../../public/GEOQA_logo_no_letters.png"

const NavDesktop = () => {
    
    const { y } = useWindowScroll();

    return ( 
        <nav className={cn(
            "h-20 w-full p-8 flex items-center justify-between fixed backdrop-blur-xs bg-inherit z-50",
            y > 20 && "shadow-sm dark:shadow-neutral-700"
        )}>
            <Link href='/'>
                <Image
                src={logoNoLetters}
                alt='logo'
                priority
                height={100}
                width={100}
                className="size-9/12 object-contain"
                />
            </Link>
            <ul className="flex items-center space-x-4">
                <li>
                    <ThemeToggle />
                </li>
                <li className="text-white">
                    Dashboard
                </li>
                <li className="text-white">
                    Legal
                </li>
                <li>
                    <Button className='cursor-pointer'>
                        Log In
                    </Button>
                </li>
            </ul>
        </nav>
     );
}
 
export default NavDesktop;