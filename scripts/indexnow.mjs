/**
 * Tells IndexNow-enabled search engines (Bing, Yandex, Seznam, Naver…) about
 * every URL in the live sitemap, so new pages get crawled quickly.
 *
 *   npm run seo:indexnow
 *
 * The key is the name of the public/<key>.txt file; engines fetch it to
 * confirm we own the site. It isn't a secret.
 */
import { readdirSync } from "node:fs";

const SITE = "https://finance.wasben.com";
const keyFile = readdirSync(new URL("../public/", import.meta.url)).find((f) =>
  /^[a-f0-9]{32}\.txt$/.test(f)
);
if (!keyFile) {
  console.error("No IndexNow key file found in public/.");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key,
    keyLocation: `${SITE}/${keyFile}`,
    urlList: urls,
  }),
});
console.log(`Submitted ${urls.length} URLs to IndexNow: HTTP ${res.status}`);
if (!res.ok && res.status !== 202) process.exit(1);
