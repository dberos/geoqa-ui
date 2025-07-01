import Image from "next/image";
import experts from "../../../public/home_personas_experts.svg";
import nonExperts from "../../../public/home_personas_non_experts.svg";

const Personas = () => {
    return ( 
        <>
        <div className="h-10 2k:h-16 4k:h-22 w-full bg-gradient-to-b from-neutral-400 to-transparent backdrop-blur-xs
         dark:backdrop-blur-none dark:bg-gradient-to-b dark:from-neutral-800 dark:to-neutral-950" 
         />
            <div className="h-20 lg:h-32 w-full flex items-center justify-center lg:justify-start">
                <h2 className="lg:ml-20 text-2xl 4k:text-4xl border-2 border-neutral-600 border-dashed p-3 rounded-sm bg-neutral-200 dark:bg-neutral-900">
                    GeoQA is for everyone
                </h2>
            </div>
            <div className="w-full h-[1200px] md:h-[700px] lg:h-[500px] 4k:h-[700px] flex flex-col">
                <div className="max-lg:mt-6 h-2/4 w-full flex flex-col lg:flex-row">
                    <div className="h-2/4 lg:h-full w-full lg:w-1/5 4k:w-2/5 lg:border-r-2 flex items-center justify-center order-2 lg:order-1">
                        <Image 
                        src={nonExperts}
                        alt={"non-experts"}
                        width={100}
                        height={100}
                        className="object-contain size-4/6 lg:size-5/6 max-md:-mt-20 pointer-events-none"
                        />
                    </div>
                    <div className="h-2/4 lg:h-full w-full lg:w-4/5 4k:w-3/5 lg:ml-10 flex flex-col order-1 lg:order-2 lg:p-6">
                        <h3 className="text-xl 4k:text-3xl p-4 h-10 w-full flex items-center justify-center lg:justify-start">
                            Non - Expert users
                        </h3>
                        <p className="text-base lg:text-lg 4k:text-2xl text-center lg:text-start mt-4 p-4 max-w-7xl 4k:max-w-9xl">
                            Get started by posing any geographic question. Learn anything.
                            GeoQA is built on top of YAGO2geo knowledge graph, enriching it
                            with more known geospatial datasets. It aims to answer any
                            geographic question and allow users to view and edit
                            the query that brought the results.
                        </p>
                    </div>
                </div>
                <div className="h-2/4 w-full flex flex-col lg:flex-row lg:border-t-2">
                    <div className="h-2/4 lg:h-full w-full lg:w-1/5 4k:w-2/5 lg:border-r-2 flex items-center justify-center order-2 lg:order-1">
                            <Image 
                            src={experts}
                            alt={"experts"}
                            width={100}
                            height={100}
                            className="object-contain size-4/6 lg:size-5/6 pointer-events-none"
                            />
                        </div>
                        <div className="h-2/4 lg:h-full w-full lg:w-4/5 4k:w-3/5 lg:ml-10 flex flex-col order-1 lg:order-2 lg:p-6">
                            <h3 className="text-xl 4k:text-3xl p-4 h-10 w-full flex items-center justify-center lg:justify-start">
                                Expert users
                            </h3>
                            <p className="text-base lg:text-lg 4k:text-2xl text-center lg:text-start mt-4 p-4 max-w-7xl 4k:max-w-9xl">
                                You may edit the query and be part of the procedure that
                                generates data. Learn together with us. GeoQA is designed
                                using the latest technologies from the research areas of
                                Natural Language Processing, Knowledge Graph embeddings,
                                Semantic Web and Linked Geospatial data of the department
                                of Informatics & Telecommunications of National and 
                                Kapodistrian University of Athens, Greece.
                            </p>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default Personas;