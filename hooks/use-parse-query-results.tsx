"use client";

import { MessageType, QueryResultsType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Readable } from 'stream';
import csv from 'csv-parser';

const parseQueryResults = (data: string): Promise<Record<string, string>[]> => {
    const results: Record<string, string>[] = [];
    return new Promise((resolve, reject) => {
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
            parseQueryResults(message.queryResults).then((data) => {
                setParsedResults(data);

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