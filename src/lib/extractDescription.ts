import type { PortableTextBlock } from '@portabletext/types';

const MAX_LENGTH = 160;

type TextBlock = PortableTextBlock & {
  style?: string;
  listItem?: string;
  children?: Array<{ text?: string }>;
};

// A paragraph with no closing punctuation (a standfirst such as "Taking the
// paperwork out of care training assessments") gets a full stop when another
// paragraph follows, so the two don't run together in a description.
const ENDS_SENTENCE = /[.!?…:;]["'”’)]?$/;
const joinParagraphs = (text: string, next: string) =>
  `${ENDS_SENTENCE.test(text) ? text : `${text}.`} ${next}`;

// Plain text of a body's ordinary paragraphs. Headings, quotes and list items
// are skipped, so a write-up that opens with a "Problem" heading still yields
// a real sentence. Stops once `minLength` characters have been collected.
export function paragraphText(
  body: PortableTextBlock[] | undefined,
  minLength = Infinity,
): string {
  let text = '';
  for (const block of (body ?? []) as TextBlock[]) {
    if (block._type !== 'block' || block.listItem) continue;
    if (block.style && block.style !== 'normal') continue;
    const blockText = (block.children ?? []).map((c) => c.text ?? '').join('').trim();
    if (!blockText) continue;
    text = text ? joinParagraphs(text, blockText) : blockText;
    if (text.length >= minLength) break;
  }
  return text;
}

// Meta description: opening paragraphs, cut at a word boundary to 160 characters.
export function extractDescription(body: PortableTextBlock[] | undefined): string {
  const text = paragraphText(body, MAX_LENGTH);
  if (text.length <= MAX_LENGTH) return text;
  const cut = text.slice(0, MAX_LENGTH - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = lastSpace > MAX_LENGTH / 2 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed.replace(/[\s,;:.—-]+$/, '')}…`;
}
