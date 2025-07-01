"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "@/hooks/use-session";
import { useSignOut } from "@/hooks/use-sign-out";
import { Loader2, SquarePen, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMedia } from "react-use";
import logo from '../../../public/logo.png';
import Image from "next/image";
import { useDashboardMobileMenuStore } from "@/hooks/use-mobile-menu-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useDeleteUser } from "@/hooks/use-delete-user";

const Toolbar = () => {

    const { data: session } = useSession();

    const isMobile = useMedia("(max-width: 1024px)", false);

    const isOpen = useDashboardMobileMenuStore((state) => state.isOpen);
    const setIsOpen = useDashboardMobileMenuStore((state) => state.setIsOpen);

    const [isOpenAvatar, setIsOpenAvatar] = useState(false);

    const { mutate: signOutMutate } = useSignOut();
    const { mutate: deleteMutate } = useDeleteUser();
    
    const { data } = useSession();
    
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCancel = () => {
        setIsOpenAvatar(false);
    }

    const handleDelete = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            deleteMutate({ param: { userId: session?.session?.id || "" } },
                {
                    onSuccess: () => {
                        setIsSubmitting(false);
                        setIsOpenAvatar(false);
                        setIsOpen(false);
                        // Use window instead of router
                        // When signing out, the cookies are cleared from the api
                        // But the set-cookie is already present from middleware
                        // So it needs a full page reload
                        window.location.replace('/');
                    },
                    onError: (error) => {
                        console.error(error);
                        setIsSubmitting(false);
                        setIsOpenAvatar(false);
                        setIsOpen(false);
                        router.push('/error');
                    }
                }
            )
        }, 1000)
    }

    const handleSignOut = () => {
        signOutMutate({},
            {
                onSuccess: () => {
                    setIsOpenAvatar(false);
                    setIsOpen(false);
                    // Use window instead of router
                    // When signing out, the cookies are cleared from the api
                    // But the set-cookie is already present from middleware
                    // So it needs a full page reload
                    window.location.replace('/');
                    
                },
                onError: (error) => {
                    console.error(error);
                    setIsOpenAvatar(false);
                    setIsOpen(false);
                    router.push('/error');
                }
            }
        );
    }

    return ( 
        <div className="w-full h-30 md:h-36 lg:h-40 2k:h-60 4k:h-80 grid grid-rows-2 grid-cols-1">
            <div className="size-full relative flex items-center justify-between p-4 2k:p-8 4k:p-14 border-b-1">
                <Link href='/' onClick={() => setIsOpen(!isOpen)}>
                {
                    isMobile ?
                    <Image 
                    src={logo}
                    alt="GeoQA logo"
                    width={100}
                    height={100}
                    className="object-contain size-12 -mt-3"
                    /> :
                    <p className="text-2xl 2k:text-3xl 4k:text-4xl font-semibold text-muted-foreground">
                        GeoQA
                    </p>
                }
                </Link>
                {
                    data?.session &&
                    <DropdownMenu open={isOpenAvatar} onOpenChange={setIsOpenAvatar}>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src={data?.session.avatarUrl} />
                            <AvatarFallback>
                                <User className="size-4" />
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="text-center">
                        <DropdownMenuLabel>
                            {data?.session.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={e => e.preventDefault()}>
                            <Dialog>
                            <DialogTrigger>
                                Delete Account
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>
                                    Are you absolutely sure?
                                </DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant='secondary' onClick={handleCancel} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button variant='destructive' onClick={handleDelete} disabled={isSubmitting}>
                                        {
                                            isSubmitting ?
                                            <>
                                                <Loader2 className="text-muted-foreground size-4 animate-spin" />
                                                Deleting...
                                            </> :
                                            <>
                                                Confirm
                                            </>
                                        }
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                            </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut}>
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                }
            </div>
            <div className="relative size-full flex items-center justify-around pl-4 pr-4">
                <div className="absolute w-[1px] h-full bg-border left-1/2" />
                <ThemeToggle />
                <Button size='icon' variant='outline' className="cursor-pointer p-2" onClick={() => setIsOpen(!isOpen)}>
                    <Link href='/dashboard'>
                        <SquarePen className="size-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
 
export default Toolbar;
