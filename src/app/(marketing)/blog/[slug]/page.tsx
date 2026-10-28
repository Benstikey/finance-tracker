import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  ARTICLES,
  formatArticleDate,
  getArticle,
  readingMinutes,
} from "@/content/articles";
import { ArticleBody } from "@/components/landing/article-body";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Only the articles listed in content/articles.ts exist; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `/blog/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url,
      publishedTime: article.date,
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `${SITE_URL}/blog/${article.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        dateModified: article.date,
        articleSection: article.category,
        inLanguage: "en",
        url,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };

  // Same category first, so readers (and crawlers) move between related guides.
  const others = ARTICLES.filter((a) => a.slug !== article.slug);
  const more = [
    ...others.filter((a) => a.category === article.category),
    ...others.filter((a) => a.category !== article.category),
  ].slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <article className="mx-auto max-w-[640px] pt-12 pb-20 min-[761px]:pt-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#737373] transition-[color] duration-150 hover:text-[#0a0a0a]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
          All articles
        </Link>
        <header className="pt-8 pb-10">
          <p className="text-[13px] font-medium text-[#737373]">
            {article.category} · <time dateTime={article.date}>{formatArticleDate(article.date)}</time> ·{" "}
            {readingMinutes(article)} min read
          </p>
          <h1 className="pt-3 text-[30px] leading-[36px] font-medium tracking-[-0.9px] text-balance min-[761px]:text-[38px] min-[761px]:leading-[44px] min-[761px]:tracking-[-1.2px]">
            {article.title}
          </h1>
          <p className="pt-4 text-[17px] leading-[27px] text-[#737373]">{article.description}</p>
        </header>
        <ArticleBody blocks={article.blocks} />

        <aside className="mt-14 flex flex-col items-start gap-4 rounded-[14px] bg-[#fafafa] p-6 shadow-[inset_0_0_0_1px_#0a0a0a0e] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-medium">See your own numbers</p>
            <p className="pt-1 text-[14px] text-[#737373]">Free, private, no bank sync.</p>
          </div>
          <Link href="/login" className="lp-btn lp-btn--primary">
            Get started
          </Link>
        </aside>
      </article>

      <section aria-labelledby="more-title" className="mx-auto max-w-[640px] pb-28 min-[761px]:pb-[168px]">
        <h2 id="more-title" className="text-[15px] font-medium">
          Keep reading
        </h2>
        <div className="mt-4 divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
          {more.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="group block py-4">
              <p className="text-[15px] font-medium underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 group-hover:decoration-[#0a0a0a40]">
                {a.title}
              </p>
              <p className="pt-1 text-[13px] text-[#737373]">
                {a.category} · {readingMinutes(a)} min read
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
