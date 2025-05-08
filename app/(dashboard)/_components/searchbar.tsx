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

    const [isSelected, setIsSelected] = useState(false);
    const handleSelect = (text?: string) => {
        if (text) {
            setInputValue(text);
            // Loading state
            setIsSelected(true);
            setTimeout(() => {
                setInputValue('');
                setIsSelected(false);
            }, 200)
        }
        else {
            setInputValue('');
        }
    }

    const [isMounded, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounded) return null;

    return ( 
        <SearchCommand>
            <SearchCommandInput 
            placeholder="How may I assist you?" 
            disabled={isSelected}
            value={inputValue}
            onChangeCapture={handleInputChange}
            select={handleSelect}
            isSelected={isSelected}
            className="max-xl:text-base disabled:cursor-default"
            />
            {
                /**
                 * Use this logic to show suggestions if needed
                 * The user input command group is hidden anyway
                 * Having this group also prevents auto selecting suggestions if inluded
                 * SearchCommandGroup also has border-t
                 */
                inputValue && !isSelected &&
                <SearchCommandList className="h-auto max-h-48 overflow-y-auto">
                    <SearchCommandGroup 
                    heading="User Input" 
                    className="hidden"
                    >
                        <SearchCommandItem
                        value={inputValue}
                        className="data-[disabled]:pointer-events-auto cursor-pointer data-[disabled]:opacity-80 dark:data-[disabled]:opacity-50 max-xl:text-base"
                        onSelect={() => handleSelect(inputValue)}
                        >
                            {inputValue}
                        </SearchCommandItem>
                    </SearchCommandGroup>
                </SearchCommandList>
            }
        </SearchCommand>
    );
}
 
export default Searchbar;