import Link from "next/link";
import type { Block } from "@/content/articles";
import { ARTICLES, readingMinutes } from "@/content/articles";
import { ArticleBody } from "@/components/landing/article-body";
import { Faq } from "@/components/landing/faq";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export type ToolContent = {
  slug: string;
  name: string;
  title: string;
  intro: string;
  /** Explanation shown under the calculator. */
  blocks: Block[];
  faqs: { q: string; a: string }[];
  /** Article slugs to suggest after the tool. */
  related: string[];
};

/** Shared shell for the free calculators: hero, tool, explanation, FAQ, links. */
export function ToolPage({ tool, children }: { tool: ToolContent; children: React.ReactNode }) {
  const url = `${SITE_URL}/tools/${tool.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.name,
        url,
        description: tool.intro,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Free tools", item: `${SITE_URL}/tools` },
          { "@type": "ListItem", position: 3, name: tool.name, item: url },
        ],
      },
    ],
  };
  const related = tool.related
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a) => a !== undefined);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="mx-auto flex max-w-[1008px] flex-col items-center pt-14 pb-10 text-center min-[761px]:pt-20 min-[761px]:pb-12">
        <nav aria-label="Breadcrumb" className="pb-6 text-[13px] text-[#737373]">
          <Link href="/tools" className="hover:text-[#0a0a0a]">
            Free tools
          </Link>
          <span aria-hidden> / </span>
          <span aria-current="page" className="text-[#0a0a0a]">
            {tool.name}
          </span>
        </nav>
        <div className="lp-hero__copy flex max-w-[640px] flex-col items-center">
          <h1 className="text-[32px] leading-[38px] font-medium tracking-[-1px] text-balance min-[761px]:text-[42px] min-[761px]:leading-[48px] min-[761px]:tracking-[-1.3px]">
            {tool.title}
          </h1>
          <p className="max-w-[560px] pt-3.5 text-[15px] leading-[22px] text-pretty text-[#737373] min-[761px]:text-base min-[761px]:leading-6">
            {tool.intro}
          </p>
        </div>
      </section>

      <section aria-label={tool.name} className="mx-auto max-w-[880px] pb-16 min-[761px]:pb-20">
        {children}
        <p className="pt-3 text-center text-[12px] text-[#737373]">
          Free, no sign-up. Everything is calculated in your browser and nothing is saved.
        </p>
      </section>

      <section className="mx-auto max-w-[640px] pb-16">
        <ArticleBody blocks={tool.blocks} />
      </section>

      <section aria-labelledby="tool-faq" className="mx-auto max-w-[640px] pb-16">
        <h2 id="tool-faq" className="text-[22px] leading-[28px] font-medium tracking-[-0.5px]">
          Frequently asked questions
        </h2>
        <Faq items={tool.faqs} />
      </section>

      <section className="mx-auto max-w-[640px] pb-28 min-[761px]:pb-[168px]">
        <div className="flex flex-col items-start gap-4 rounded-[14px] bg-[#fafafa] p-6 shadow-[inset_0_0_0_1px_#0a0a0a0e] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-medium">Track it over time, not just today</p>
            <p className="pt-1 text-[14px] text-[#737373]">
              {SITE_NAME} keeps the history for you. Free, private, no bank sync.
            </p>
          </div>
          <Link href="/login" className="lp-btn lp-btn--primary">
            Get started
          </Link>
        </div>
        {related.length > 0 && (
          <>
            <h2 className="pt-12 text-[15px] font-medium">Related guides</h2>
            <div className="mt-4 divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
              {related.map((a) => (
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
          </>
        )}
      </section>
    </>
  );
}
