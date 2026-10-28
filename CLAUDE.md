# Working on the Outlier dashboard

The people asking you for changes here are usually **not developers**. They know what they want the dashboard to show, not how SvelteKit works. Keep things simple, safe, and explained.

## What this project is

A small SvelteKit website (Svelte 5, plain JavaScript, no TypeScript) that shows charts made from CSV files. It deploys to Vercel. Run it locally with `npm run dev`, and check it with `npm run build`.

```
src/
  lib/
    styles/tokens.css          ← brand colours, fonts, spacing (the only place these are defined)
    data/                      ← all data files (CSV) and the code that reads them
    components/dashboard/      ← all charts and dashboard building blocks
  routes/
    +page.svelte               ← the home page
    +page.js                   ← loads the data for the home page
```

## Rules

1. **Use the design tokens.** Every colour, font, and spacing value comes from `src/lib/styles/tokens.css`, e.g. `color: var(--color-brand)`. Never type a hex code, font name, or one-off size into a component. If a new token is genuinely needed, add it to `tokens.css` and say so.
   - Brand red: `--color-brand` (`#F72D5A`)
   - Cream background: `--color-background` (`#F5F0E8`)
   - Font: Inter, via `--font-family`

2. **Components go in `src/lib/components/dashboard/`.** Reuse what's already there (e.g. `LineChart.svelte`) before making something new. Charts follow the existing house style: thin lines, labels on the first and last points, light gridlines, no legend.

3. **Load data only from `src/lib/data/`.** Put new CSV files there and read them in a `+page.js` file with `import csv from '#lib/data/<file>.csv?raw'` and `parseCsv` from `#lib/data/load-csv.js`. Don't fetch data from other websites or put data straight into components.

4. **Always use the base path for links and assets.** The site may be hosted under a sub-path, so never hard-code a URL that starts with `/`.
   - This project uses SvelteKit 3, which replaced `base` with two functions from `$app/paths`. Use those:
     ```svelte
     <script>
       import { resolve, asset } from '$app/paths';
     </script>

     <a href={resolve('/about')}>About</a>
     <img src={asset('/logo.png')} alt="Outlier logo" />
     ```
   - `resolve()` is for links to pages. `asset()` is for files in the `static/` folder.
   - Inside `src/`, import files with `#lib/...`. In SvelteKit 3, `$lib/...` no longer works.

5. **Ask before adding dependencies.** Don't run `npm install <anything>` or edit the dependency lists in `package.json` without first explaining what the package is, why it's needed, and whether it can be done without one. Wait for a yes.

6. **Explain changes in plain English.** After each change, say what you changed and what the person will see, in everyday language. Avoid jargon. If you have to use a technical term, explain it in a few words. Say which files you touched.

7. **Commit and push after each working change.** Once a change works:
   1. Run `npm run build` and make sure it finishes without errors. If it fails, fix it or explain the problem. Never push a broken build.
   2. Commit with a short, clear message that says what changed (e.g. "Add monthly revenue chart to home page").
   3. Push to GitHub so Vercel deploys it.

   Keep each commit to one change, so it's easy to undo.

## Before you finish

- `npm run build` passes.
- No hard-coded colours, fonts, or `/`-prefixed links.
- You've explained the change in plain English and pushed it.
