"use client";

import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const Map = ({ wktValues }: { wktValues: string[] | null }) => {
    const LeafletMap = useMemo(() => dynamic(
        () => import('../_components/leaflet-map'),
        { 
          loading: () => {
            return (
                <div className='size-full flex items-center justify-center'>
                    <Loader2 className='size-10 text-muted-foreground animate-spin' />
                </div>
            )
          },
          ssr: false
        }
      ), [])
    return ( 
        <div className="size-full rounded-md z-0">
            <LeafletMap wktValues={wktValues} />
        </div>
    );
}
 
export default Map;