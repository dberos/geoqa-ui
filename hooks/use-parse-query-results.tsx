"use client";

import { MessageType, QueryResultsType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Readable } from 'stream';
import csv from 'csv-parser';

// Parse CSV string data into an array of objects
const parseQueryResults = (data: string): Promise<Record<string, string>[]> => {
    const results: Record<string, string>[] = [];
    return new Promise((resolve, reject) => {
        // Create a readable stream from the data string and pipe it to the CSV parser
        // Then collect each parsed row
        // Resolve on success or reject on error
        Readable.from([data])
            .pipe(csv())
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
};

export const useParseQueryResults = (message: MessageType) => {
    const [parsedResults, setParsedResults] = useState<QueryResultsType[]>([]);
    const [columns, setColumns] = useState<ColumnDef<QueryResultsType>[]>([]);

    useEffect(() => {
        if (message.queryResults) {
            // Parse the CSV data
            parseQueryResults(message.queryResults).then((data) => {
                setParsedResults(data);

                // If there is data, generate column definitions for the table
                if (data.length > 0) {
                    const cols: ColumnDef<QueryResultsType>[] = Object.keys(data[0]).map((key) => ({
                        id: key,
                        accessorKey: key,
                        header: key,
                    }));
                    setColumns(cols);
                }
            });
        }
    }, [message]);

    return { parsedResults, columns };
}