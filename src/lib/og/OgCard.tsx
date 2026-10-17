import type { ReactElement } from "react";
import { STYLES, STYLE_IDS, toPercent, type PhaseProfile, type StyleId, type TypeDef } from "@/lib/bga";
import { OG_FONT_FAMILY } from "./fonts";

/**
 * OGP 画像のテンプレート。next/og (Satori) で描画するため、
 * 複数の子を持つ要素には必ず display:flex を付け、CSS 変数は使わない。
 */

const BG = "#faf9f6";
const FG = "#1c1c1a";
const MUTED = "#6b6a66";
const CARD = "#ffffff";
const BORDER = "#e6e3dc";
const SITE = "bga-ten.vercel.app";

function hexToRgba(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function Frame({ a, b, children }: { a: string; b: string; children: ReactElement | ReactElement[] }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: OG_FONT_FAMILY,
        color: FG,
        backgroundColor: BG,
        backgroundImage: `radial-gradient(circle at 0% 0%, ${hexToRgba(a, 0.28)} 0%, rgba(0,0,0,0) 55%), radial-gradient(circle at 100% 100%, ${hexToRgba(b, 0.28)} 0%, rgba(0,0,0,0) 55%)`,
        padding: 56,
      }}
    >
      {children}
    </div>
  );
}

function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>BGA</span>
        <span style={{ fontSize: 22, color: MUTED, marginLeft: 12 }}>行動指針診断</span>
      </div>
      <span style={{ fontSize: 20, color: MUTED }}>{SITE}</span>
    </div>
  );
}

function Badge({ id, size }: { id: StyleId; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: STYLES[id].color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        fontWeight: 700,
      }}
    >
      {id}
    </div>
  );
}

function MiniBars({ profile, title }: { profile: PhaseProfile; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: CARD,
        border: `2px solid ${BORDER}`,
        borderRadius: 24,
        padding: "20px 24px",
        width: 400,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{title}</span>
      {profile.order.map((id) => {
        const pct = Math.max(toPercent(profile, id), 4);
        return (
          <div key={id} style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <Badge id={id} size={28} />
            <span style={{ fontSize: 20, width: 120, marginLeft: 10 }}>{STYLES[id].name}</span>
            <div style={{ display: "flex", flex: 1, height: 14, backgroundColor: BORDER, borderRadius: 7 }}>
              <div style={{ width: `${pct}%`, height: 14, backgroundColor: STYLES[id].color, borderRadius: 7 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StyleCard({ label, id }: { label: string; id: StyleId }) {
  const s = STYLES[id];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: CARD,
        border: `2px solid ${BORDER}`,
        borderRadius: 24,
        padding: "20px 24px",
        width: 400,
      }}
    >
      <span style={{ fontSize: 18, color: MUTED }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
        <Badge id={id} size={40} />
        <span style={{ fontSize: 30, fontWeight: 700, marginLeft: 12 }}>{s.name}</span>
      </div>
      <span style={{ fontSize: 20, color: MUTED, marginTop: 8 }}>{s.tagline}</span>
    </div>
  );
}

export function TypeCard({
  type,
  normal,
  pressure,
}: {
  type: TypeDef;
  normal?: PhaseProfile;
  pressure?: PhaseProfile;
}) {
  const n = STYLES[type.normal];
  const p = STYLES[type.pressure];
  const withScores = Boolean(normal && pressure);
  const titleSize = type.name.length >= 9 ? 62 : type.name.length >= 7 ? 68 : 76;
  // Satori は Fragment を正しく扱えないので、右カラムの子は配列で渡す
  const right = withScores
    ? [
        <MiniBars key="n" profile={normal!} title="普段のあなた" />,
        <div key="gap" style={{ display: "flex", height: 16 }} />,
        <MiniBars key="p" profile={pressure!} title="プレッシャー下のあなた" />,
      ]
    : [
        <StyleCard key="n" label="普段" id={type.normal} />,
        <div key="gap" style={{ display: "flex", height: 16 }} />,
        <StyleCard key="p" label="プレッシャー下" id={type.pressure} />,
      ];
  return (
    <Frame a={n.color} b={p.color}>
      <Brand />
      <div style={{ display: "flex", flex: 1, alignItems: "center", marginTop: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 640, paddingRight: 32 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Badge id={type.normal} size={60} />
            <span style={{ fontSize: 34, color: MUTED, margin: "0 14px" }}>→</span>
            <Badge id={type.pressure} size={60} />
            <span style={{ fontSize: 26, color: MUTED, marginLeft: 18, whiteSpace: "nowrap" }}>{type.code}型</span>
          </div>
          <span style={{ fontSize: titleSize, fontWeight: 700, letterSpacing: -1, marginTop: 18, lineHeight: 1.15 }}>
            {type.name}
          </span>
          <span style={{ fontSize: 30, marginTop: 14, color: FG, lineHeight: 1.4 }}>{type.catch}</span>
          <span style={{ fontSize: 21, marginTop: 16, color: MUTED, lineHeight: 1.4 }}>
            {withScores ? "普段 → プレッシャー下 で先に動くスタイル" : `普段は${n.name}、プレッシャー下では${p.name}`}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: 400 }}>{right}</div>
      </div>
    </Frame>
  );
}

export function BrandCard() {
  return (
    <Frame a={STYLES.S.color} b={STYLES.D.color}>
      <Brand />
      <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 800 }}>
          <span style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.25, letterSpacing: -1 }}>
            普段のあなたと、
          </span>
          <span style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.25, letterSpacing: -1 }}>
            追い詰められたときのあなた。
          </span>
          <span style={{ fontSize: 26, color: MUTED, marginTop: 24 }}>
            4つの行動スタイルを2つの場面で測る、16タイプの無料診断
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 32 }}>
          {STYLE_IDS.map((id) => (
            <div key={id} style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
              <Badge id={id} size={48} />
              <span style={{ fontSize: 28, fontWeight: 700, marginLeft: 14 }}>{STYLES[id].name}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
