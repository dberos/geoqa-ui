"use client";

import { useEffect, useState } from "react";
import Footer from "./footer";
import Toolbar from "./toolbar";

const Sidebar = () => {

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounted) return null;
    
    return ( 
        <aside className="h-screen w-[350px] 2k:w-[450px] 4k:w-[600px] flex flex-col border-r-1 bg-neutral-100 dark:bg-neutral-900">
            <Toolbar />
            <div className="size-full flex flex-col">
                <div className="w-full flex-1"/>
                <Footer />
            </div>
        </aside>
    );
}
 
export default Sidebar;