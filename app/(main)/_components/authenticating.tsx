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
            className="object0-contain h-3/6 w-4/6 max-md:ml-10 lg:h-2/6 animate-pulse duration-[3000ms] pointer-events-none"
            />
        </div>
    );
}
 
export default Authenticating;