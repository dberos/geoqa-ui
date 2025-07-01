import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import Link from "next/link";
import gitHub from "../../../public/github.svg";
import linkedin from "../../../public/linkedin.png";
import Image from "next/image";

const Footer = () => {
    return ( 
        <footer className="h-[650px] w-full md:h-80 lg:h-56 2k:h-72 4k:h-96 2k:p-8 4k:p-16 
        grid grid-rows-[60%_40%] grid-cols-1 md:grid-cols-1 md:grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 
        border-t-2 bg-neutral-100 dark:bg-neutral-900"
        >
            <div className="flex flex-col items-center p-10 order-2 gap-y-2 2k:gap-y-5 
            md:p-12 md:items-center md:justify-center lg:items-start lg:justify-start lg:order-1"
            >
                <h1 className="text-xl font-semibold 4k:text-3xl">
                    GeoQA
                </h1>
                <h2 className="text-base 4k:text-xl text-center">
                    &copy; 2025 AI Team
                </h2>
                <h3 className="text-base 4k:text-xl text-center mt-2 md:mt-0 md:text-center lg:text-start">
                    Department of Informatics & Telecommunications
                    <br />
                    National and Kapodistrian University of Athens, Greece
                </h3>
            </div>
            <div className="order-1 grid grid-rows-3 grid-cols-1 md:grid-rows-1 md:grid-cols-3 lg:order-2 4k:p-10">
                <div className="flex flex-col items-center">
                    <h2 className="text-lg 4k:text-2xl mt-10 text-muted-foreground">
                        Legal
                    </h2>
                    <ul className="mt-1 md:mt-4">
                        <li>
                            <Button variant="link" size="sm" className='cursor-pointer'>
                                <Link href='/legal#privacy-policy' className="4k:text-xl">
                                    Privacy Policy
                                </Link>
                            </Button>
                        </li>
                        <li>
                            <Button variant="link" size="sm" className='cursor-pointer'>
                                <Link href='/legal#cookie-policy' className="4k:text-xl">
                                    Cookie Policy
                                </Link>
                            </Button>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg 4k:text-2xl mt-10 text-muted-foreground">
                        Contact
                    </h2>
                    <ul className="mt-1 md:mt-4">
                        <li>
                            <Button variant="link" size="sm" className='cursor-pointer'>
                                <Link href="https://www.di.uoa.gr/" target="_blank" className="4k:text-xl">
                                    DIT
                                </Link>
                            </Button>
                        </li>
                        <li>
                            <Button variant="link" size="sm" className='cursor-pointer'>
                            <Link href="https://www.uoa.gr/" target="_blank" className="4k:text-xl">
                                    UoA
                                </Link>
                            </Button>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg 4k:text-2xl mt-10 text-muted-foreground">
                        About Us
                    </h2>
                    <div className="mt-1 md:mt-4 flex flex-row gap-x-1 2k:gap-x-5">
                        <Link href="https://ai.di.uoa.gr/" target="_blank">
                            <Button variant="link" size="sm" className='cursor-pointer'>
                                <Globe className="size-5 4k:size-8"/>
                            </Button>
                        </Link>
                        <Link href="https://github.com/AI-team-UoA" target="_blank">
                            <Button variant="link" size="sm" className='cursor-pointer'>
                                <Image 
                                src={gitHub}
                                alt='github icon'
                                width={100}
                                height={100}
                                className="object-contain size-5 4k:size-8 dark:filter dark:invert"
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
                                className="object-contain size-5 4k:size-8 dark:filter dark:invert"
                                />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
 
export default Footer;