"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu as MenuIcon } from "lucide-react";
import { useDashboardMobileMenuStore } from "@/hooks/use-mobile-menu-store";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Footer from "./footer";
import Toolbar from "./toolbar";
import Chats from "./chats";

const Menu = () => {

    const isOpen = useDashboardMobileMenuStore((state) => state.isOpen);
    const setIsOpen = useDashboardMobileMenuStore((state) => state.setIsOpen);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounted) return null;
        
    return ( 
      <nav className="absolute top-6 left-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className='cursor-pointer'>
                        <MenuIcon />
                    </Button>
                </SheetTrigger>
                <SheetContent className="size-full">
                    <SheetHeader className="mt-5 flex items-center justify-center">
                    <SheetTitle className="size-full">
                        <Toolbar />
                    </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col flex-1 min-h-0">
                        <Chats />
                        <div className="h-10 md:h-15" />
                        <Footer />
                    </div>
                </SheetContent>
            </Sheet>
      </nav>  
    );
}
 
export default Menu;
