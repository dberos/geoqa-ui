"use client";

import { useMedia } from "react-use";
import Sidebar from "./sidebar";
import Menu from "./menu";

const Navigation = () => {
    const isMobile = useMedia("(max-width: 1024px)", false);

    return ( 
        <>
        {
            !isMobile ?
            <Sidebar /> :
            <Menu />
        }
        </>
    );
}
 
export default Navigation;