import Image from "next/image";
import authenticating from "../../../public/authenticating.svg";

const Authenticating = () => {
    return ( 
        <div className="size-full flex flex-col items-center justify-center gap-y-10 2k:gap-y-14">
            <h1 className="text-4xl 2k:text-6xl">
                Authenticating
                <span className="ml-1 animate-pulse duration-[3000ms] text-muted-foreground">
                    ...
                </span>
            </h1>
            <Image 
            src={authenticating}
            alt="illustration of a sleeping creature"
            width={100}
            height={100}
            priority
            className="object-contain h-1/2 w-2/3 md:h-2/5 max-md:ml-5 2k:h-1/3 animate-pulse duration-[3000ms] pointer-events-none"
            />
        </div>
    );
}
 
export default Authenticating;