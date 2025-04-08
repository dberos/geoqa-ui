"use client";

import { useEffect, useState } from "react";
import Account from "./account";
import Add from "./add";
import Footer from "./footer";
import Logo from "./logo";

const Sidebar = () => {

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, [])
    if (!isMounted) return null;
    
    return ( 
        <aside className="h-screen w-72 2k:w-[450px] 4k:w-[600px] flex flex-col border-r-1 bg-neutral-100 dark:bg-neutral-900">
            <Account />
            <Logo />
            <Add />
            <div className="size-full flex-flex-col">
                <div className="w-full h-3/4 2k:h-4/5"/>
                <Footer />
            </div>
        </aside>
    );
}
 
export default Sidebar;