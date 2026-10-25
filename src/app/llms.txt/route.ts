import { ARTICLES } from "@/content/articles";
import { TOOLS } from "@/content/tools";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// llms.txt: a plain-language map of the site for AI assistants and answer engines.
// See https://llmstxt.org. Built from the same content as the pages.
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "Finance is a free web app for tracking net worth across bank accounts, digital wallets and cash in any currency. It has no bank connection: users enter balances and movements themselves. Totals convert to a display currency of the user's choice at live exchange rates.",
    "",
    "Key facts:",
    "- Price: free, no paid tier",
    "- Bank sync: none, by design",
    "- Features: multi-currency accounts, transfers between accounts, net worth history and dashboard with period comparison, loans with partial repayments, savings goals with completion projections, cash flow calendar forecast, CSV export",
    "- Data: stored in a private Postgres database; passwords hashed with scrypt; no ads or third-party trackers",
    "",
    "## Product",
    `- [Home](${SITE_URL}/): overview of the app`,
    `- [Features](${SITE_URL}/features): every screen and what it does`,
    `- [How it works](${SITE_URL}/how-it-works): setup in four steps`,
    `- [Use cases](${SITE_URL}/use-cases): expats, freelancers, savers, lenders, people who won't connect their bank`,
    `- [Privacy](${SITE_URL}/privacy): what is stored, security, and services used`,
    "",
    "## Free calculators",
    ...TOOLS.map((t) => `- [${t.name}](${SITE_URL}/tools/${t.slug}): ${t.intro}`),
    "",
    "## Guides",
    ...ARTICLES.map((a) => `- [${a.title}](${SITE_URL}/blog/${a.slug}): ${a.description}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
