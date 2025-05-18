import { useEffect, useState } from "react";
import { fileTypeFromBuffer } from "file-type";
import * as linkify from 'linkifyjs';

export function useFindImages(parsedResults: Record<string, string>[]) {
    const [imageColumns, setImageColumns] = useState<string[]>([]);
    const [imageData, setImageData] = useState<Record<string, string[]>>({});

    // Detect which columns in the first row contain image URLs
    useEffect(() => {
        if (parsedResults.length === 0) {
            setImageColumns([]);
            return;
        }
        const firstRow = parsedResults[0];
        const detectedImageCols: string[] = [];

        const checkUrls = async () => {
            for (const [key, value] of Object.entries(firstRow)) {
                if (typeof value !== "string") continue;

                // Find all URLs in the string value
                const links = linkify.find(value)
                    .filter(link => link.type === "url")
                    .map(link => link.href)
                    .filter(url => url.startsWith("http"));

                // For each URL, check if it points to an image
                for (const url of links) {
                    try {
                        const response = await fetch(url);
                        if (!response.ok) continue;
                        const arrayBuffer = await response.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        const type = await fileTypeFromBuffer(buffer);
                        // If the MIME type is an image, add that column
                        if (type && type.mime.startsWith("image/")) {
                            detectedImageCols.push(key);
                            break; // Only need to find one image per column
                        }
                    } 
                    catch {
                        continue;
                    }
                }
            }
            setImageColumns(Array.from(new Set(detectedImageCols)));
        };
        checkUrls();
    }, [parsedResults]);

    // Extract all image URLs from the detected image columns
    useEffect(() => {
        if (imageColumns.length === 0 || parsedResults.length === 0) {
            setImageData({});
            return;
        }
        const data: Record<string, string[]> = {};
        parsedResults.forEach(row => {
            imageColumns.forEach(col => {
                const value = row[col];
                
                if (typeof value !== "string") return;

                // Find all URLs in the string value
                const urls = linkify.find(value)
                    .filter(link => link.type === "url")
                    .map(link => link.href)
                    .filter(url => url.startsWith("http"));
                if (urls.length > 0) {
                    if (!data[col]) data[col] = [];
                    data[col].push(...urls);
                }
            });
        });
        setImageData(data);
    }, [imageColumns, parsedResults]);

    // Flatten all found image URLs into a single array
    const imageUrls = Object.values(imageData).flat();
    
    return imageUrls.length > 0 ? { imageUrls } : { imageUrls: null };
}