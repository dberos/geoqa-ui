import Image from "next/image";
import logo from "../../../public/GEOQA_logo_no_letters.png";
import googleIcon from "../../../public/google.svg";
import githubIcon from "../../../public/github.svg";
import { Button } from "@/components/ui/button";

const SignIn = () => {
    return ( 
        <div className="size-full grid grid-cols-1 grid-rows-[30%_70%]">
            <div className="flex items-center justify-center flex-col">
                <h2 className="text-3xl lg:text-4xl">
                    Continue to
                </h2>
                <h1 className="text-6xl lg:text-7xl 2k:text-8xl 4k:text-9xl font-semibold">
                    GeoQA
                </h1>
            </div>
            <div className="flex size-full items-center justify-center">
                <div className="h-4/6 w-3/4 md:w-2/4 lg:w-2/4 lg:h-9/12 xl:w-1/4 4k:w-1/6 4k:h-7/12 border-2 border-muted-foreground dark:border-muted rounded-md grid grid-cols-1 grid-rows-[40%_60%]">
                    <div className="relative flex flex-col items-center justify-center">
                        <Image 
                        src={logo}
                        alt="GeoQA logo"
                        width={100}
                        height={100}
                        className="object-contain size-4/6"
                        />
                        <div className="absolute w-full h-0.5 bg-muted-foreground dark:bg-muted bottom-0" />
                    </div>
                    <div className="flex items-center justify-center flex-col gap-y-4">
                        <Button variant="ghost" className="w-5/6 h-10 lg:h-12 2k:h-14 lg:w-4/6 flex gap-x-4 border-2 border-muted-foreground dark:border-muted 2k:text-xl cursor-pointer">
                            <Image 
                            src={githubIcon}
                            alt="GitHub logo"
                            width={100}
                            height={100}
                            className="object-contain size-5 dark:filter dark:invert"
                            />
                            Continue with GitHub
                        </Button>
                        <Button variant="ghost" className="w-5/6 h-10 lg:h-12 2k:h-14 lg:w-4/6 flex gap-x-4 border-2 border-muted-foreground dark:border-muted 2k:text-xl cursor-pointer">
                            <Image 
                            src={googleIcon}
                            alt="Google logo"
                            width={100}
                            height={100}
                            className="object-contain size-5"
                            />
                            Continue with Google
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default SignIn;