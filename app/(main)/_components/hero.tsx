"use client";

import { cn } from "@/lib/utils";
import { useMedia } from "react-use";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
    const isMobile = useMedia("(max-width: 1024px)", false);

    return (
        <div className={cn(
            `h-screen w-full flex items-center justify-center flex-col gap-y-6 
            bg-[url('/nasa-yZygONrUBe8-unsplash.jpg')] bg-cover bg-neutral-400 bg-blend-multiply`,
            !isMobile ? 'bg-center' : 'bg-right'
        )}>
            <h1 className="text-6xl lg:text-7xl font-bold text-white">
                GeoQA
            </h1>
            <h2 className="text-3xl lg:text-4xl font-semibold text-white max-w-xs md:max-w-md lg:max-w-xl text-center">
                AI powered QnA engine for geospatial data
            </h2>
            <Button className=" cursor-pointer space-x-4">
                Get Started
                <ArrowRight className="size-4" />
            </Button>
        </div>
    );
}

export default Hero;
