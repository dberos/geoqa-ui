"use client";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image";
import { loginSchema } from "@/schemas";
import { useCookie, useGis, useHello, useLogin } from "@/hooks/use-test";

export default function FormComponent() {

  const { mutate } = useLogin();
  const { data, error, isLoading } = useCookie();
  if (!isLoading && !error) {
    console.log(data?.session);
  }

  const { mutate: helloMutate } = useHello();

  const { data: gisData } = useGis();
  console.log(gisData?.answer);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate({ json: values });
    // form.reset();
  }

  const handleClick = () => {
    helloMutate({ json: { message: "Hello World!" } });
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-y-4"
    >
      <Form {...form}>
        <Image 
        src={'/next.svg'}
        alt="Next.js Logo"
        width={100}
        height={100}
        className="cursor-pointer"
        onClick={handleClick}
        />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  );
}