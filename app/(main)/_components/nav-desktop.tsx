"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useWindowScroll } from "react-use";
import logo from "../../../public/logo.png";
import { Loader2, LogIn, User } from "lucide-react";
import { useNavbarStyle } from "@/hooks/use-navbar-style";
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSignOut } from "@/hooks/use-sign-out";
import { usePathname, useRouter } from "next/navigation";
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

const NavDesktop = () => {

    const { y } = useWindowScroll();

    const { isAboveHero } = useNavbarStyle("homeHeroId", "mainNavbarDesktopId");

    const { data } = useSession();

    const { mutate: signOutMutate } = useSignOut();
    const { mutate: deleteMutate } = useDeleteUser();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpenAvatar, setIsOpenAvatar] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const isOnLegalPage = pathname.startsWith("/legal");

    const handleCancel = () => {
        setIsOpenAvatar(false);
    }

    const handleDelete = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            deleteMutate({ param: { userId: data?.session?.id || "" } },
                {
                    onSuccess: () => {
                        setIsSubmitting(false);
                        setIsOpenAvatar(false);
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
                    // Use window instead of router
                    // When signing out, the cookies are cleared from the api
                    // But the set-cookie is already present from middleware
                    // So it needs a full page reload
                    window.location.replace('/');
                },
                onError: (error) => {
                    console.error(error);
                    router.push('/error');
                }
            }
        );
    }
      
    return ( 
        <nav 
        id="mainNavbarDesktopId" 
        className={cn(
            "h-20 2k:h-28 4k:h-36 w-full p-8 flex items-center justify-between fixed z-50",
            y > 20 && "shadow-sm dark:shadow-neutral-700",
            isAboveHero ? "bg-inherit backdrop-blur-xs" : "bg-background backdrop-blur-none"
        )}>
            <div className="flex items-center justify-center flex-row">
                <Link href='/' className="4k:ml-6">
                    <Image
                    src={logo}
                    alt='logo'
                    priority
                    height={100}
                    width={100}
                    className="size-14 2k:size-18 4k:size-24 object-contain pointer-events-none"
                    />
                </Link>
                <ul className="flex items-center space-x-10 2k:space-x-12 ml-8 2k:ml-20">
                    <li>
                        <Button 
                        variant="link" 
                        size="sm" 
                        className='cursor-pointer'
                        >
                            <Link href='/dashboard' className="2k:text-lg 4k:text-xl">
                                Dashboard
                            </Link>
                        </Button>
                    </li>
                    <li>
                        <Button 
                        variant="link" 
                        size="sm" 
                        className={cn(
                            'cursor-pointer',
                            isOnLegalPage && 'text-muted-foreground'
                        )}
                        >
                            <Link href='/legal' className="2k:text-lg 4k:text-xl">
                                Legal
                            </Link>
                        </Button>
                    </li>
                </ul>
            </div>
            <div className="flex items-center justify-center gap-x-6 2k:gap-x-12">
                <ThemeToggle />
                {
                    data?.session ? 
                    <DropdownMenu modal={false} open={isOpenAvatar} onOpenChange={setIsOpenAvatar}>
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
                     :
                    <Button className='cursor-pointer 2k:py-5 4k:py-6'>
                        <Link href="/auth/sign-in" className="flex items-center justify-center gap-x-2 2k:text-lg 4k:text-xl">
                            Sign In
                            <LogIn className="size-4 2k:size-5 4k:size-6" />
                        </Link>
                    </Button>
                }
                
            </div>
            
        </nav>
     );
}
 
export default NavDesktop;