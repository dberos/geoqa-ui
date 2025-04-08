"use client";

import { useMedia } from "react-use";
import Sidebar from "./sidebar";
import MobileMenu from "./mobile-menu";

const Navigation = () => {
    const isMobile = useMedia("(max-width: 1024px)", false);

    return ( 
        <>
        {
            !isMobile ?
            <Sidebar /> :
            <MobileMenu />
        }
        </>
    );
}
 
export default Navigation;