"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <div className="pt-7">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="lp-faq__item" data-open={isOpen ? "" : undefined}>
            <h3>
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a${i}`}
                className="lp-faq__q"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.q}
                <ChevronDown size={16} strokeWidth={1.75} aria-hidden />
              </button>
            </h3>
            <div
              id={`${id}-a${i}`}
              role="region"
              aria-labelledby={`${id}-q${i}`}
              className="lp-faq__panel"
              inert={!isOpen}
            >
              <div>
                <p className="lp-faq__a">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
