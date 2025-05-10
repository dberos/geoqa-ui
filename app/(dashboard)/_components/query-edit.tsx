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

const QueryEdit = ({ 
    setIsOpen, 
    query
 }: { 
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, 
    query: string | undefined | null 
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        query: dedent(query || "")
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