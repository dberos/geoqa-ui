import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import dedent from "dedent-js";
import { useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { usePostChatMessage, usePostMessage } from "@/hooks/use-post-message";
import { usePathname, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
    query: z.string()
});

const Query = ({ query }: { query: string | undefined | null }) => {
    const router = useRouter();
    const pathname = usePathname();
    const segments = pathname.split('/');
    const chatId = segments[segments.length - 1];

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            query: dedent(query || "")
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { mutate: postChatMessageMutate } = usePostChatMessage();
    const { mutate: messageMutate } = usePostMessage();

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsSubmitting(true);
        setTimeout(() => {
            postChatMessageMutate({ json: data, param: { chatId } },
                {
                    onSuccess: (data) => {
                        setIsSubmitting(false);
                        form.reset();
                        setTimeout(() => {
                            // Narrow down the type for type safety
                            // It can be either { messageId } or { error }
                            // Error will be caught from !response.ok in the hook
                            // And here with onError
                            // But typescript needs to know
                            if ('messageId' in data) {
                                messageMutate({ param: { messageId: data.messageId } },
                                    {
                                        onError: () => {
                                            router.replace('/error');
                                        }
                                    }
                                )
                            }
                            else {
                                router.replace('/error');
                            }
                            
                        }, 1000);
                    },
                    onError: () => {
                        setIsSubmitting(false);
                        form.reset();
                        router.replace('/error');
                    }
                }
            )
        }, 200)
      } 

    return ( 
        <div className="size-full rounded-md">
            <div className="h-12 2xl:h-11 2k:h-12 p-2 flex items-center justify-end">
                <Button 
                variant='secondary' 
                className="2xl:hidden"
                onClick={form.handleSubmit(onSubmit)}
                >
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
                    <Pencil className="size-4" />
                </Button>
            </div>
            <div className="h-[calc(100%-48px)] w-full p-2 2xl:p-4 2k:p-6 2xl:grid 2xl:grid-rows-1 2xl:grid-cols-2">
                <div>
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
                                    className="resize-none disabled:cursor-text 2xl:text-lg
                                    max-h-54 lg:max-h-42 xl:max-h-61 2xl:max-h-66 2k:max-h-88 4k:max-h-112
                                    overflow-hidden overflow-y-auto whitespace-pre-wrap break-words
                                    text-left text-base 2k:text-lg 4k:text-xl"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </form>
                    </Form>
                </div>
                <div className="hidden 2xl:flex items-center justify-center">
                    <Button 
                    disabled={isSubmitting}
                    variant='secondary' 
                    className="2k:p-6 4k:p-10 2k:text-lg 4k:text-xl"
                    onClick={form.handleSubmit(onSubmit)}
                    >
                        {
                            isSubmitting ?
                            <>
                            <Loader2 className="size-4 mr-1 animate-spin" />
                            Submitting
                            </> :
                            <>
                            Submit Query
                            </>
                        }
                        <Pencil className="size-4 2k:size-6 4k:size-8" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
 
export default Query;