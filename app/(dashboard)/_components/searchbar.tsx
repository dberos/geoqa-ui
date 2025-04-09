"use client";

import {
    SearchCommand,
    SearchCommandGroup,
    SearchCommandInput,
    SearchCommandItem,
    SearchCommandList,
} from "@/components/ui/command"  
import { useEffect, useState } from "react";

const Searchbar = () => {
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const [isMounded, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounded) return null;

    return ( 
        <SearchCommand>
            <SearchCommandInput 
            placeholder="What do you want to learn?" 
            value={inputValue}
            onChangeCapture={handleInputChange}
            clear={setInputValue}
            className="max-xl:text-base"
            />
            {
                inputValue &&
                <SearchCommandList className="h-auto max-h-48 overflow-y-scroll [&::-webkit-scrollbar]:hidden">
                    <SearchCommandGroup heading="Suggestions">
                        <SearchCommandItem>
                            Which countries border Greece?
                        </SearchCommandItem>
                        <SearchCommandItem>
                            Where is the largest river in Greece?
                        </SearchCommandItem>
                        <SearchCommandItem>
                            Where is the largest lake in Greece?
                        </SearchCommandItem>
                    </SearchCommandGroup>
                </SearchCommandList>
            }
        </SearchCommand>
    );
}
 
export default Searchbar;