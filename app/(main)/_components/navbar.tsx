"use client";

import { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import NavDesktop from './nav-desktop';
import NavMobile from './nav-mobile';

// TODO: Implement links
// TODO: Implement login

const NavBar = () => {

    const isMobile = useMedia("(max-width: 1024px)", false);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true) ,[]);
    if (!isMounted) return null;

    if (isMobile) return <NavMobile />;

    return <NavDesktop />;
}
 
export default NavBar;