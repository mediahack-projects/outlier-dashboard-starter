/**
 * Turn simple CSV text (a header row, then comma-separated values) into an
 * array of objects. Columns that look like numbers become numbers.
 * Does not handle quoted values containing commas.
 *
 * @param {string} text
 * @returns {Record<string, string | number>[]}
 */
export function parseCsv(text) {
	const [header, ...lines] = text.trim().split(/\r?\n/);
	const columns = header.split(',').map((c) => c.trim());

	return lines
		.filter((line) => line.trim() !== '')
		.map((line) => {
			const cells = line.split(',');
			/** @type {Record<string, string | number>} */
			const row = {};
			columns.forEach((col, i) => {
				const raw = (cells[i] ?? '').trim();
				const num = Number(raw);
				row[col] = raw !== '' && !Number.isNaN(num) ? num : raw;
			});
			return row;
		});
}
