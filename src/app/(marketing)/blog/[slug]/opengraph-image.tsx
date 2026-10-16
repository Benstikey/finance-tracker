import { ImageResponse } from "next/og";
import { ARTICLES, getArticle } from "@/content/articles";

export const alt = "An article from the Finance blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 88,
          background: "#ffffff",
          color: "#0a0a0a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#0a0a0a" }} />
          <div style={{ fontSize: 28, fontWeight: 600 }}>Finance</div>
          <div style={{ fontSize: 28, color: "#a3a3a3", marginLeft: 6 }}>/ Blog</div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {article?.title ?? "Finance blog"}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#737373" }}>
          {article?.category ?? "Guide"} · finance.wasben.com
        </div>
      </div>
    ),
    size
  );
}
