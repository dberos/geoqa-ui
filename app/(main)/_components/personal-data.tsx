"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usefindPersonalData } from "@/hooks/use-find-personal-data";
import { useRouter } from "next/navigation";

const PersonalData = () => {
    const router = useRouter();
    const { data, error } = usefindPersonalData();
    if (error) {
        console.error(error);
        router.replace('/error');
    }
    return ( 
        <Card className="min-h-82 max-md:w-4/5 lg:w-2/5 4k:w-1/4 4k:min-h-100">
            <CardHeader>
                <CardTitle className="2k:text-xl 4k:text-3xl">
                    Personal data
                </CardTitle>
                <CardDescription className="2k:text-lg 4k:text-xl">
                    This is your personal data saved in our database.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-6 4k:space-y-8 size-full">
                <p className="max-w-full break-all 2k:text-lg 4k:text-xl">
                    id: { data?.user && data.user.id }
                </p>
                <p className="max-w-full break-all 2k:text-lg 4k:text-xl">
                    {
                        data?.user && data.user.githubId &&
                        <>
                            githubId: { data.user.githubId }
                        </>
                    }
                </p>
                <p className="max-w-full break-all 2k:text-lg 4k:text-xl">
                    {
                        data?.user && data.user.googleId &&
                        <>
                            googleId: { data.user.googleId }
                        </>
                    }
                </p>
                <p className="max-w-full break-all 2k:text-lg 4k:text-xl">
                    name: { data?.user && data.user.name }
                </p>
                <p className="max-w-full break-all 2k:text-lg 4k:text-xl">
                   avatarUrl : { data?.user && data.user.avatarUrl }
                </p>
            </CardContent>
            {/* <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
        </Card>
    );
}
 
export default PersonalData;