import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import type { HomeData } from '@/types';

// Shared shell for long-form pages (/writing/[slug], /projects/[slug]):
// compact site header, back link, and a centred 68ch reading column.
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

        <div className="max-w-[68ch] mx-auto px-6 sm:px-8">
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
    </main>
  );
}
