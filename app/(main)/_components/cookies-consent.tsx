"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const CookiesConsent = () => {

    const [isVisible, setIsVisible] = useState(true);
    const handleClick = () => {
        window.localStorage.setItem('cookiesConsent', JSON.stringify({
            consentedAt: new Date().toISOString()
        }));
        setIsVisible(false);
    }

    useEffect(() => {
        const stored = window.localStorage?.getItem('cookiesConsent');

        if (stored) {
            try {
                const parsed = JSON.parse(stored);

                // Check if parsed is an object and has consentedAt
                if (parsed && typeof parsed === 'object' && 'consentedAt' in parsed) {
                    const consentedAt = parsed.consentedAt;
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

                    // Show the consent only every 6 months or when localstorage is cleared
                    if (new Date(consentedAt) < sixMonthsAgo) {
                        throw new Error("Consent date expired");
                    } 
                    else {
                        setIsVisible(false);
                        document.body.style.overflow = 'unset';
                    }
                } 
                else {
                    // If it's not a valid object with consentedAt, treat as invalid
                    throw new Error("Invalid structure");
                }
            } 
            catch {
                setIsVisible(true);
                window.localStorage?.removeItem('cookiesConsent');
                document.body.style.overflow = 'hidden';
            }
        } 
        else {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        }
    }, [isVisible]);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounted) return null;

    return ( 
        isVisible &&
        <div className="fixed inset-0 z-50 bg-black/70 bg-opacity-70">
            <div className="fixed bottom-0 h-60 md:h-50 xl:h-40 2k:h-60 4k:h-80 w-full bg-neutral-200 dark:bg-neutral-900 
            flex items-center justify-center flex-col lg:flex-row gap-y-4 gap-x-6 2k:gap-x-8 4k:gap-x-10 px-4">
                <p className="text-lg text-center lg:text-xl 2k:text-2xl 4k:text-3xl">
                    We only use cookies that are essential for the operation of our application.
                </p>
                <Button onClick={handleClick} className="2k:text-2xl 2k:p-8 4k:text-3xl 4k:p-10">
                    I understand
                </Button>
            </div>
        </div>
    );
}
 
export default CookiesConsent;