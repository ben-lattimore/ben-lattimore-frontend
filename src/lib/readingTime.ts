const CHARS_PER_MINUTE = 1125;

export function readingMinutes(charCount: number | undefined): number {
  if (!charCount || charCount <= 0) return 1;
  return Math.max(1, Math.ceil(charCount / CHARS_PER_MINUTE));
}

export function readingLabel(charCount: number | undefined): string {
  return `~${readingMinutes(charCount)} min read`;
}
