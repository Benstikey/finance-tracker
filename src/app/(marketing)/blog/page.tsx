import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES, formatArticleDate, readingMinutes } from "@/content/articles";

const DESCRIPTION =
  "Practical guides on net worth, multi-currency money, savings goals and lending to friends, from the team behind Finance.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog · Finance", description: DESCRIPTION, url: "/blog" },
  twitter: { card: "summary_large_image", title: "Blog · Finance", description: DESCRIPTION },
};

export default function BlogIndex() {
  const [featured, ...rest] = ARTICLES;
  return (
    <>
      <section className="mx-auto flex max-w-[1008px] flex-col items-center pt-16 pb-14 text-center min-[761px]:pt-24 min-[761px]:pb-16">
        <div className="lp-hero__copy flex max-w-[600px] flex-col items-center">
          <h1 className="text-[34px] leading-[40px] font-medium tracking-[-1px] text-balance min-[761px]:text-[46px] min-[761px]:leading-[52px] min-[761px]:tracking-[-1.4px]">
            Notes on money,
            <br />
            kept simple
          </h1>
          <p className="max-w-[520px] pt-3.5 text-[15px] leading-[22px] text-pretty text-[#737373] min-[761px]:text-base min-[761px]:leading-6">
            Short, practical guides to seeing your finances clearly, across every account and
            currency.
          </p>
        </div>
      </section>

      <section aria-label="Articles" className="mx-auto max-w-[1008px] pb-28 min-[761px]:pb-[168px]">
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-3.5 grid gap-6 rounded-[14px] border border-[#0a0a0a0e] bg-white p-6 transition-[box-shadow] duration-150 ease-out hover:shadow-[0_4px_42px_#0000000f] min-[761px]:grid-cols-[1fr_1fr] min-[761px]:p-8"
        >
          <div className="flex flex-col justify-center">
            <p className="text-[12px] font-medium text-[#737373]">
              {featured.category} · {readingMinutes(featured)} min read
            </p>
            <h2 className="pt-2 text-[24px] leading-[30px] font-medium tracking-[-0.6px] text-balance">
              {featured.title}
            </h2>
            <p className="pt-3 text-[15px] leading-[23px] text-[#737373]">{featured.description}</p>
            <p className="pt-5 text-[13px] font-medium underline decoration-[#0a0a0a40] underline-offset-4 group-hover:decoration-[#0a0a0a]">
              Read the guide
            </p>
          </div>
          <div
            aria-hidden
            className="grid min-h-48 place-items-center rounded-[10px] bg-[#fafafa] shadow-[inset_0_0_0_1px_#0a0a0a0e]"
          >
            <p className="text-center text-[22px] font-medium tracking-[-0.4px]">
              Own − Owe
              <span className="block pt-1 text-[13px] font-normal tracking-normal text-[#737373]">
                = your net worth
              </span>
            </p>
          </div>
        </Link>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {rest.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="group flex flex-col rounded-[14px] border border-[#0a0a0a0e] bg-white p-6 transition-[box-shadow] duration-150 ease-out hover:shadow-[0_4px_42px_#0000000f]"
            >
              <p className="text-[12px] font-medium text-[#737373]">
                {a.category} · {readingMinutes(a)} min read
              </p>
              <h2 className="pt-2 text-[17px] leading-[24px] font-medium tracking-[-0.3px] text-balance">
                {a.title}
              </h2>
              <p className="pt-2 text-[14px] leading-[22px] text-[#737373]">{a.description}</p>
              <p className="mt-auto pt-5 text-[12px] text-[#737373]">
                <time dateTime={a.date}>{formatArticleDate(a.date)}</time>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
