import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import dedent from "dedent-js";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
    query: z.string()
});

const QueryEdit = ({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        query: dedent( 
        `
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
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    console.log(data);
    setTimeout(() => {
        setIsSubmitting(false);
        form.reset();
        setIsOpen(false);
    }, 2000)
  } 
    return ( 
        <DialogContent className="w-full  2xl:max-w-2xl 2k:max-w-3xl 4k:max-w-4xl">
            <DialogHeader>
            <DialogTitle>
                SPARQL Query
            </DialogTitle>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Textarea
                        spellCheck='false'
                        disabled={isSubmitting}
                        className="resize-none disabled:cursor-text w-full h-54 overflow-y-auto 2xl:text-lg 2k:text-lg 4k:text-xl"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {
                        isSubmitting ?
                        <>
                        <Loader2 className="size-4 mr-1 animate-spin" />
                        Submitting
                        </> :
                        <>
                        Submit
                        </>
                    }
                </Button>
            </form>
            </Form>
        </DialogContent>
    );
}
 
export default QueryEdit;