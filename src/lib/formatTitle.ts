export function formatTitle(raw: string): string {
  return raw.replace(/ - /g, ' — ');
}

// "Title: Subtitle", used for page titles, share text, feeds and title cards.
export function formatArticleTitle({ title, subtitle }: { title: string; subtitle?: string }): string {
  const main = formatTitle(title);
  return subtitle ? `${main}: ${formatTitle(subtitle)}` : main;
}

export function formatProjectTitle({
  clientName,
  subtitle,
}: {
  clientName: string;
  subtitle?: string;
}): string {
  return subtitle ? `${clientName}: ${subtitle}` : clientName;
}
