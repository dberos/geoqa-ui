"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useNavbarStyle = (heroId: string, navbarId: string) => {
    // Need pathname to check again after return to home, with next router
    // Not window.location.href
    const pathName = usePathname();
    const [isAboveHero, setIsAboveHero] = useState(true);

    const checkNavbarPosition = () => {
        const hero = document.getElementById(heroId);
        const nav = document.getElementById(navbarId);

        if (!hero || !nav) {
            setIsAboveHero(false);
            return;
        }

        // Check if navbar has moved below the hero
        const heroBottom = hero.getBoundingClientRect().bottom;
        const navTop = nav.getBoundingClientRect().top;

        setIsAboveHero(navTop <= heroBottom);
    };

    useEffect(() => {
        // Run on scroll
        window.addEventListener("scroll", checkNavbarPosition);
        checkNavbarPosition();

        return () => {
            window.removeEventListener("scroll", checkNavbarPosition);
        };
    }, [pathName]);

    return { isAboveHero }
}