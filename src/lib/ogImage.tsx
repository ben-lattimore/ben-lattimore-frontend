import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

// Shared renderer for the social preview cards (opengraph-image.tsx files).
// Satori can't read woff2, so the Inter weights come from @fontsource as woff.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const BRAND_BACKGROUND = '#f5f5f5';
const BRAND_TEXT = '#111111';

// Literal paths (not a template) so build tracing bundles only these two files.
const FONT_FILES = {
  400: 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff',
  500: 'node_modules/@fontsource/inter/files/inter-latin-500-normal.woff',
} as const;

const fontFile = (weight: keyof typeof FONT_FILES) =>
  readFile(join(process.cwd(), FONT_FILES[weight]));

export async function renderOgCard({
  eyebrow,
  title,
  subtitle,
  footer,
  background = BRAND_BACKGROUND,
  reverseText = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer: string;
  background?: string;
  reverseText?: boolean;
}) {
  const [regular, medium] = await Promise.all([fontFile(400), fontFile(500)]);
  const color = reverseText ? BRAND_BACKGROUND : BRAND_TEXT;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background,
          color,
          fontFamily: 'Inter',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, opacity: 0.7 }}>{eyebrow}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: title.length > 40 ? 64 : 80,
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 44, fontWeight: 500, opacity: 0.8, marginTop: 20 }}>
              {subtitle}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', fontSize: 30 }}>{footer}</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: medium, weight: 500, style: 'normal' },
      ],
    },
  );
}
