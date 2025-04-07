import Link from "next/link";
import logo from '../../../public/logo.svg';
import Image from "next/image";

const Logo = () => {
    return ( 
        <div className="relative w-full h-44 flex items-center justify-center flex-col gap-y-4">
            <Link href='/'>
                <Image 
                src={logo}
                alt="GeoQA logo"
                width={100}
                height={100}
                className="size-28 object-contain"
                />
            </Link>
            <h1 className="text-2xl font-semibold -mt-5 text-muted-foreground">
                GeoQA
            </h1>
        </div>
    );
}
 
export default Logo;