import { CirclePlus } from "lucide-react";
import Link from "next/link";

const Add = () => {
    return ( 
        <div className="w-full h-8 flex items-center justify-end pr-4">
            <Link href='/dashboard'>
                <CirclePlus className="size-7 text-muted-foreground" />
            </Link>
        </div>
    );
}
 
export default Add;