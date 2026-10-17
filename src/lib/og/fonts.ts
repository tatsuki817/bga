import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * OGP 画像用フォント。Noto Sans JP (OFL 1.1) をサイトで使う文字だけにサブセット化したもの。
 * 再生成は scripts/subset-fonts.py を参照。
 */
const DIR = join(process.cwd(), "src", "assets", "fonts");

let cache: Promise<OgFont[]> | null = null;

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}

function toArrayBuffer(b: Buffer): ArrayBuffer {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
}

export function loadOgFonts(): Promise<OgFont[]> {
  if (!cache) {
    cache = Promise.all([
      readFile(join(DIR, "NotoSansJP-Regular-subset.ttf")),
      readFile(join(DIR, "NotoSansJP-Bold-subset.ttf")),
    ]).then(([regular, bold]) => [
      { name: "Noto Sans JP", data: toArrayBuffer(regular), weight: 400, style: "normal" },
      { name: "Noto Sans JP", data: toArrayBuffer(bold), weight: 700, style: "normal" },
    ]);
  }
  return cache;
}

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_FONT_FAMILY = "Noto Sans JP";
