import { ImageResponse } from "next/og";
import { decodeResult } from "@/lib/bga";
import { loadOgFonts, OG_SIZE } from "@/lib/og/fonts";
import { BrandCard, TypeCard } from "@/lib/og/OgCard";

/** 結果ページ用 OGP 画像: /og?r=<結果コード> */
export async function GET(req: Request) {
  const r = new URL(req.url).searchParams.get("r");
  const result = decodeResult(r);
  const fonts = await loadOgFonts();
  return new ImageResponse(
    result ? <TypeCard type={result.type} normal={result.normal} pressure={result.pressure} /> : <BrandCard />,
    {
      ...OG_SIZE,
      fonts,
      headers: {
        "Cache-Control": result ? "public, max-age=86400, s-maxage=31536000, immutable" : "public, max-age=3600",
      },
    },
  );
}
