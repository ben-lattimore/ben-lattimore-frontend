import type { PortableTextBlock } from '@portabletext/types';

export function extractDescription(body: PortableTextBlock[] | undefined): string {
  if (!body) return '';
  for (const block of body) {
    if (block._type !== 'block') continue;
    const children = (block as PortableTextBlock & { children?: Array<{ text?: string }> }).children;
    if (!children) continue;
    const text = children.map((c) => c.text ?? '').join('').trim();
    if (text) {
      return text.length > 160 ? `${text.slice(0, 157)}…` : text;
    }
  }
  return '';
}
