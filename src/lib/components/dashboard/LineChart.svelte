<!--
	A single-series line chart drawn in SVG.
	- Labels the first and last values directly on the line (no legend).
	- Light horizontal gridlines only.
	- Hover or tap to see each month's value.

	Usage:
	<LineChart title="Subscribers" data={[{ label: '2024-11', value: 12624 }, ...]} />
	`label` is a month written as YYYY-MM.
-->
<script>
	/** @typedef {{ label: string, value: number }} Point */

	/** @type {{ data: Point[], title?: string, height?: number, format?: (n: number) => string }}
	 */
	let {
		data,
		title = '',
		height = 320,
		format = (n) => n.toLocaleString('en-GB')
	} = $props();

	const margin = { top: 28, right: 72, bottom: 32, left: 48 };
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	/** @param {string} label */
	function monthName(label) {
		const [year, month] = label.split('-');
		return `${months[Number(month) - 1]} ${year}`;
	}

	/** Round numbers for the gridlines, e.g. 0, 5k, 10k, 15k. */
	function niceTicks(/** @type {number} */ max, count = 4) {
		const rough = max / count;
		const power = 10 ** Math.floor(Math.log10(rough));
		const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? rough;
		const ticks = [];
		for (let t = 0; t <= max + step * 0.001; t += step) ticks.push(t);
		if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
		return ticks;
	}

	/** @param {number} n */
	function shortNumber(n) {
		if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}m`;
		if (n >= 1000) return `${+(n / 1000).toFixed(1)}k`;
		return String(n);
	}

	let width = $state(640);
	/** @type {number | null} */
	let hovered = $state(null);

	const innerW = $derived(Math.max(width - margin.left - margin.right, 1));
	const innerH = $derived(height - margin.top - margin.bottom);
	const ticks = $derived(niceTicks(Math.max(...data.map((d) => d.value))));
	const yMax = $derived(ticks[ticks.length - 1]);

	const x = $derived((/** @type {number} */ i) => margin.left + (i / Math.max(data.length - 1, 1)) * innerW);
	const y = $derived((/** @type {number} */ v) => margin.top + innerH - (v / yMax) * innerH);

	const path = $derived(data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.value)}`).join(''));
	const area = $derived(
		`${path}L${x(data.length - 1)},${y(0)}L${x(0)},${y(0)}Z`
	);

	const first = $derived(data[0]);
	const last = $derived(data[data.length - 1]);

	/** @param {PointerEvent} event */
	function onPointerMove(event) {
		const svg = /** @type {SVGSVGElement} */ (event.currentTarget);
		const px = event.clientX - svg.getBoundingClientRect().left;
		const i = Math.round(((px - margin.left) / innerW) * (data.length - 1));
		hovered = Math.min(Math.max(i, 0), data.length - 1);
	}
</script>

<figure class="chart">
	{#if title}
		<figcaption>{title}</figcaption>
	{/if}

	<div class="plot" bind:clientWidth={width}>
		{#if data.length > 1}
			<svg
				{width}
				{height}
				role="img"
				aria-label="{title}: {format(first.value)} in {monthName(first.label)} to {format(
					last.value
				)} in {monthName(last.label)}"
				onpointermove={onPointerMove}
				onpointerleave={() => (hovered = null)}
			>
				<!-- Gridlines and y-axis numbers -->
				{#each ticks as t (t)}
					<line class="grid" x1={margin.left} x2={margin.left + innerW} y1={y(t)} y2={y(t)} />
					<text class="axis" x={margin.left - 8} y={y(t)} text-anchor="end" dominant-baseline="middle">
						{shortNumber(t)}
					</text>
				{/each}

				<!-- First and last month along the bottom -->
				<text class="axis" x={x(0)} y={height - 8} text-anchor="start">{monthName(first.label)}</text>
				<text class="axis" x={x(data.length - 1)} y={height - 8} text-anchor="end">
					{monthName(last.label)}
				</text>

				<path class="area" d={area} />
				<path class="line" d={path} />

				<!-- Endpoint labels -->
				<circle class="dot" cx={x(0)} cy={y(first.value)} r="4" />
				<text class="endpoint" x={x(0)} y={y(first.value) - 12} text-anchor="start">
					{format(first.value)}
				</text>
				<circle class="dot" cx={x(data.length - 1)} cy={y(last.value)} r="4" />
				<text class="endpoint" x={x(data.length - 1) + 10} y={y(last.value)} dominant-baseline="middle">
					{format(last.value)}
				</text>

				<!-- Hover readout -->
				{#if hovered !== null}
					{@const d = data[hovered]}
					{@const hx = x(hovered)}
					{@const flip = hx > margin.left + innerW / 2}
					<line class="crosshair" x1={hx} x2={hx} y1={margin.top} y2={margin.top + innerH} />
					<circle class="dot ring" cx={hx} cy={y(d.value)} r="5" />
					<g transform="translate({flip ? hx - 10 : hx + 10}, {margin.top})">
						<rect class="tip" x={flip ? -112 : 0} y="0" width="112" height="44" rx="6" />
						<text class="tip-label" x={flip ? -102 : 10} y="18">{monthName(d.label)}</text>
						<text class="tip-value" x={flip ? -102 : 10} y="35">{format(d.value)}</text>
					</g>
				{/if}
			</svg>
		{/if}
	</div>
</figure>

<style>
	.chart {
		margin: 0;
		padding: var(--space-4);
		background: var(--color-surface);
		border-radius: var(--radius);
	}

	figcaption {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-bold);
		margin-bottom: var(--space-3);
	}

	svg {
		display: block;
		overflow: visible;
		touch-action: pan-y;
		font-family: var(--font-family);
	}

	.grid {
		stroke: var(--color-gridline);
		stroke-width: 1;
	}

	.axis {
		fill: var(--color-text-muted);
		font-size: 12px;
	}

	.line {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.area {
		fill: var(--color-brand-wash);
	}

	.dot {
		fill: var(--color-brand);
		stroke: var(--color-surface);
		stroke-width: 2;
	}

	.endpoint {
		fill: var(--color-text);
		font-size: 13px;
		font-weight: var(--font-weight-bold);
	}

	.crosshair {
		stroke: var(--color-text-muted);
		stroke-width: 1;
	}

	.tip {
		fill: var(--color-text);
	}

	.tip-label {
		fill: var(--color-gridline);
		font-size: 11px;
	}

	.tip-value {
		fill: var(--color-surface);
		font-size: 14px;
		font-weight: var(--font-weight-bold);
	}
</style>
