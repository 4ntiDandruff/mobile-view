#!/usr/bin/env python3
"""Script Generator Icon & Favicon Mobile View Studio (Flat Modern Minimalis).
Referensi Desain: cekweb.megapass.web.id (Solid Electric Blue #0071E3, Flat Minimalist, Cyan Accent #64D2FF).
Standar: Zero-Bloat, Multi-Scale Crispness (16x16 hingga 512x512 px).
"""
import os
from pathlib import Path
from PIL import Image, ImageDraw

ICONS_DIR = Path(__file__).resolve().parent.parent / "icons"
os.makedirs(ICONS_DIR, exist_ok=True)

# 1. Master Flat SVG (512x512)
SVG_CONTENT = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Flat Solid Blue Squircle Background (Referensi CekWeb Megapass) -->
  <rect width="512" height="512" rx="128" fill="#0071E3"/>

  <!-- Smartphone Outer Chassis (Bold Solid White Frame) -->
  <rect x="144" y="72" width="224" height="368" rx="46" fill="none" stroke="#FFFFFF" stroke-width="28"/>

  <!-- Dynamic Island Sensor (Electric Cyan #64D2FF) -->
  <rect x="224" y="108" width="64" height="16" rx="8" fill="#64D2FF"/>

  <!-- Responsive Mobile Screen Content Blocks -->
  <!-- Top Hero Card (Crisp White Semi-Translucent) -->
  <rect x="184" y="148" width="144" height="84" rx="16" fill="#FFFFFF" fill-opacity="0.32"/>

  <!-- Accent Interactive Button (Solid Electric Cyan) -->
  <rect x="184" y="248" width="144" height="26" rx="12" fill="#64D2FF"/>

  <!-- Content Rows -->
  <rect x="184" y="290" width="104" height="18" rx="9" fill="#FFFFFF" fill-opacity="0.45"/>
  <rect x="184" y="320" width="72" height="18" rx="9" fill="#FFFFFF" fill-opacity="0.30"/>

  <!-- Bottom Home Dock Bar (Solid White) -->
  <rect x="212" y="396" width="88" height="14" rx="7" fill="#FFFFFF"/>
</svg>"""


def main():
    print("[*] Menulis master icon.svg (Flat Modern Minimalis)...")
    svg_path = ICONS_DIR / "icon.svg"
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(SVG_CONTENT)
    print(f"[+] Master SVG tersimpan: {svg_path.name}")

    # Render PNG multi-ukuran menggunakan Pillow (1024x1024 supersampling)
    print("[*] Merender ikon raster PNG (Flat Minimalist)...")
    S = 1024
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    BLUE = (0, 113, 227, 255)       # #0071E3
    WHITE = (255, 255, 255, 255)    # #FFFFFF
    CYAN = (100, 210, 255, 255)     # #64D2FF
    WHITE_32 = (255, 255, 255, 82)  # 32%
    WHITE_45 = (255, 255, 255, 115) # 45%
    WHITE_30 = (255, 255, 255, 76)  # 30%

    # 1. Base Squircle (Solid Electric Blue #0071E3)
    draw.rounded_rectangle([0, 0, S, S], radius=256, fill=BLUE)

    # 2. Smartphone Outer Frame (scale 2x)
    draw.rounded_rectangle([288, 144, 736, 880], radius=92, outline=WHITE, width=56)

    # 3. Dynamic Island Pill
    draw.rounded_rectangle([448, 216, 576, 248], radius=16, fill=CYAN)

    # 4. Hero Card
    draw.rounded_rectangle([368, 296, 656, 464], radius=32, fill=WHITE_32)

    # 5. Cyan Action Button
    draw.rounded_rectangle([368, 496, 656, 548], radius=24, fill=CYAN)

    # 6. Content Rows
    draw.rounded_rectangle([368, 580, 576, 616], radius=18, fill=WHITE_45)
    draw.rounded_rectangle([368, 640, 512, 676], radius=18, fill=WHITE_30)

    # 7. Bottom Home Dock Bar
    draw.rounded_rectangle([424, 792, 600, 820], radius=14, fill=WHITE)

    # Ukuran aset Chrome Extension & Favicon
    sizes = {
        "icon16.png": 16,
        "icon32.png": 32,
        "icon48.png": 48,
        "icon128.png": 128,
        "icon512.png": 512,
    }

    for filename, sz in sizes.items():
        resized = img.resize((sz, sz), Image.Resampling.LANCZOS)
        out_path = ICONS_DIR / filename
        resized.save(out_path, "PNG", optimize=True)
        print(f"[+] Berhasil render: {filename} ({sz}x{sz})")

    # Multi-resolution ICO (16, 32, 48px)
    ico_path = ICONS_DIR / "favicon.ico"
    img_16 = img.resize((16, 16), Image.Resampling.LANCZOS)
    img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    img_48 = img.resize((48, 48), Image.Resampling.LANCZOS)
    img_32.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[img_16, img_48])
    print("[+] Berhasil render: favicon.ico (Multi-frame 16, 32, 48px)")


if __name__ == "__main__":
    main()
