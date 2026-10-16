import { SiteFooter, SiteNav } from "@/components/landing/site-chrome";
import "./landing.css";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lp">
      <SiteNav />
      <main className="px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}
