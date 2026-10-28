<script>
	import LineChart from '#lib/components/dashboard/LineChart.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	const first = $derived(data.rows[0]);
	const last = $derived(data.rows[data.rows.length - 1]);
	const change = $derived(Math.round(((last.value - first.value) / first.value) * 100));
</script>

<svelte:head>
	<title>Outlier dashboard</title>
</svelte:head>

<main>
	<header>
		<p class="eyebrow">Outlier dashboard</p>
		<h1>Subscribers grew {change}% over the past 24 months</h1>
	</header>

	<LineChart title="Newsletter subscribers, monthly" data={data.rows} />

	<p class="source">Source: example data in <code>src/lib/data/sample.csv</code></p>
</main>

<style>
	main {
		max-width: 960px;
		margin: 0 auto;
		padding: var(--space-5) var(--space-3);
	}

	.eyebrow {
		margin: 0 0 var(--space-2);
		color: var(--color-brand);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-bold);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	h1 {
		margin: 0 0 var(--space-4);
		font-size: var(--font-size-xl);
		line-height: 1.2;
	}

	.source {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}
</style>
