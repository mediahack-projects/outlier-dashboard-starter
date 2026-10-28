import csv from '#lib/data/sample.csv?raw';
import { parseCsv } from '#lib/data/load-csv.js';

export const prerender = true;

export function load() {
	const rows = parseCsv(csv).map((row) => ({
		label: String(row.month),
		value: Number(row.subscribers)
	}));

	return { rows };
}
