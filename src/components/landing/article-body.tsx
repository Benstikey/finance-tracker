import Link from "next/link";
import type { Block } from "@/content/articles";

// Renders the two inline marks articles use: **bold** and [label](/path).
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*(.+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        const link = part.match(/^\[(.+)\]\((.+)\)$/);
        if (link) {
          return (
            <Link key={i} href={link[2]}>
              {link[1]}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="lp-prose">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return <h2 key={i}>{b.text}</h2>;
          case "p":
            return (
              <p key={i}>
                <Inline text={b.text} />
              </p>
            );
          case "callout":
            return (
              <p key={i} className="lp-prose__callout">
                <Inline text={b.text} />
              </p>
            );
          case "ul":
          case "ol": {
            const List = b.type;
            return (
              <List key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </List>
            );
          }
        }
      })}
    </div>
  );
}
