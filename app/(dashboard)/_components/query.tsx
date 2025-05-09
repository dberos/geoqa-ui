import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import dedent from "dedent-js";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import QueryEdit from "./query-edit";
import { useState } from "react";

const Query = () => {
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    const [isOpenDesktop, setIsOpenDesktop] = useState(false);
    return ( 
        <div className="size-full rounded-md">
            <div className="h-12 p-2 flex items-center justify-end">
                <Dialog open={isOpenMobile} onOpenChange={setIsOpenMobile}>
                <DialogTrigger asChild>
                    <Button variant='secondary' className="2xl:hidden">
                        Edit
                        <Pencil className="size-4" />
                    </Button>
                </DialogTrigger>
                <QueryEdit setIsOpen={setIsOpenMobile} />
                </Dialog>
            </div>
            <div className="h-[calc(100%-48px)] w-full p-2 2xl:p-4 2k:p-6 2xl:grid 2xl:grid-rows-1 2xl:grid-cols-2">
                <div>
                    <p className="max-h-54 lg:max-h-42 xl:max-h-61 2xl:max-h-66 2k:max-h-91 4k:max-h-106
                    overflow-hidden overflow-y-auto whitespace-pre-wrap break-words
                    text-left text-base 2k:text-lg 4k:text-xl">
                        {
                        dedent( `
                            PREFIX geo: <http://www.opengis.net/ont/geosparql#>
                            PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
                            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                            PREFIX yago: <http://yago-knowledge.org/resource/>
                            PREFIX y2geor: <http://kr.di.uoa.gr/yago2geo/resource/>
                            PREFIX y2geoo: <http://kr.di.uoa.gr/yago2geo/ontology/>
                            PREFIX strdf: <http://strdf.di.uoa.gr/ontology#>
                            PREFIX uom: <http://www.opengis.net/def/uom/OGC/1.0/>
                            PREFIX da4dte: <http://ai.di.uoa.gr/da4dte/ontology/>
                            PREFIX pnyqa: <http://pnyqa.di.uoa.gr/ontology/>
                            PREFIX owl: <http://www.w3.org/2002/07/owl#>

                            SELECT DISTINCT  ?c_image_10 ?cWKT10 ?thumb
                            WHERE
                            { ?c_image_10  rdf:type          da4dte:Image ;
                                        geo:hasGeometry      ?cGeometry10 .
                                ?cGeometry10  geo:asWKT        ?cWKT10 .
                                ?c_image_10  da4dte:hasTimestamp  ?time .
                                ?c_image_10  da4dte:hasThumbnail  ?thumb .
                                OPTIONAL
                                { yago:Belgium  geo:hasGeometry  ?iGeometry1 .
                                    ?iGeometry1  geo:asWKT     ?iWKT1
                                }
                                ?c_image_10  da4dte:hasSnowIcePercentage  ?p_snow_36 . 
                                yago:Belgium  geo:sfIntersects  ?c_image_10
                                FILTER ( ?p_snow_36 > 10.0 )
                            }
                            LIMIT   10
                            `)
                        }
                        
                    </p>
                </div>
                <div className="hidden 2xl:flex items-center justify-center">
                    <Dialog open={isOpenDesktop} onOpenChange={setIsOpenDesktop}>
                    <DialogTrigger asChild>
                        <Button variant='secondary' className="2k:p-6 4k:p-10 2k:text-lg 4k:text-xl">
                            Edit Query
                            <Pencil className="size-4 2k:size-6 4k:size-8" />
                        </Button>
                    </DialogTrigger>
                    <QueryEdit setIsOpen={setIsOpenDesktop} />
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
 
export default Query;