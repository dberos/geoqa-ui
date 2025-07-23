import mapImage from "../../../public/home_services_map.svg";
import imageImage from "../../../public/home_services_images.svg";
import dataImage from "../../../public/home_services_data.svg";
import Image from "next/image";

const Services = () => {
    return ( 
        <div className="mt-10 mb-14 lg:mt-20 2k:mt-24 4k:mt-32 w-full h-[600px] md:h-[550px] lg:h-[400px] 4k:h-[600px] 4k:pl-64 4k:pr-64 grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1">
            <div className="flex items-center flex-col">
                <h2 className="text-xl lg:text-2xl 4k:text-3xl 4k:mt-10 h-14 border-2 rounded-sm border-neutral-600 border-dashed p-3 flex items-center bg-neutral-200 dark:bg-neutral-900">
                    We bring you topographical results
                </h2>
                <h3 className="mt-2 text-lg lg:text-xl 4k:text-2xl text-muted-foreground">
                    Map based - Images - Plain data
                </h3>
                <p className="p-6 xl:p-0 text-base lg:text-lg 4k:text-2xl lg:mt-7 xl:mt-15 4k:mt-20 max-w-lg 4k:max-w-3xl text-center">
                    Explore spatial insights, satellite imagery, textual answers and table data with ease.
                    <br />
                    Just remember, the engine doesn&apos;t keep track of your requests,
                    so it can&apos;t answer follow-up questions.
                </p>
            </div>
            <div className="flex items-center justify-center 4k:justify-start 4k:items-start">
                <div className="size-full lg:size-4/6 4k:size-4/6">
                <div className="h-1/3 lg:h-1/2 w-full flex flex-row">
                    <div className="h-full w-1/2 flex items-center justify-center lg:justify-end lg:mr-14 4k:mr-20">
                        <Image 
                        src={mapImage}
                        alt='map'
                        width={100}
                        height={100}
                        className="object-contain size-28 lg:size-32 4k:size-56 pointer-events-none"
                        />
                    </div>
                    <div className="h-full w-1/2 flex items-center justify-center lg:justify-start lg:ml-14 4k:ml-20">
                        <Image 
                        src={imageImage}
                        alt='image'
                        width={100}
                        height={100}
                        className="object-contain size-28 lg:size-32 4k:size-56 pointer-events-none"
                        />
                    </div>
                </div>
                <div className="h-1/2 w-full flex items-center justify-center">
                    <Image 
                    src={dataImage}
                    alt='data'
                    width={100}
                    height={100}
                    className="object-contain size-40 lg:size-44 4k:size-72 4k:mt-32 pointer-events-none"
                    />
                </div>
                </div>
            </div>
        </div>
    );
}
 
export default Services;