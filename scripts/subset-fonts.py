#!/usr/bin/env python3
"""
OGP 画像用の日本語フォントを作る。

Noto Sans JP (SIL Open Font License 1.1) の可変フォントから、
Regular (400) と Bold (700) のインスタンスを切り出し、
サイトで実際に使う文字だけにサブセット化して src/assets/fonts/ に置く。

使い方:
  pip install fonttools brotli
  curl -L -o /tmp/NotoSansJP-VF.ttf \
    "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf"
  python3 scripts/subset-fonts.py /tmp/NotoSansJP-VF.ttf

設問やタイプ名の文言を変えたら再実行する（OGP に載る文字が増えている可能性があるため）。
"""
import re
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "fonts"

# OGP テンプレートに固定で載る文字列。src/lib/og/ と合わせて更新する
FIXED = (
    "BGA 行動指針診断 Behavioral Guidelines Assessment "
    "普段のあなた プレッシャー下のあなた 普段 プレッシャー下 あなたのタイプ 行動指針タイプ "
    "型 僅差 明確 近いタイプ 無料診断 約5分 全24問 "
    "普段のあなたと、追い詰められたときのあなた。 "
    "4つの行動スタイルを2つの場面で測る 16タイプ "
    "bga-ten.vercel.app"
)


def chars_from_sources() -> set[str]:
    chars: set[str] = set()
    for p in (ROOT / "src" / "lib" / "bga").glob("*.ts"):
        if p.name.endswith(".test.ts"):
            continue
        # 文字列リテラルの中身だけ拾う
        for m in re.finditer(r'"((?:[^"\\]|\\.)*)"', p.read_text(encoding="utf-8")):
            chars.update(m.group(1))
    return chars


def glyph_set() -> str:
    chars = chars_from_sources()
    chars.update(FIXED)
    # ASCII 印字可能
    chars.update(chr(c) for c in range(0x20, 0x7F))
    # ひらがな・カタカナ（長音符含む）
    chars.update(chr(c) for c in range(0x3041, 0x3097))
    chars.update(chr(c) for c in range(0x30A1, 0x30FD))
    # よく使う記号
    chars.update("、。「」『』（）［］【】・ー〜…！？：；／×→←↑↓％＋－＝〇○●◎◇◆□■△▲▽▼☆★")
    chars.update("０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ")
    return "".join(sorted(c for c in chars if not c.isspace() or c == " "))


def build(src: Path, weight: int, name: str) -> None:
    vf = TTFont(src)
    inst = instancer.instantiateVariableFont(vf, {"wght": weight}, inplace=False)
    tmp = OUT / f"_{name}.tmp.ttf"
    inst.save(tmp)

    text = glyph_set()
    opts = subset.Options()
    opts.layout_features = ["kern", "palt", "liga"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.hinting = False
    font = subset.load_font(tmp, opts)
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    dst = OUT / f"{name}.ttf"
    subset.save_font(font, dst, opts)
    tmp.unlink()
    print(f"{dst.relative_to(ROOT)}: {dst.stat().st_size // 1024} KB, {len(font.getGlyphOrder())} glyphs, {len(text)} chars")


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1])
    OUT.mkdir(parents=True, exist_ok=True)
    build(src, 400, "NotoSansJP-Regular-subset")
    build(src, 700, "NotoSansJP-Bold-subset")


if __name__ == "__main__":
    main()
