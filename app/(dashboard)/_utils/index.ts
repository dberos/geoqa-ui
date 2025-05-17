import { Readable } from 'stream';
import csv from 'csv-parser';

export const parseQueryResults = (data: string): Promise<Record<string, string>[]> => {
    const results: Record<string, string>[] = [];
    return new Promise((resolve, reject) => {
        Readable.from([data])
            .pipe(csv())
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}
