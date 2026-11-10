# benlattimore.com — frontend

Next.js site for [benlattimore.com](https://www.benlattimore.com): a portfolio of AI and web projects plus long-form writing. Content comes from Sanity (see the companion `ben-lattimore-sanity` repo).

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run lint
npx tsc --noEmit
```

There are no environment variables. The Sanity project (`9cci858w` / `production`) is read publicly and configured in `src/lib/sanity.ts`.

## Layout

- `src/app/page.tsx`: home page, server-rendered; interactivity lives in `src/components/HomeView.tsx`
- `src/app/{robots,sitemap}.ts`, `feed.xml`, `llms.txt`, `opengraph-image.tsx`: SEO/GEO routes; site identity and canonical URL live in `src/lib/site.ts`
- `src/app/writing/[slug]`, `src/app/projects/[slug]`: long-form pages, pre-rendered from Sanity
- `src/app/api/writing/[slug]/markdown`: Markdown download for articles with downloads enabled
- `src/lib/queries.ts`: every GROQ query; keep it in sync with the Sanity schemas and `src/types`
