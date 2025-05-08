import Image from "next/image";
import error from "../../../public/error.svg";

const ErrorComponent = () => {
    return ( 
        <div className="relative size-full flex flex-col items-center justify-center md:gap-y-10 2k:gap-y-20 4k:gap-y-32">
            <h1 className="text-3xl xl:text-4xl 2k:text-6xl text-center pr-10 pl-10">
                Something went wrong...
            </h1>
            <Image 
            src={error}
            alt='Error illustration'
            width={100}
            height={100}
            priority
            className="object-contain h-1/3 w-2/3 md:w-1/2"
            />
        </div>
    );
}
 
export default ErrorComponent;