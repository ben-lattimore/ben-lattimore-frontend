export function formatTitle(raw: string): string {
  return raw.replace(/ - /g, ' — ');
}
