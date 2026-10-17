import { ImageResponse } from "next/og";
import { TYPES, isTypeCode } from "@/lib/bga";
import { loadOgFonts, OG_SIZE } from "@/lib/og/fonts";
import { BrandCard, TypeCard } from "@/lib/og/OgCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "BGA 行動指針診断 タイプ解説";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const fonts = await loadOgFonts();
  return new ImageResponse(isTypeCode(code) ? <TypeCard type={TYPES[code]} /> : <BrandCard />, { ...size, fonts });
}
