import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gitHub from "../../../public/github.svg";
import linkedin from "../../../public/linkedin.png";

const Footer = () => {
    return ( 
        <footer className="w-full h-1/4 2k:h-1/5 2k:p-6 border-t-1 grid grid-rows-4 grid-cols-1">
            <div className="flex size-full items-center justify-around pl-10 pr-10">
            <Link href="https://ai.di.uoa.gr/" target="_blank">
                <Button variant="link" size="sm" className='cursor-pointer'>
                    <Globe className="size-5"/>
                </Button>
            </Link>
            <Link href="https://github.com/AI-team-UoA" target="_blank">
                <Button variant="link" size="sm" className='cursor-pointer'>
                    <Image 
                    src={gitHub}
                    alt='github icon'
                    width={100}
                    height={100}
                    className="object-contain size-5 dark:filter dark:invert"
                    />
                </Button>
            </Link>
            <Link href="https://linkedin.com/company/ai-team-uoa" target="_blank">
                <Button variant="link" size="sm" className='cursor-pointer'>
                    <Image 
                    src={linkedin}
                    alt='github icon'
                    width={100}
                    height={100}
                    className="object-contain size-5 dark:filter dark:invert"
                    />
                </Button>
            </Link>
            </div>
            <div className="size-full flex items-center justify-between">
                <Button size='sm' variant='link' className="cursor-pointer">
                    Privacy Policy
                </Button>
                <Button size='sm' variant='link' className="cursor-pointer">
                    Cookie Policy
                </Button>
            </div>
            <div className="size-full flex items-center justify-around">
            <Button variant="link" size="sm" className='cursor-pointer'>
                <Link href="https://www.di.uoa.gr/" target="_blank">
                    DIT
                </Link>
            </Button>
            <Button variant="link" size="sm" className='cursor-pointer'>
                <Link href="https://www.uoa.gr/" target="_blank">
                    UoA
                </Link>
            </Button>
            </div>
            <div className="size-full flex items-center justify-center">
                <p className="text-sm 2k:text-base">
                    &copy; 2025 AI Team
                </p>
            </div>
        </footer>
    );
}
 
export default Footer;