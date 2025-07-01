"use client";

import { useEffect, useState } from "react";
import Footer from "./footer";
import Toolbar from "./toolbar";
import Chats from "./chats";

const Sidebar = () => {

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounted) return null;
    
    return ( 
        <aside className="h-screen w-[350px] 2k:w-[500px] 4k:w-[650px] flex flex-col border-r-1 bg-neutral-100 dark:bg-neutral-900">
            <Toolbar />
            <div className="flex flex-col flex-1 min-h-0">
                <Chats />
                <div className="h-10 2k:h-20 4k:h-25" />
                <Footer />
            </div>
        </aside>
    );
}
 
export default Sidebar;