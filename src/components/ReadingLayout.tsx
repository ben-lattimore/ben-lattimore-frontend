import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import type { HomeData } from '@/types';

// Shared shell for long-form pages (/writing/[slug], /projects/[slug]):
// compact site header, back link, and a centred reading column.
//
// The column carries the body text size (18px, 20px from xl) and its width is
// in em at that size, so lines stay at ~69 characters as the text grows:
// 34.6em is 623px at 18px and 692px at 20px. Rich text inherits the size.
export default function ReadingLayout({
  home,
  children,
}: {
  home: HomeData;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex justify-center">
      <div className="w-full xl:w-[1600px]">
        <div className="print:hidden">
          <SiteHeader home={home} variant="article" />
        </div>

        <div className="px-6 sm:px-8">
          <div className="max-w-[34.6em] mx-auto text-lg xl:text-xl">
            <Link
              href="/"
              aria-label="Back to home"
              className="inline-flex items-center text-base opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 rounded-sm print:hidden"
            >
              <span aria-hidden="true" className="mr-2">←</span>back
            </Link>

            <article className="pt-4 pb-24 sm:pt-6 sm:pb-32">{children}</article>
          </div>
        </div>
      </div>
    </main>
  );
}
