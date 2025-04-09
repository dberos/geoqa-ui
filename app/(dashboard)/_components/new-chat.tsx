import Image from "next/image";
import logo from '../../../public/logo.svg';
import Searchbar from "./searchbar";

const NewChat = () => {
    return ( 
        <div className="size-full flex items-center justify-center flex-col gap-y-4">
            <div className="w-full h-28 md:h-36 4k:h-44 flex items-center justify-center">
                <Image 
                src={logo}
                alt="GeoQA logo"
                width={100}
                height={100}
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