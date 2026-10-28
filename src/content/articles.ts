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
  category: "Guide" | "Money habits" | "Insights" | "Product";
  blocks: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "50-30-20-rule-explained",
    title: "The 50/30/20 rule, explained with real numbers",
    description:
      "Half for needs, 30% for wants, 20% for savings. How the 50/30/20 budget works, a worked example, and what to do when your numbers don't fit.",
    date: "2026-10-28",
    category: "Guide",
    blocks: [
      {
        type: "p",
        text: "The 50/30/20 rule is the simplest budget that still works. It splits your take-home pay into three buckets and asks you to watch only those three numbers, not dozens of categories.",
      },
      { type: "callout", text: "50% needs · 30% wants · 20% savings and debt repayment" },
      { type: "h2", text: "What goes in each bucket" },
      {
        type: "ul",
        items: [
          "**Needs (50%)**: rent or mortgage, utilities, groceries, insurance, transport to work and minimum debt payments.",
          "**Wants (30%)**: eating out, travel, subscriptions, hobbies, upgrades you could live without.",
          "**Savings (20%)**: your emergency fund, savings goals, investments and any debt repayment above the minimum.",
        ],
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "Say you take home **$4,000** a month. The rule gives you $2,000 for needs, $1,200 for wants and $800 for savings. Use take-home pay, after tax, because that's the money you actually decide about.",
      },
      { type: "h2", text: "When your needs are more than 50%" },
      {
        type: "p",
        text: "In expensive cities, rent alone can take half your income. That doesn't mean the rule is useless. Shrink the wants bucket first and protect the savings bucket, even if it's 10% for now. A 60/30/10 budget you follow beats a 50/30/20 budget you abandon.",
      },
      { type: "h2", text: "Make the 20% automatic" },
      {
        type: "p",
        text: "The savings bucket is the one that slips. Move it on payday, before you spend anything, so what's left is yours to use. That habit has its own name: [pay yourself first](/blog/pay-yourself-first).",
      },
      { type: "h2", text: "Check it once a month" },
      {
        type: "p",
        text: "You don't need to categorise every purchase. Once a month, look at what came in, what went out and how much your total grew. If your net worth rose by roughly 20% of your income, the rule is working. Finance's [dashboard](/features#dashboard) shows that number without any categories at all.",
      },
    ],
  },
  {
    slug: "debt-snowball-vs-avalanche",
    title: "Debt snowball vs. avalanche: which pays off debt faster?",
    description:
      "Two ways to order your debts: smallest balance first, or highest interest first. How each method works, a worked example, and how to pick.",
    date: "2026-10-28",
    category: "Guide",
    blocks: [
      {
        type: "p",
        text: "If you have more than one debt, you'll pay the minimum on all of them and put any extra money toward one. The only question is which one goes first. There are two well-known answers.",
      },
      { type: "h2", text: "The avalanche: highest interest first" },
      {
        type: "p",
        text: "Put every spare dollar on the debt with the highest interest rate. When it's gone, move to the next highest. Mathematically, this costs you the least interest overall.",
      },
      { type: "h2", text: "The snowball: smallest balance first" },
      {
        type: "p",
        text: "Put every spare dollar on the smallest balance, whatever its rate. When it's gone, roll its payment into the next smallest. You pay a little more interest, but you clear whole debts sooner, and that momentum keeps many people going.",
      },
      { type: "h2", text: "A worked example" },
      {
        type: "ul",
        items: [
          "Credit card: **$2,400** at 22%",
          "Store card: **$600** at 18%",
          "Car loan: **$6,000** at 7%",
        ],
      },
      {
        type: "p",
        text: "The avalanche order is credit card, store card, car loan. The snowball order is store card, credit card, car loan. In the first month, the credit card costs about $44 in interest, the car loan about $35 and the store card about $9. That's why the avalanche goes after the card first.",
      },
      { type: "h2", text: "Which should you pick?" },
      {
        type: "ul",
        items: [
          "**Pick the avalanche** if your rates are far apart and you're motivated by the total saved.",
          "**Pick the snowball** if you've started and stopped before, and need quick wins to stick with it.",
          "**Either one** beats paying minimums with no plan.",
        ],
      },
      { type: "h2", text: "Keep the total in view" },
      {
        type: "p",
        text: "Whichever you choose, track the total you owe month to month. Watching it fall is the best motivation there is. In Finance, debts count as liabilities in your [net worth](/blog/how-to-calculate-your-net-worth), and money you've borrowed from people can be repaid in [parts with dates](/features#loans).",
      },
    ],
  },
  {
    slug: "sinking-funds-explained",
    title: "Sinking funds: how to stop annual bills from wrecking your month",
    description:
      "Car insurance, gifts, renewals. A sinking fund saves for known costs a little each month, so they never land as a surprise. Here's how to set one up.",
    date: "2026-10-28",
    category: "Money habits",
    blocks: [
      {
        type: "p",
        text: "Some costs aren't emergencies, they're just infrequent: the yearly insurance premium, holiday gifts, a laptop that's due for replacement. They feel like surprises because they don't come every month. A sinking fund turns them into small, boring monthly amounts.",
      },
      { type: "callout", text: "Monthly amount = cost ÷ months until it's due" },
      { type: "h2", text: "A worked example" },
      {
        type: "ul",
        items: [
          "Car insurance, **$960** a year: $80 a month",
          "Holiday gifts, **$600** in ten months: $60 a month",
          "An annual subscription, **$120**: $10 a month",
        ],
      },
      {
        type: "p",
        text: "Together that's $150 a month. Set it aside every month and none of those bills will hurt when it arrives.",
      },
      { type: "h2", text: "Sinking fund vs. emergency fund" },
      {
        type: "p",
        text: "An [emergency fund](/blog/how-much-should-be-in-an-emergency-fund) is for things you can't predict. A sinking fund is for things you can. Keeping them apart stops you from raiding your safety net for a holiday.",
      },
      { type: "h2", text: "How to set one up" },
      {
        type: "ol",
        items: [
          "List every cost that comes less than once a month, with its amount and due date.",
          "Divide each one by the months left until it's due.",
          "Move the total into a separate savings account on payday.",
          "When a bill arrives, pay it from that account.",
        ],
      },
      { type: "h2", text: "Tracking several at once" },
      {
        type: "p",
        text: "One account can hold several sinking funds, as long as you know how much belongs to each. Treat each one as a savings goal with an amount and a date. The [savings goal calculator](/tools/savings-goal-calculator) gives you the monthly amount, and [objectives in Finance](/features#goals) tell you whether each one is on track.",
      },
    ],
  },
  {
    slug: "mid-market-exchange-rate-explained",
    title: "The mid-market rate: what you really lose when you change money",
    description:
      "Banks rarely give you the rate you see on Google. What the mid-market exchange rate is, how the markup hides in the rate, and how to check what a transfer really costs.",
    date: "2026-10-27",
    category: "Insights",
    blocks: [
      {
        type: "p",
        text: "When you search for an exchange rate, you see the **mid-market rate**: the midpoint between what buyers pay and sellers ask on the currency markets. It's the fairest rate there is, and it's rarely the one you get.",
      },
      { type: "h2", text: "Where the cost hides" },
      {
        type: "p",
        text: "A transfer can cost you in two places: a visible fee, and a less visible markup built into the rate. A \"no fee\" transfer with a poor rate can cost more than a transfer with a small fee and a fair rate.",
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "Say the mid-market rate is 1 USD = 0.92 EUR and you send **$5,000**. At that rate, it's worth €4,600. If your provider gives you 0.89 instead, you receive €4,450. That's €150 less, a markup of about 3.3%, before any fee.",
      },
      { type: "callout", text: "Real cost = what the mid-market rate would give − what actually arrives" },
      { type: "h2", text: "How to check any transfer" },
      {
        type: "ol",
        items: [
          "Look up the mid-market rate at the moment you convert.",
          "Multiply your amount by it. That's the fair result.",
          "Compare it with the amount that actually arrives, after every fee.",
          "Divide the gap by the fair result to get the true percentage cost.",
        ],
      },
      { type: "h2", text: "Record both sides of the transfer" },
      {
        type: "p",
        text: "When you move money between currencies, write down what left one account and what arrived in the other. Over a year, the gap tells you exactly what conversions cost you. Finance records [transfers](/features#accounts) with both amounts, and converts your totals at mid-market rates so your net worth isn't distorted by one bank's markup. More on this in [tracking money across currencies](/blog/tracking-money-in-multiple-currencies).",
      },
    ],
  },
  {
    slug: "budgeting-with-irregular-income",
    title: "How to budget with an irregular income",
    description:
      "Freelance, commission or seasonal work makes a normal monthly budget fall apart. A simple system: a baseline, a buffer account and a salary you pay yourself.",
    date: "2026-10-27",
    category: "Money habits",
    blocks: [
      {
        type: "p",
        text: "Most budgeting advice assumes the same amount arrives on the same day every month. If you freelance, earn commission or work seasonally, that's not your life. The fix isn't a stricter budget, it's smoothing your income before you spend it.",
      },
      { type: "h2", text: "Step 1: find your baseline" },
      {
        type: "p",
        text: "Look at the last six to twelve months. Say you earned $3,200, $6,500, $2,800, $5,100, $4,000 and $4,400. That's $26,000 in six months, an average of about $4,333, and a lowest month of $2,800.",
      },
      { type: "h2", text: "Step 2: pay yourself a salary" },
      {
        type: "p",
        text: "Pick a monthly amount between your lowest month and your average, here around **$3,500**. Every month, move exactly that into your everyday account. Budget around that number, as if it were a steady paycheck.",
      },
      { type: "h2", text: "Step 3: keep a buffer account" },
      {
        type: "p",
        text: "All income lands in a separate buffer account first. Good months top it up, quiet months draw it down. Aim for at least two or three months of your salary in there, on top of a proper [emergency fund](/blog/how-much-should-be-in-an-emergency-fund).",
      },
      { type: "h2", text: "Step 4: set tax aside immediately" },
      {
        type: "p",
        text: "If no one withholds tax for you, move a fixed share of every payment into its own account the day it arrives. Ask an accountant what share fits your situation. It's not your money, so don't count it as yours.",
      },
      { type: "h2", text: "Step 5: look ahead, not just back" },
      {
        type: "p",
        text: "Put expected invoices and fixed bills on a calendar, so you can see a thin month coming. Finance's [cash flow calendar](/features#cash-flow) shows recurring income and bills, and your projected balance at the end of each month. Read more about [forecasting your cash flow](/blog/personal-cash-flow-forecast).",
      },
    ],
  },
  {
    slug: "personal-cash-flow-forecast",
    title: "How to forecast your personal cash flow",
    description:
      "A month can end in the black and still go into overdraft halfway through. How to build a simple cash flow forecast and find your lowest point before it happens.",
    date: "2026-10-27",
    category: "Guide",
    blocks: [
      {
        type: "p",
        text: "A budget tells you whether a month adds up. A cash flow forecast tells you whether you'll have enough money on each day of it. They're not the same thing, and the gap is where overdraft fees come from.",
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "You start the month with **$3,000**. Rent of $1,400 leaves on the 1st, your phone bill of $40 on the 5th, insurance of $120 on the 12th. Day-to-day spending is about $1,500 across the month. Your salary of $3,900 arrives on the 28th.",
      },
      {
        type: "ul",
        items: [
          "After the bills: $1,440",
          "After spending up to the 27th (about $1,350): **$90**",
          "After salary on the 28th: $3,990",
          "End of month, after the last $150 of spending: $3,840",
        ],
      },
      {
        type: "p",
        text: "The month ends $840 up. But for a few days before payday, you're $90 away from zero. One unexpected bill and you're overdrawn, even in a good month.",
      },
      { type: "h2", text: "How to build your own" },
      {
        type: "ol",
        items: [
          "Start with today's balance across your everyday accounts.",
          "Add every recurring income and bill, on the day it lands.",
          "Spread your usual day-to-day spending across the month.",
          "Find the lowest point, not just the end-of-month number.",
        ],
      },
      { type: "h2", text: "What to do with the lowest point" },
      {
        type: "ul",
        items: [
          "Move bill dates to just after payday, where you can.",
          "Keep a small buffer that never gets spent.",
          "Hold large one-off purchases until after your income arrives.",
        ],
      },
      {
        type: "callout",
        text: "Finance's cash flow calendar puts recurring income and bills on their days and shows your projected balance for the month ahead.",
      },
    ],
  },
  {
    slug: "pay-yourself-first",
    title: "Pay yourself first: the one habit that makes saving automatic",
    description:
      "Save on payday, before you spend, not at the end of the month with whatever's left. Why it works, how much to start with, and how to set it up in ten minutes.",
    date: "2026-10-27",
    category: "Money habits",
    blocks: [
      {
        type: "p",
        text: "Most people save what's left at the end of the month. Usually, that's not much. Paying yourself first flips the order: savings leave on payday, and you spend what remains.",
      },
      { type: "h2", text: "Why it works" },
      {
        type: "p",
        text: "Spending expands to fill the money that's visible. If the savings are already gone from your everyday account, you adjust without noticing, the same way you adjust to rent.",
      },
      { type: "h2", text: "How much to start with" },
      {
        type: "p",
        text: "A common target is 20% of take-home pay, as in the [50/30/20 rule](/blog/50-30-20-rule-explained). If that's too much today, start with 5% or 10% and raise it by a point every few months. On **$4,000** a month, 10% is $400.",
      },
      { type: "h2", text: "Set it up in ten minutes" },
      {
        type: "ol",
        items: [
          "Open a savings account separate from your everyday one.",
          "Schedule a transfer for the day after payday.",
          "Give the money a job: an emergency fund first, then your goals.",
          "Raise the amount every time your income goes up.",
        ],
      },
      { type: "h2", text: "See it working" },
      {
        type: "p",
        text: "Saving feels better when you can watch the total grow. Give each pot a target and a monthly amount, and the [savings goal calculator](/tools/savings-goal-calculator) shows the month you'll reach it. In Finance, the same plan lives on each [objective](/features#goals) and updates as you save.",
      },
    ],
  },
  {
    slug: "monthly-money-check-in",
    title: "The 15-minute monthly money check-in",
    description:
      "You don't need to track every coffee. A short monthly routine that keeps your balances honest, your goals on track and next month free of surprises.",
    date: "2026-10-26",
    category: "Money habits",
    blocks: [
      {
        type: "p",
        text: "Daily tracking burns most people out within weeks. A monthly check-in is the opposite: one short, regular look at the whole picture. Put it in your calendar for the first weekend of each month.",
      },
      { type: "h2", text: "Minutes 1–5: update your balances" },
      {
        type: "p",
        text: "Open each account and make sure the balance you've recorded matches the real one. Include wallets, cash and anything held in another currency. If it's quicker, see [how to track all your accounts in one place](/blog/track-all-your-bank-accounts-in-one-place).",
      },
      { type: "h2", text: "Minutes 5–8: check who owes whom" },
      {
        type: "p",
        text: "Log any repayments from people who owe you, and anything you've paid back. Small loans are easy to forget, and awkward to bring up months later. More on that in [lending money to friends](/blog/lending-money-to-friends).",
      },
      { type: "h2", text: "Minutes 8–11: compare with last month" },
      {
        type: "ul",
        items: [
          "Did your net worth go up or down, and why?",
          "Was anything unusually large, in either direction?",
          "Is the trend over three months heading the right way?",
        ],
      },
      { type: "h2", text: "Minutes 11–13: look at your goals" },
      {
        type: "p",
        text: "For each goal, are you on track, ahead or behind? If you're behind, choose: save more, or move the date. Both are fine. Ignoring it isn't.",
      },
      { type: "h2", text: "Minutes 13–15: look at next month" },
      {
        type: "p",
        text: "Which bills are due, when does income arrive, and is there a moment where money gets tight? A [cash flow forecast](/blog/personal-cash-flow-forecast) catches that before it happens.",
      },
      {
        type: "callout",
        text: "Finance is built around this routine: one dashboard for your total, goals that say whether they're on track, and a calendar for next month.",
      },
    ],
  },
  {
    slug: "how-to-split-expenses-with-a-partner",
    title: "How to split expenses with a partner fairly",
    description:
      "Fifty-fifty, proportional to income, or one shared pot. Three ways couples split costs, a worked example of each, and how to pick the one that feels fair to both of you.",
    date: "2026-10-26",
    category: "Money habits",
    blocks: [
      {
        type: "p",
        text: "There's no correct way for couples to split money, only one that both people feel is fair. Most couples land on one of three approaches, or a mix.",
      },
      { type: "h2", text: "1. Split everything 50/50" },
      {
        type: "p",
        text: "Each person pays half of every shared cost. It's simple and feels equal, and it works well when you earn similar amounts. When incomes differ a lot, the lower earner can end up with almost nothing left.",
      },
      { type: "h2", text: "2. Split in proportion to income" },
      {
        type: "p",
        text: "Each person pays the same share of their income. If one earns **$6,000** a month and the other **$4,000**, they contribute 60% and 40%. On $3,000 of shared costs, that's $1,800 and $1,200. Both keep the same proportion of their pay for themselves.",
      },
      { type: "h2", text: "3. One shared pot" },
      {
        type: "p",
        text: "Both incomes go into one joint account that pays for everything, sometimes with a fixed personal allowance each. It's the least admin, and it needs the most trust and agreement on spending.",
      },
      { type: "h2", text: "What to agree on, whichever you pick" },
      {
        type: "ul",
        items: [
          "Which costs are shared: rent and groceries, surely. Holidays? Gifts for family?",
          "Who pays what, and on which day.",
          "How you settle up when one person covers something for both.",
          "When you'll review it, especially after a raise or a job change.",
        ],
      },
      { type: "h2", text: "Settle up without the awkwardness" },
      {
        type: "p",
        text: "When one person pays and the other owes half, write it down straight away. In Finance, you can record it as a [loan](/features#loans) and log part-payments as they come, so nobody has to remember who paid for what three weeks ago.",
      },
    ],
  },
  {
    slug: "moving-abroad-money-checklist",
    title: "Moving abroad? A money checklist for the first year",
    description:
      "Accounts in two countries, two currencies and a new cost of living. What to sort out before you go, in the first month, and in the first year.",
    date: "2026-10-26",
    category: "Insights",
    blocks: [
      {
        type: "p",
        text: "Moving countries splits your financial life in two: accounts at home, accounts in your new country, and money moving between them. A little organisation early saves a lot of confusion later.",
      },
      { type: "h2", text: "Before you go" },
      {
        type: "ul",
        items: [
          "Check which of your home accounts and cards will keep working abroad, and what they charge.",
          "Keep at least one home account open for anything still paid there.",
          "Build a buffer for deposits, flights and the weeks before your first local salary.",
          "Find out how tax residency works for your move. Rules vary by country, so ask a professional.",
        ],
      },
      { type: "h2", text: "In the first month" },
      {
        type: "ul",
        items: [
          "Open a local account so your salary and rent stay in one currency.",
          "Pick one low-cost way to move money between countries, and check its real cost against the [mid-market rate](/blog/mid-market-exchange-rate-explained).",
          "Write down every account you hold, in both countries, with its currency.",
        ],
      },
      { type: "h2", text: "In the first year" },
      {
        type: "ul",
        items: [
          "Rebuild your [emergency fund](/blog/how-much-should-be-in-an-emergency-fund) in the currency of the country you live in.",
          "Decide which currency you think in. That's the one to see your total in.",
          "Watch how exchange rates move your net worth, even when your balances don't.",
        ],
      },
      { type: "h2", text: "Keep one view of everything" },
      {
        type: "p",
        text: "Banking apps in two countries won't add up your money for you. Finance keeps every account in its own currency and shows your total in the one you choose, at live rates. See how it works for [expats and anyone paid abroad](/use-cases), or read the guide to [tracking money across currencies](/blog/tracking-money-in-multiple-currencies).",
      },
    ],
  },
  {
    slug: "assets-vs-liabilities",
    title: "Assets vs. liabilities: a plain-English guide",
    description:
      "What counts as an asset, what counts as a liability, and the grey areas in between: cars, homes and money your friends owe you.",
    date: "2026-10-26",
    category: "Guide",
    blocks: [
      {
        type: "p",
        text: "Every personal finance number starts with two lists: what you own and what you owe. Get those right and your [net worth](/blog/how-to-calculate-your-net-worth) is just subtraction.",
      },
      { type: "callout", text: "Net worth = assets − liabilities" },
      { type: "h2", text: "Assets: what you own" },
      {
        type: "ul",
        items: [
          "Cash, checking and savings accounts, in any currency",
          "Digital wallets and prepaid cards",
          "Investments and retirement accounts, at today's value",
          "Money other people owe you",
          "Property and vehicles, at a realistic resale value",
        ],
      },
      { type: "h2", text: "Liabilities: what you owe" },
      {
        type: "ul",
        items: [
          "Credit card balances",
          "Mortgages, car loans and personal loans",
          "Student loans",
          "Money you've borrowed from friends or family",
        ],
      },
      { type: "h2", text: "The grey areas" },
      {
        type: "p",
        text: "**Cars** are assets, but they lose value every year, so update the number. **Homes** are assets that are hard to turn into cash, which is why many people track net worth with and without property. **Money lent to friends** is an asset only if you expect it back. If you don't, leave it out.",
      },
      { type: "h2", text: "Why the split matters" },
      {
        type: "p",
        text: "Two people can have the same net worth and very different situations. One might hold $20,000 in savings, another $220,000 in property and a $200,000 mortgage. Knowing both sides tells you how much flexibility you really have.",
      },
      {
        type: "p",
        text: "Try it with the [net worth calculator](/tools/net-worth-calculator), which takes each asset and liability in its own currency.",
      },
    ],
  },
  {
    slug: "why-net-worth-averages-mislead",
    title: "Net worth by age: why the averages mislead you",
    description:
      "Average net worth figures are pulled up by a few very wealthy households. Why the median is a better yardstick, and why your own trend matters more than either.",
    date: "2026-10-26",
    category: "Insights",
    blocks: [
      {
        type: "p",
        text: "\"Net worth by age\" is one of the most searched money questions there is. The tables you find usually show an average, and the average is almost never what a typical person has.",
      },
      { type: "h2", text: "Mean vs. median" },
      {
        type: "p",
        text: "Imagine ten people. Nine have a net worth of **$20,000** and one has **$2,000,000**. The average (mean) is $218,000, a number that describes nobody in the room. The median, the person in the middle, is $20,000.",
      },
      {
        type: "callout",
        text: "When a few values are extreme, the median tells you what's typical. The mean tells you what the outliers did.",
      },
      { type: "h2", text: "What the tables also leave out" },
      {
        type: "ul",
        items: [
          "Where people live, and what housing costs there.",
          "Whether a home is counted, and how it's valued.",
          "Student debt, which hits some age groups much harder.",
          "Currency: a figure from one country says little about another.",
        ],
      },
      { type: "h2", text: "A better yardstick: yourself" },
      {
        type: "p",
        text: "The comparison that tells you most is your net worth today against your net worth six or twelve months ago. A rising line means your decisions are working, whatever any table says.",
      },
      {
        type: "p",
        text: "Start with today's number using the [net worth calculator](/tools/net-worth-calculator), then track it over time. Finance draws the line for you on its [dashboard](/features#dashboard), and compares each month with the one before.",
      },
    ],
  },
  {
    slug: "how-much-should-be-in-an-emergency-fund",
    title: "How much should be in an emergency fund?",
    description:
      "Three to six months of essential expenses is the usual answer, but the right number depends on your income, your job and who relies on you. Here's how to work out yours.",
    date: "2026-10-25",
    category: "Guide",
    blocks: [
      {
        type: "p",
        text: "An emergency fund is money set aside for the things you can't plan: losing your income, an urgent repair, a medical bill. It's what stops a bad month from turning into debt. The question is always how much.",
      },
      { type: "h2", text: "The short answer" },
      { type: "callout", text: "Emergency fund = essential monthly expenses × months of cover" },
      {
        type: "p",
        text: "Most guidance lands on **three to six months** of essential expenses. If your essentials cost $2,800 a month, that's $8,400 to $16,800. You can work out your own number with the [emergency fund calculator](/tools/emergency-fund-calculator).",
      },
      { type: "h2", text: "Work out your essential expenses" },
      {
        type: "p",
        text: "Essentials are what you'd still have to pay if your income stopped tomorrow. Not your usual spending, only the floor.",
      },
      {
        type: "ul",
        items: [
          "Rent or mortgage, and utilities",
          "Insurance and minimum debt payments",
          "Groceries and transport",
          "Childcare or support for anyone who depends on you",
        ],
      },
      { type: "h2", text: "When three months is enough" },
      {
        type: "p",
        text: "A stable salary, skills that are in demand, no dependants and a partner with their own income all lower your risk. In that situation, three months is a reasonable target to start with.",
      },
      { type: "h2", text: "When you need more" },
      {
        type: "ul",
        items: [
          "**Irregular income**: freelancers and commission-based jobs often aim for six to twelve months.",
          "**Single income households**, or people supporting family.",
          "**Specialised jobs** that would take a long time to replace.",
          "**Living abroad**, where moving home in a hurry can be expensive.",
        ],
      },
      { type: "h2", text: "Where to keep it" },
      {
        type: "p",
        text: "Somewhere safe, separate from your everyday account, and quick to reach. A dedicated savings account works well. The point is access and stability, not returns.",
      },
      { type: "h2", text: "Building it without stalling" },
      {
        type: "p",
        text: "Treat it like any other savings goal: pick a monthly amount and a date. If $10,000 feels far away, start with one month of expenses, then grow it. Tracking it as an [objective in Finance](/features#goals) shows the month you'll be fully covered and whether you're on track.",
      },
    ],
  },
  {
    slug: "track-all-your-bank-accounts-in-one-place",
    title: "How to track all your bank accounts in one place",
    description:
      "Checking here, savings there, a wallet abroad and some cash. A simple way to see every balance, and one total, without logging into five apps.",
    date: "2026-10-25",
    category: "Guide",
    blocks: [
      {
        type: "p",
        text: "Most people have more accounts than they think: a main bank, a savings account, a digital wallet, maybe an account in another country and some cash. Each has its own app, and none of them shows you the total.",
      },
      { type: "h2", text: "Step 1: list every account" },
      {
        type: "p",
        text: "Write down every place you hold money, with its current balance and currency. Include the small ones. A forgotten wallet with $300 in it is still part of your picture.",
      },
      { type: "h2", text: "Step 2: keep each balance in its own currency" },
      {
        type: "p",
        text: "Record a euro account in euros and a dollar account in dollars. Convert only when you add them up, so the balances stay exact and the total uses current rates. The [net worth calculator](/tools/net-worth-calculator) does this for a one-off snapshot.",
      },
      { type: "h2", text: "Step 3: decide how you'll keep it up to date" },
      {
        type: "ul",
        items: [
          "**Record movements**: log deposits, withdrawals and transfers as they happen. The balance and its history stay accurate.",
          "**Update balances**: once a month, set each account to its real balance. Quicker, but you lose the detail in between.",
        ],
      },
      {
        type: "p",
        text: "Many people mix the two: record the important movements, and correct the rest monthly.",
      },
      { type: "h2", text: "Step 4: treat transfers as transfers" },
      {
        type: "p",
        text: "Moving money from checking to savings isn't spending or income. If you log it as a withdrawal and an unrelated deposit, your monthly figures look busier than they are. Record it as one transfer between two accounts.",
      },
      { type: "h2", text: "Step 5: look at the total, not the accounts" },
      {
        type: "p",
        text: "Once everything is in one place, the number to watch is the total and how it changes month to month. That's your net worth. Individual accounts matter less than the direction of the whole.",
      },
      {
        type: "callout",
        text: "In Finance, you add each account once, record transfers between them in one step, and see one total in the currency you choose, without connecting any bank.",
      },
    ],
  },
  {
    slug: "finance-app-without-bank-connection",
    title: "Finance apps that don't need your bank login: what to look for",
    description:
      "Want to track your money without linking your bank account? Here's why some people prefer it, what you give up, and the features that make manual tracking painless.",
    date: "2026-10-25",
    category: "Product",
    blocks: [
      {
        type: "p",
        text: "Linking a bank account to an app is convenient, but not everyone wants to. Some people prefer not to share access to their accounts; others have banks that simply aren't supported. Either way, you can still get a clear picture of your money.",
      },
      { type: "h2", text: "Why people choose not to connect" },
      {
        type: "ul",
        items: [
          "**Privacy**: no third party holds a live connection to your accounts.",
          "**Coverage**: banks in many countries, and many smaller banks, aren't supported by sync services.",
          "**Reliability**: there are no broken connections to re-authorise every few weeks.",
          "**Focus**: you track the numbers that matter instead of hundreds of tiny transactions.",
        ],
      },
      { type: "h2", text: "What you give up" },
      {
        type: "p",
        text: "Honestly: automation. Nothing appears on its own, so you need a light routine, usually a few minutes a week or a month. If you want every purchase categorised automatically, a bank-synced budgeting app suits you better.",
      },
      { type: "h2", text: "Features that make manual tracking easy" },
      {
        type: "ol",
        items: [
          "**Multiple currencies** with automatic conversion, if any of your money is abroad.",
          "**Transfers between accounts** as one entry, not two.",
          "**Back-dating**, so you can record things on the day they happened.",
          "**Recurring income and bills**, so regular items don't need typing every month.",
          "**Loans to and from people**, which no bank feed shows anyway.",
          "**Export**, so your data is never locked in.",
        ],
      },
      { type: "h2", text: "Check how the app handles your data" },
      {
        type: "p",
        text: "Even without a bank connection, you're storing sensitive numbers. Look for a clear privacy page that says what's stored, how passwords are protected, and which services are involved. Here's [ours](/privacy).",
      },
      {
        type: "p",
        text: "Finance was built for exactly this: every account in its own currency, transfers, loans with part-payments, goals with projections, and a cash flow calendar, with no bank connection at any point. See [all features](/features), or compare the trade-offs in [manual tracking vs. bank sync](/blog/manual-tracking-vs-bank-sync).",
      },
    ],
  },
  {
    slug: "net-worth-spreadsheet-vs-app",
    title: "Net worth spreadsheet vs. app: which should you use?",
    description:
      "Spreadsheets are free and flexible. Apps are faster and keep history for you. Here's an honest look at both for tracking your net worth.",
    date: "2026-10-25",
    category: "Guide",
    blocks: [
      {
        type: "p",
        text: "Plenty of people track their net worth in a spreadsheet, and it works. The question is whether it keeps working once you have several accounts, a couple of currencies and a few years of history.",
      },
      { type: "h2", text: "Where spreadsheets shine" },
      {
        type: "ul",
        items: [
          "**Free and flexible**: you decide every column and formula.",
          "**Fully private**: the file is yours.",
          "**Good for a snapshot**: a quick total on the first of the month.",
        ],
      },
      { type: "h2", text: "Where spreadsheets get painful" },
      {
        type: "ul",
        items: [
          "**Currencies**: you look up rates by hand, and old rows go stale.",
          "**History**: charts over time need a new row every month and formulas that don't break.",
          "**Movements**: transfers, loans and repayments are fiddly to model.",
          "**Forecasts**: projecting goals or next month's balance means building it yourself.",
        ],
      },
      { type: "h2", text: "Where an app helps" },
      {
        type: "p",
        text: "A dedicated app handles conversion, history and projections for you, and makes the routine faster. The trade-off is that you work within its structure instead of building your own.",
      },
      { type: "h2", text: "A middle path" },
      {
        type: "p",
        text: "Start with a snapshot: list everything you own and owe in the [net worth calculator](/tools/net-worth-calculator). If you want to track it over time without maintaining formulas, move it into an app. If you like the control of a spreadsheet, keep it, and use an app's export to back it up.",
      },
      {
        type: "callout",
        text: "Whichever you pick, the habit matters more than the tool. Check your net worth monthly and compare it with the month before.",
      },
      {
        type: "p",
        text: "Finance keeps your history automatically, converts currencies at live rates, and exports to CSV whenever you want a spreadsheet copy. [Here's how it works](/how-it-works).",
      },
    ],
  },
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
        text: "That's it. The work is in being honest about both sides of the line. If you want to try it now, the free [net worth calculator](/tools/net-worth-calculator) adds everything up, in any currency.",
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
        text: "Pick one **display currency**, usually the one you think in or plan to spend in, and convert to it only when you need a total. That way balances stay exact, and the total is always based on current rates. You can try it with the [multi-currency net worth calculator](/tools/net-worth-calculator).",
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
        text: "Say the goal is $13,600 and you've saved $9,248. You have $4,352 to go. (Or skip the maths: the [savings goal calculator](/tools/savings-goal-calculator) does it for you.)",
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
