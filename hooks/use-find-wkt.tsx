"use client";

import { useEffect, useState } from "react";
import { parse } from "wellknown";

export function useFindWkts(parsedResults: Record<string, string>[]) {
    const [wktColumns, setWktColumns] = useState<string[]>([]);
    const [wktValues, setWktValues] = useState<string[] | null>(null);

    // Detect which columns in the first row contain WKT strings
    useEffect(() => {
        if (parsedResults.length === 0) {
            setWktColumns([]);
            return;
        }
        const firstRow = parsedResults[0];
        // Check each value in the first row to see if it parses as WKT
        // And map the column names
        const detected = Object.entries(firstRow)
            .filter(([_, value]) => {
                if (typeof value !== "string") return false;
                // Remove any HTML tags and trim whitespace
                const possibleWkt = value.replace(/<[^>]+>\s*/, "").trim();
                // Try to parse as WKT
                const parsedVal = parse(possibleWkt);
                // If parsing returns an object, consider it a WKT
                return parsedVal && typeof parsedVal === "object";
            })
            .map(([key]) => key); 
        setWktColumns(detected);
    }, [parsedResults]);

    // Extract all WKT values from the detected columns
    useEffect(() => {
        if (wktColumns.length === 0 || parsedResults.length === 0) {
            setWktValues(null);
            return;
        }
        const values: string[] = [];
        // For each row and each detected WKT column, extract and validate WKT strings
        parsedResults.forEach(row => {
            wktColumns.forEach(col => {
                const val = row[col];
                if (typeof val !== "string") return;
                // Remove any HTML tags and trim whitespace
                const possibleWkt = val.replace(/<[^>]+>\s*/, "").trim();
                // If it parses as WKT, add to the list
                if (parse(possibleWkt)) {
                    values.push(possibleWkt);
                }
            });
        });
        setWktValues(values.length > 0 ? values : null);
    }, [wktColumns, parsedResults]);

    return { wktValues };
}