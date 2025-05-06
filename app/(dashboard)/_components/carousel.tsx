import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel as CarouselUI,
  CarouselContent as CarouselContentUI,
  CarouselItem as CarouselItemUI,
  CarouselNext as CarouselNextUI,
  CarouselPrevious as CarouselPreviousUI,
} from "@/components/ui/carousel";
import Image from "next/image";
import homeHero from "../../../public/home_hero.jpg";

const Carousel = () => {
    return ( 
        <div className="size-full rounded-md flex items-center justify-center">
            <CarouselUI 
            className="w-5/6 md:w-4/5 h-72 md:h-64 lg:h-56 xl:h-72 2k:h-96 4k:h-[450px] rounded-md"
            opts={{
                watchDrag: false
            }}
            >
                <CarouselContentUI>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItemUI 
                        key={index} 
                        className="w-full h-72 md:h-64 lg:h-56 xl:h-72 2k:h-96 4k:h-[450px]"
                        >
                            <div className="p-1 size-full">
                                <Card className="size-full border-8 p-0">
                                    <CardContent className="size-full relative">
                                        <Image 
                                        src={homeHero}
                                        alt="Home hero"
                                        fill
                                        quality={100}
                                        className="object-fill rounded-md"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItemUI>
                    ))}
                </CarouselContentUI>
                <CarouselPreviousUI />
                <CarouselNextUI />
            </CarouselUI>
        </div>
    );
}
 
export default Carousel;