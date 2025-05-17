"use client";

import { useEffect, useState } from "react";
import { fileTypeFromBuffer } from "file-type";
import * as linkify from 'linkifyjs';

export function useFindImages(parsedResults: Record<string, string>[]) {
    const [imageColumns, setImageColumns] = useState<string[]>([]);
    const [imageData, setImageData] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (parsedResults.length === 0) return;

        const firstRow = parsedResults[0];
        const detectedImageCols: string[] = [];

        const checkUrls = async () => {
            for (const [key, value] of Object.entries(firstRow)) {
                if (typeof value !== "string") continue;

                const links = linkify.find(value)
                    .filter(link => link.type === "url")
                    .map(link => link.href);

                for (const url of links) {
                    if (!url.startsWith("http")) continue;

                    try {
                        const response = await fetch(url);
                        if (!response.ok) continue;

                        const arrayBuffer = await response.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        const type = await fileTypeFromBuffer(buffer);

                        if (type && type.mime.startsWith("image/")) {
                            detectedImageCols.push(key);
                            break;
                        }
                    } catch {
                        continue;
                    }
                }
            }

            setImageColumns(Array.from(detectedImageCols));
        };

        checkUrls();
    }, [parsedResults]);

    useEffect(() => {
        if (imageColumns.length === 0 || parsedResults.length === 0) return;

        const data: Record<string, string[]> = {};

        parsedResults.forEach((row) => {
            imageColumns.forEach((col) => {
                const value = row[col];
                if (typeof value !== "string") return;

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

    const imageUrls = Object.values(imageData).flat();

    return imageUrls.length > 0 ? { imageUrls } : { imageUrls: null };
}
