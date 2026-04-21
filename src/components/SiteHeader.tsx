import { PortableText } from '@portabletext/react';
import type { HomeData } from '@/types';

type SiteHeaderVariant = 'home' | 'article';

export default function SiteHeader({
  home,
  variant = 'home',
}: {
  home: HomeData;
  variant?: SiteHeaderVariant;
}) {
  const isArticle = variant === 'article';

  const sectionClasses = isArticle
    ? 'flex flex-row justify-end sm:justify-between items-start p-8 pb-10 sm:p-20 sm:pb-10 xl:w-full'
    : 'flex flex-col sm:flex-row justify-between items-start p-8 pb-20 sm:p-20 xl:w-full';

  const bioClasses = isArticle ? 'hidden sm:block xl:w-7/12' : 'xl:w-7/12';

  const linksWrapperClasses = isArticle
    ? 'flex flex-row justify-end gap-x-2'
    : 'flex flex-row justify-end gap-x-2 mt-4 sm:mt-0';

  return (
    <section className={sectionClasses}>
      <div className={bioClasses}>
        <PortableText
          value={home.main_text}
          components={{
            block: ({ children }) => <p className="text-xl mb-4">{children}</p>,
          }}
        />
      </div>

      <div className={linksWrapperClasses}>
        <a
          href={home.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline decoration-1 underline-offset-4"
        >
          {home.linkedin.text}
        </a>
        <a
          href={`mailto:${home.email.address}`}
          className="hover:underline decoration-1 underline-offset-4 ml-2"
        >
          {home.email.text}
        </a>
      </div>
    </section>
  );
}
