"use client";

import Image from "next/image";
import logo from '../../../public/logo.png';
import Searchbar from "./searchbar";
import { useEffect, useState } from "react";

const NewChat = () => {
    const [isMounded, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounded) return null;

    return ( 
        <div className="size-full flex items-center justify-center flex-col gap-y-4">
            <div className="w-full h-36 md:h-48 lg:h-44 xl:h-52 2k:h-64 4k:h-72 flex items-center justify-center">
                <Image 
                src={logo}
                alt="GeoQA logo"
                width={200}
                height={200}
                quality={100}
                priority
                className="object-contain size-full"
                />
            </div>
            <div className="w-full h-60 flex items-center justify-center">
                <div className="w-full md:w-3/5 xl:w-2/5 4k:w-2/6 h-full flex items-start justify-center p-8">
                    <Searchbar />
                </div>
            </div>
        </div>
    );
}
 
export default NewChat;