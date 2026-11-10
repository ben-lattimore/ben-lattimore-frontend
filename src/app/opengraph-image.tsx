import { ogContentType, ogSize, renderOgCard } from '@/lib/ogImage';
import { AUTHOR_NAME, SITE_NAME } from '@/lib/site';

export const alt = `${AUTHOR_NAME} — ${SITE_NAME}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    eyebrow: 'benlattimore.com',
    title: AUTHOR_NAME,
    subtitle: SITE_NAME,
    footer: 'AI projects · Web development · Writing',
  });
}
