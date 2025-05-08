import { MessageCircleQuestion } from "lucide-react";

const Question = () => {
    return ( 
        <div className="size-full rounded-md grid grid-cols-1 grid-rows-[60%_40%] 2xl:grid-rows-1 2xl:grid-cols-[70%_30%]">
            <div className="size-full flex items-center justify-center p-4 lg:p-6">
                <p className="text-center text-lg 2xl:text-2xl 2k:text-3xl 4k:text-4xl 2k:leading-10 4k:leading-12 font-semibold overflow-y-auto break-words max-h-44 2xl:max-h-72 2k:max-h-80 4k:max-h-96 lg:max-w-4/5 2xl:max-w-3xl 4k:max-w-5xl">
                    Find 10 images of Piedmont with cloud coverage under 20% and more than 50% vegetation taken in August 2022.
                </p>
            </div>
            <div className="size-full flex items-center justify-center">
                <MessageCircleQuestion className="size-14 md:size-18 2xl:size-20 2k:size-24 4k:size-28" />
            </div>
        </div>
    );
}
 
export default Question;