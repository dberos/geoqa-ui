"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { useDashboardMobileMenuStore } from "@/hooks/use-mobile-menu-store";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Footer from "./footer";
import Toolbar from "./toolbar";

const MobileMenu = () => {

    const isOpen = useDashboardMobileMenuStore((state) => state.isOpen);
    const setIsOpen = useDashboardMobileMenuStore((state) => state.setIsOpen);

    const { data, error, isLoading } = useSession();
        if (!isLoading && !error) {
            console.log(data?.session);
        }

        const [isMounted, setIsMounted] = useState(false);
        useEffect(() => setIsMounted(true), []);
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
                    <SheetHeader className="mt-5 flex items-center justify-center">
                    <SheetTitle className="size-full">
                        <Toolbar />
                    </SheetTitle>
                    </SheetHeader>
                    <div className="size-full flex flex-col">
                        <div className="w-full flex-1" />
                        <Footer />
                    </div>
                </SheetContent>
            </Sheet>
      </nav>  
    );
}
 
export default MobileMenu;
