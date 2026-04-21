import type { PortableTextBlock } from '@portabletext/types';
import { urlFor } from '@/lib/sanity';

type Span = {
  _type: 'span';
  _key?: string;
  text?: string;
  marks?: string[];
};

type MarkDef = {
  _key: string;
  _type: string;
  href?: string;
};

type SanityImageBlock = PortableTextBlock & {
  _type: 'image';
  asset?: unknown;
  alt?: string;
  caption?: string;
};

type DividerBlock = PortableTextBlock & {
  _type: 'divider';
};

type TextBlock = PortableTextBlock & {
  _type: 'block';
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children?: Span[];
  markDefs?: MarkDef[];
};

function renderSpans(children: Span[] = [], markDefs: MarkDef[] = []): string {
  return children
    .map((child) => {
      let text = (child.text ?? '').replace(/\n/g, '  \n');
      const marks = child.marks ?? [];
      for (const mark of marks) {
        if (mark === 'strong') text = `**${text}**`;
        else if (mark === 'em') text = `*${text}*`;
        else if (mark === 'code') text = `\`${text}\``;
        else {
          const def = markDefs.find((d) => d._key === mark);
          if (def?._type === 'link' && def.href) {
            text = `[${text}](${def.href})`;
          }
        }
      }
      return text;
    })
    .join('');
}

function blockToMarkdown(block: PortableTextBlock): string {
  if (block._type === 'divider') {
    return '---';
  }

  if (block._type === 'image') {
    const img = block as SanityImageBlock;
    if (!img.asset) return '';
    const url = urlFor(img).width(1400).fit('max').auto('format').url();
    const alt = img.alt ?? '';
    const caption = img.caption ? `\n\n*${img.caption}*` : '';
    return `![${alt}](${url})${caption}`;
  }

  if (block._type === 'block') {
    const b = block as TextBlock;
    const text = renderSpans(b.children, b.markDefs);
    const indent = '  '.repeat(Math.max(0, (b.level ?? 1) - 1));

    if (b.listItem === 'bullet') return `${indent}- ${text}`;
    if (b.listItem === 'number') return `${indent}1. ${text}`;

    switch (b.style) {
      case 'h1': return `# ${text}`;
      case 'h2': return `## ${text}`;
      case 'h3': return `### ${text}`;
      case 'h4': return `#### ${text}`;
      case 'blockquote': return `> ${text}`;
      default: return text;
    }
  }

  return '';
}

export function portableTextToMarkdown(blocks: PortableTextBlock[] = []): string {
  return blocks
    .map(blockToMarkdown)
    .filter((chunk) => chunk.length > 0)
    .join('\n\n');
}

export function buildMarkdownDocument({
  title,
  subtitle,
  publishedAt,
  body,
  canonicalUrl,
}: {
  title: string;
  subtitle?: string;
  publishedAt: string;
  body: PortableTextBlock[];
  canonicalUrl?: string;
}): string {
  const frontmatter: string[] = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
  ];
  if (subtitle) frontmatter.push(`subtitle: "${subtitle.replace(/"/g, '\\"')}"`);
  frontmatter.push(`date: ${publishedAt}`);
  if (canonicalUrl) frontmatter.push(`source: ${canonicalUrl}`);
  frontmatter.push('---', '');

  const heading = subtitle ? `# ${title}\n\n## ${subtitle}` : `# ${title}`;
  const markdownBody = portableTextToMarkdown(body);

  return [frontmatter.join('\n'), heading, markdownBody].join('\n\n');
}
