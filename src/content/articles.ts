/**
 * Blog articles. Plain data so the index, article pages, sitemap and
 * structured data all read from one place.
 *
 * Paragraph text supports two inline marks: **bold** and [label](/path).
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  category: "Guide" | "Money habits" | "Product";
  blocks: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "how-to-calculate-your-net-worth",
    title: "How to calculate your net worth (and why it's the number to watch)",
    description:
      "Net worth is what you own minus what you owe. Here's how to add it up in ten minutes, what to include, what to leave out, and how often to check it.",
    date: "2026-10-16",
    category: "Guide",
    blocks: [
      {
        type: "p",
        text: "Income tells you what comes in. Spending tells you what goes out. **Net worth tells you where you actually stand.** It's the one number that captures the result of every financial decision you've made, and the only one that tells you whether you're moving forward.",
      },
      { type: "h2", text: "The formula" },
      { type: "callout", text: "Net worth = everything you own − everything you owe" },
      {
        type: "p",
        text: "That's it. The work is in being honest about both sides of the line.",
      },
      { type: "h2", text: "What counts as something you own" },
      {
        type: "ul",
        items: [
          "**Bank accounts**: checking and savings, at today's balance.",
          "**Digital wallets**: Wise, Revolut, PayPal and similar.",
          "**Cash**: what's actually in your wallet or a drawer, if it's meaningful.",
          "**Money people owe you**: a loan to a friend is still your money until it's repaid.",
          "**Investments and retirement accounts**, if you want the full picture, at their current value.",
        ],
      },
      { type: "h2", text: "What counts as something you owe" },
      {
        type: "ul",
        items: [
          "Credit card balances (the full balance, not just the minimum payment).",
          "Personal loans, car loans, student loans.",
          "Money you've borrowed from friends or family.",
        ],
      },
      { type: "h2", text: "Three mistakes that distort the number" },
      {
        type: "ol",
        items: [
          "**Using purchase prices instead of current values.** A car is worth what it would sell for today, not what you paid.",
          "**Forgetting small debts.** The $300 you owe a friend is still a liability.",
          "**Mixing currencies without converting.** 1,000 EUR and 1,000 USD aren't the same amount. Convert everything into one currency before you add it up.",
        ],
      },
      { type: "h2", text: "How often to check it" },
      {
        type: "p",
        text: "Monthly is enough for most people. Net worth moves slowly, and checking daily mostly adds noise. What matters is the trend over months: is the line going up, and is it going up faster than last quarter?",
      },
      {
        type: "p",
        text: "Comparing one period with the one before is the most useful habit. A month where net worth rose by less than usual is a prompt to look at what changed, before it becomes a pattern.",
      },
      { type: "h2", text: "Doing it in Finance" },
      {
        type: "p",
        text: "Add each account with its current balance and currency, record loans in either direction, and the [dashboard](/features#dashboard) adds everything up in the currency you choose. Each metric compares the last 7, 30 or 90 days with the period before, and the net worth history builds itself from the transactions you record.",
      },
    ],
  },
  {
    slug: "tracking-money-in-multiple-currencies",
    title: "Tracking your money across several currencies",
    description:
      "Earn in one currency, save in another, spend in a third? Here's how to keep one honest total, and why your net worth can change while you do nothing.",
    date: "2026-10-16",
    category: "Guide",
    blocks: [
      {
        type: "p",
        text: "If you're an expat, a freelancer with foreign clients, or someone who keeps savings abroad, your money lives in more than one currency. Most budgeting tools quietly assume it doesn't. The result is a total that's either wrong or missing entirely.",
      },
      { type: "h2", text: "Keep each account in its own currency" },
      {
        type: "p",
        text: "Record every account in the currency it's actually held in. A euro account should show euros, not a dollar estimate you typed in last spring. Converting at the source loses information and goes stale the moment rates move.",
      },
      { type: "h2", text: "Convert only when you add things up" },
      {
        type: "p",
        text: "Pick one **display currency**, usually the one you think in or plan to spend in, and convert to it only when you need a total. That way balances stay exact, and the total is always based on current rates.",
      },
      { type: "h2", text: "Your net worth can move without you" },
      {
        type: "p",
        text: "When the euro strengthens against the dollar, a euro balance is worth more dollars, even though nothing in the account changed. That's real: it's what you'd get if you converted today. But it's worth knowing which part of a change came from you and which came from the market.",
      },
      {
        type: "callout",
        text: "Tip: look at a breakdown by currency. If one currency's share of your total jumps while its balances barely changed, the exchange rate did the work.",
      },
      { type: "h2", text: "Moving money between currencies" },
      {
        type: "p",
        text: "A transfer from a dollar account to a euro account should be one event, not a withdrawal plus an unrelated deposit. Record what left one account and what arrived in the other. The gap between the two is the real cost of the transfer: the exchange rate plus any fee.",
      },
      { type: "h2", text: "How Finance handles it" },
      {
        type: "ul",
        items: [
          "Every account keeps its own currency; you can add any currency you need.",
          "Totals, charts and forecasts convert to the display currency you choose, at live rates.",
          "[Transfers](/features#accounts) fill in the converted amount for you, and you can change it if a fee applied.",
          "The dashboard shows how much of your net worth is held outside your display currency, with a breakdown by currency.",
        ],
      },
      {
        type: "p",
        text: "One limitation worth knowing: historical charts use today's exchange rates for every day, so they show how your balances moved rather than how past exchange rates moved.",
      },
    ],
  },
  {
    slug: "lending-money-to-friends",
    title: "Lending money to friends without losing track (or the friendship)",
    description:
      "Small loans between friends are easy to forget and awkward to bring up. A simple record of who owes what, and every part-payment, keeps it clear on both sides.",
    date: "2026-10-16",
    category: "Money habits",
    blocks: [
      {
        type: "p",
        text: "You cover a concert ticket, a dinner, a deposit for a shared trip. A few weeks later neither of you remembers the exact amount, and asking feels petty. Most money friction between friends isn't about the money. **It's about uncertainty.**",
      },
      { type: "h2", text: "Write it down the same day" },
      {
        type: "p",
        text: "Record the person, the amount, the currency and a short note (\"Lisbon flat deposit\") when it happens. A note with a date settles most \"wait, what was that for?\" conversations before they start.",
      },
      { type: "h2", text: "Track both directions" },
      {
        type: "p",
        text: "It's easy to remember what you're owed and forget what you owe. Keep both in the same place. Your net position with someone, what they owe you minus what you owe them, is often smaller than either number alone.",
      },
      { type: "h2", text: "Record part-payments, not just \"paid\"" },
      {
        type: "p",
        text: "Real repayments rarely arrive in one go. $100 now, $200 next month. If you only mark loans as open or closed, the in-between gets fuzzy. Log each payment with its date and you'll always know what's actually left.",
      },
      {
        type: "callout",
        text: "A good rule: if you'd be annoyed to forget it, it's worth one line in a tracker.",
      },
      { type: "h2", text: "Count loans in your net worth" },
      {
        type: "p",
        text: "Money you've lent is still yours until it comes back, and money you've borrowed isn't. Leaving loans out makes your net worth look better or worse than it is. Count what's outstanding, not the original amount.",
      },
      { type: "h2", text: "How Finance helps" },
      {
        type: "ul",
        items: [
          "Record [loans](/features#loans) you gave and received, in any currency.",
          "Add part-payments with dates and notes; the outstanding balance updates.",
          "A loan settles itself once it's fully repaid.",
          "See your net position per person, and outstanding loans in your total.",
        ],
      },
    ],
  },
  {
    slug: "savings-goals-you-will-actually-reach",
    title: "Savings goals you'll actually reach: the monthly maths",
    description:
      "A target amount isn't a plan. Add a monthly amount or a date and the maths tells you when you'll get there, or what it would take.",
    date: "2026-10-16",
    category: "Guide",
    blocks: [
      {
        type: "p",
        text: "\"Save $15,000 for an emergency fund\" is a wish. \"$500 a month, done by next December\" is a plan. The difference is a number and a date, and both are easy to work out.",
      },
      { type: "h2", text: "Start with what's left" },
      { type: "callout", text: "Remaining = target − already saved" },
      {
        type: "p",
        text: "Say the goal is $13,600 and you've saved $9,248. You have $4,352 to go.",
      },
      { type: "h2", text: "If you know how much you can save each month" },
      { type: "callout", text: "Months to go = remaining ÷ monthly amount, rounded up" },
      {
        type: "p",
        text: "At $500 a month, $4,352 takes 8.7 months. Round up to 9: you'll get there in nine months' time.",
      },
      { type: "h2", text: "If you know when you need it" },
      { type: "callout", text: "Needed per month = remaining ÷ months until the date" },
      {
        type: "p",
        text: "If you need it in 6 months, that's $725.33 a month. Now you can make a real decision: save more, push the date, or lower the target.",
      },
      { type: "h2", text: "If you have both" },
      {
        type: "p",
        text: "Compare them. If your monthly amount gets you there before the date, you're on track. If not, the gap in months tells you how far behind you are, and the needed-per-month figure tells you exactly how to catch up.",
      },
      { type: "h2", text: "Three habits that make goals stick" },
      {
        type: "ol",
        items: [
          "**One goal at a time gets the extra money.** Rank your goals and send anything above the plan to the top one.",
          "**Update \"already saved\" when it changes**, not when you remember. Stale numbers make every projection wrong.",
          "**Revisit the date, not just the amount.** Moving a date is a legitimate choice; ignoring it isn't.",
        ],
      },
      { type: "h2", text: "In Finance" },
      {
        type: "p",
        text: "Give each [objective](/features#goals) a monthly amount, a target date, or both. Each goal shows the month you'll reach it, whether you're on track or how many months behind, and what you'd need to save each month to hit your date.",
      },
    ],
  },
  {
    slug: "manual-tracking-vs-bank-sync",
    title: "Manual tracking vs. bank sync: an honest comparison",
    description:
      "Automatic bank sync saves time. Manual tracking keeps you in control. Here's what each is good at, and who each one suits.",
    date: "2026-10-16",
    category: "Product",
    blocks: [
      {
        type: "p",
        text: "Most finance apps connect to your bank and pull in every transaction. Finance doesn't, on purpose. Neither approach is right for everyone, so here's a fair look at both.",
      },
      { type: "h2", text: "What bank sync does well" },
      {
        type: "ul",
        items: [
          "**It saves time.** Transactions appear without you typing anything.",
          "**It's complete**, for the accounts it supports: nothing gets forgotten.",
          "**It can categorise spending automatically**, which is useful for detailed budgets.",
        ],
      },
      { type: "h2", text: "Where bank sync struggles" },
      {
        type: "ul",
        items: [
          "**Access.** You hand over credentials or an ongoing connection to a third party.",
          "**Coverage.** Many banks, especially outside the US and EU, aren't supported, and connections break.",
          "**The off-bank world.** Cash, money lent to friends and some foreign accounts don't show up at all.",
          "**Noise.** Hundreds of small transactions can bury the few numbers that matter.",
        ],
      },
      { type: "h2", text: "What manual tracking does well" },
      {
        type: "ul",
        items: [
          "**Privacy.** Nothing connects to your bank; you share only what you choose to type.",
          "**Works everywhere.** Any bank, any country, any currency, plus cash and personal loans.",
          "**Awareness.** Entering a number takes a second, and it makes you notice it.",
        ],
      },
      { type: "h2", text: "Where manual tracking struggles" },
      {
        type: "p",
        text: "It takes a little discipline, and it's a poor fit if you want every coffee categorised. The trick is to track at the right level of detail: balances and meaningful movements, not every card swipe.",
      },
      { type: "callout", text: "Track the numbers that change your decisions, not every number that exists." },
      { type: "h2", text: "Who each one suits" },
      {
        type: "p",
        text: "If you want a detailed spending budget and your banks are well supported, bank sync is hard to beat. If you care most about your overall position (net worth, savings goals, loans, money across countries) and you'd rather not connect your bank, manual tracking is the calmer option. That's the person [Finance](/features) is built for.",
      },
      {
        type: "p",
        text: "Curious how your data is handled? It's all on the [privacy page](/privacy).",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Rough reading time at ~220 words per minute. */
export function readingMinutes(article: Article): number {
  const words = article.blocks
    .flatMap((b) => ("text" in b ? [b.text] : b.items))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatArticleDate(date: string): string {
  return new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
