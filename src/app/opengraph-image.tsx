import { ImageResponse } from "next/og";
import { loadOgFonts, OG_SIZE } from "@/lib/og/fonts";
import { BrandCard } from "@/lib/og/OgCard";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "BGA 行動指針診断";

export default async function Image() {
  const fonts = await loadOgFonts();
  return new ImageResponse(<BrandCard />, { ...size, fonts });
}
