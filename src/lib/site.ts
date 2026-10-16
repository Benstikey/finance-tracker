/** Canonical origin for metadata, sitemap and structured data. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://finance.wasben.com"
).replace(/\/$/, "");

export const SITE_NAME = "Finance";

export const SITE_DESCRIPTION =
  "A private, multi-currency net worth tracker. Track bank accounts, wallets, cash, loans and savings goals in one place, with live exchange rates and no bank sync.";
