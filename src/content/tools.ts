import type { ToolContent } from "@/components/landing/tool-page";

export const NET_WORTH_TOOL: ToolContent = {
  slug: "net-worth-calculator",
  name: "Net worth calculator",
  title: "Net worth calculator, in any currency",
  intro:
    "Add what you own and what you owe, each in its own currency. Your net worth updates instantly at live exchange rates.",
  related: ["how-to-calculate-your-net-worth", "tracking-money-in-multiple-currencies"],
  blocks: [
    { type: "h2", text: "How this calculator works" },
    {
      type: "p",
      text: "Your net worth is everything you own minus everything you owe. Enter each account, wallet or debt on its own line, in the currency it's actually held in. The calculator converts every line into the currency you pick and adds them up.",
    },
    { type: "callout", text: "Net worth = total assets − total liabilities" },
    { type: "h2", text: "What to include" },
    {
      type: "ul",
      items: [
        "**Assets**: bank accounts, savings, digital wallets, cash, money people owe you, and investments at today's value.",
        "**Liabilities**: credit card balances, personal and car loans, student loans, and money you've borrowed from people.",
      ],
    },
    {
      type: "p",
      text: "Use current values, not what you paid. A car is worth what it would sell for today. For a step-by-step walkthrough, read [how to calculate your net worth](/blog/how-to-calculate-your-net-worth).",
    },
    { type: "h2", text: "Why the currency matters" },
    {
      type: "p",
      text: "If you hold money in more than one currency, your net worth changes when exchange rates move, even if your balances don't. The \"assets by currency\" breakdown shows how exposed you are to each one.",
    },
  ],
  faqs: [
    {
      q: "What is a good net worth?",
      a: "There's no single number. What matters most is the direction: a net worth that rises steadily over months and years means your decisions are working. Compare yourself with your own past, not with averages.",
    },
    {
      q: "Should I include my home or car?",
      a: "You can, at a realistic resale value, and include the mortgage or loan against it as a liability. Many people track two numbers: net worth with and without property, because property is hard to turn into cash.",
    },
    {
      q: "Which exchange rates are used?",
      a: "Live market rates from a public exchange rate service, refreshed every hour. They're mid-market rates, so a real conversion through a bank may give you slightly less.",
    },
    {
      q: "Is my data saved?",
      a: "No. The calculator runs entirely in your browser and nothing you type is sent or stored. To keep a history over time, you can track it in Finance for free.",
    },
    {
      q: "Can net worth be negative?",
      a: "Yes. If you owe more than you own, your net worth is negative. That's common early in a career or after a large loan, and the trend over time matters more than the starting point.",
    },
  ],
};

export const SAVINGS_TOOL: ToolContent = {
  slug: "savings-goal-calculator",
  name: "Savings goal calculator",
  title: "Savings goal calculator: when will you get there?",
  intro:
    "Enter a goal, what you've saved and either a monthly amount or a date. See when you'll reach it, or how much to save each month.",
  related: ["savings-goals-you-will-actually-reach", "how-much-should-be-in-an-emergency-fund"],
  blocks: [
    { type: "h2", text: "The maths behind it" },
    { type: "callout", text: "Months to go = (goal − already saved) ÷ monthly amount, rounded up" },
    { type: "callout", text: "Needed per month = (goal − already saved) ÷ months until your date" },
    {
      type: "p",
      text: "With a monthly amount, the calculator tells you the month you'll reach your goal. With a date, it tells you what to save each month. With both, it tells you whether you're on track, and if not, how many months behind and what it would take to catch up.",
    },
    { type: "h2", text: "Making the plan stick" },
    {
      type: "ul",
      items: [
        "Send any money above your plan to your top-priority goal.",
        "Update \"already saved\" when it changes, so every projection stays accurate.",
        "If you're behind, moving the date is a valid choice. Ignoring it isn't.",
      ],
    },
    {
      type: "p",
      text: "There's a longer guide with worked examples: [savings goals you'll actually reach](/blog/savings-goals-you-will-actually-reach).",
    },
  ],
  faqs: [
    {
      q: "Does this include interest?",
      a: "No. It assumes your savings don't grow on their own, which keeps the plan conservative. If your savings earn interest, you'll reach the goal a little sooner.",
    },
    {
      q: "Why round the months up?",
      a: "Because a goal isn't reached until the last bit is saved. 8.2 months means you'll get there during the ninth month.",
    },
    {
      q: "What if I have several goals?",
      a: "Run the calculator for each one. A common approach is to give every goal a minimum monthly amount and send anything extra to the most important one.",
    },
    {
      q: "Can I track goals over time?",
      a: "Yes. In Finance, each objective can have a monthly amount and a target date, and shows the month you'll reach it, whether you're on track, and what you'd need per month to catch up.",
    },
  ],
};

export const EMERGENCY_TOOL: ToolContent = {
  slug: "emergency-fund-calculator",
  name: "Emergency fund calculator",
  title: "Emergency fund calculator",
  intro:
    "Work out how much to keep aside for the unexpected, how many months you're covered today, and when you'll be fully covered.",
  related: ["how-much-should-be-in-an-emergency-fund", "savings-goals-you-will-actually-reach"],
  blocks: [
    { type: "h2", text: "How much do you need?" },
    { type: "callout", text: "Emergency fund = essential monthly expenses × months of cover" },
    {
      type: "p",
      text: "A common rule of thumb is three to six months of essential expenses. Choose more if your income is irregular, you're self-employed, you support others, or your job would be hard to replace quickly.",
    },
    { type: "h2", text: "Count essentials only" },
    {
      type: "ul",
      items: [
        "Rent or mortgage, utilities and insurance.",
        "Groceries, transport and minimum debt payments.",
        "Anything you'd still have to pay if your income stopped tomorrow.",
      ],
    },
    {
      type: "p",
      text: "Leave out holidays, eating out and other spending you'd cut in an emergency. Read more in [how much should be in an emergency fund](/blog/how-much-should-be-in-an-emergency-fund).",
    },
  ],
  faqs: [
    {
      q: "Is three months enough?",
      a: "For many people with a stable salary and few dependants, three months is a reasonable start. Six months or more gives more breathing room, and is often recommended for freelancers and single-income households.",
    },
    {
      q: "Where should I keep an emergency fund?",
      a: "Somewhere safe and easy to reach quickly, such as a savings account separate from your everyday spending. The goal is access and stability, not high returns.",
    },
    {
      q: "Should I pay off debt first?",
      a: "Many people build a small starter fund first, so a surprise bill doesn't go on a credit card, then pay down high-interest debt, then finish the full fund.",
    },
    {
      q: "What counts as an emergency?",
      a: "Something unexpected and necessary: losing income, a medical bill, an urgent repair. Planned costs, like a holiday or a new phone, belong in their own savings goal.",
    },
  ],
};

export const TOOLS = [NET_WORTH_TOOL, SAVINGS_TOOL, EMERGENCY_TOOL];
