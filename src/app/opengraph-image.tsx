import { ImageResponse } from "next/og";

export const alt = "Finance: your money, in plain sight. A private, multi-currency net worth tracker.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const POINTS = [96, 98, 97, 101, 104, 103, 107, 110, 108, 113, 117, 116, 121, 125, 124, 129, 133, 131, 136, 142];

function path(w: number, h: number) {
  const min = Math.min(...POINTS);
  const max = Math.max(...POINTS);
  return POINTS.map((v, i) => {
    const x = (i / (POINTS.length - 1)) * w;
    const y = 8 + (1 - (v - min) / (max - min)) * (h - 16);
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join("");
}

export default function Image() {
  const line = path(440, 150);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 88px",
          background: "#ffffff",
          color: "#0a0a0a",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "#0a0a0a" }} />
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>Finance</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -2.5,
            }}
          >
            <span>Your money,</span>
            <span>in plain sight</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 28, lineHeight: 1.35, color: "#737373" }}>
            Every account, currency, loan and goal in one calm place. No bank sync.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 480,
            padding: 20,
            borderRadius: 24,
            background: "#ffffff",
            border: "1px solid #ebebeb",
            boxShadow: "0 4px 42px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 20, color: "#737373" }}>Net worth</div>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1, marginTop: 4 }}>
            $142,800
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <div
              style={{
                fontSize: 18,
                padding: "3px 10px",
                borderRadius: 8,
                background: "#0a0a0a",
                color: "#ffffff",
              }}
            >
              +8.4%
            </div>
            <div style={{ fontSize: 18, color: "#737373" }}>vs previous 30 days</div>
          </div>
          <svg width="440" height="150" viewBox="0 0 440 150" style={{ marginTop: 22 }}>
            <path d={`${line}L440,150L0,150Z`} fill="#0a0a0a" fillOpacity="0.05" />
            <path d={line} fill="none" stroke="#0a0a0a" strokeWidth="3" />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
