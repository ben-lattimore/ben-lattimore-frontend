// Structured data for search engines and AI crawlers. `<` is escaped so CMS
// content can never close the script tag early. Sanity returns null for empty
// fields, so null values are dropped rather than published as `"sameAs": null`.
const dropNulls = (_key: string, value: unknown) => (value === null ? undefined : value);

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, dropNulls).replace(/</g, '\\u003c'),
      }}
    />
  );
}
