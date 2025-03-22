"use client";

import { cn } from "@/lib/utils";
import { useMedia } from "react-use";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
    const isMobile = useMedia("(max-width: 1024px)", false);

    return (
        <div
        id='homeHeroId' 
        className={cn(
            `h-screen w-full flex items-center justify-center flex-col gap-y-6 relative 
            bg-[url('/home_hero.jpg')] bg-cover bg-fixed bg-neutral-400 bg-blend-multiply`,
            !isMobile ? 'bg-center' : 'bg-right'
        )}>
            <h1 className="text-6xl lg:text-7xl 2k:text-8xl 4k:text-9xl font-bold text-white">
                GeoQA
            </h1>
            <h2 className="text-3xl lg:text-4xl 2k:text-5xl font-semibold text-white max-w-xs md:max-w-md lg:max-w-xl 2k:max-w-2xl text-center">
                AI powered QnA engine for geospatial data
            </h2>
            <Button className="cursor-pointer">
                <Link href="/auth/sign-in" className="flex items-center justify-center gap-x-2">
                    Get Started
                    <ArrowRight className="size-4" />
                </Link>
                
            </Button>
            <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-neutral-400/50 to-transparent backdrop-blur-xs" />
        </div>
    );
}

export default Hero;
