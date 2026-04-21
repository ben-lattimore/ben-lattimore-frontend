import Image from 'next/image';
import type { PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { urlFor } from '@/lib/sanity';

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function blockIsEmpty(value: PortableTextBlock | undefined): boolean {
  if (!value) return true;
  const children = (value as PortableTextBlock & { children?: Array<{ text?: string }> }).children;
  if (!children) return true;
  return children.every((c) => !(c.text ?? '').trim());
}

export const articleComponents: PortableTextComponents = {
  block: {
    normal: ({ value, children }) => {
      if (blockIsEmpty(value)) return null;
      return <p className="text-lg leading-[1.75] mb-6">{children}</p>;
    },
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-semibold mt-14 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-semibold mt-10 mb-3 leading-snug">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-current pl-6 my-8 italic opacity-80 text-lg leading-[1.75]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-[1.75]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-lg leading-[1.75]">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[0.95em] font-mono">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#';
      const external = isExternal(href);
      return (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="underline underline-offset-4 decoration-1 hover:decoration-2"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1400).fit('max').auto('format').url();
      const alt: string = value.alt ?? '';
      const caption: string | undefined = value.caption;
      return (
        <figure className="my-10">
          <Image
            src={src}
            alt={alt}
            width={1400}
            height={933}
            sizes="(min-width: 768px) 68ch, 100vw"
            className="w-full h-auto rounded-sm"
          />
          {caption && (
            <figcaption className="mt-3 text-sm opacity-70">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },
    divider: () => (
      <hr
        aria-hidden="true"
        className="my-14 mx-auto w-24 border-0 h-px bg-current opacity-30"
      />
    ),
  },
};
