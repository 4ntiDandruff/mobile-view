#!/usr/bin/env python3
"""Generator Icon & Favicon Mobile View Studio.
Standar: Zero-Bloat Icon Engine (zero-bloat-icon-favicon-skill)
Gaya: Flat Modern Minimalis (Referensi: cekweb.megapass.web.id & pastree.megapass.web.id)
Warna: Solid Electric Blue (#0071E3), Pure White (#FFFFFF), Electric Cyan Accent (#64D2FF)
"""

import os
import shutil
import subprocess
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = PROJECT_ROOT / "icons"
SKILL_GENERATOR = Path.home() / "zero-bloat-skills" / "skills" / "zero-bloat-icon-favicon-skill" / "scripts" / "generate_favicon.py"

# Master Flat Minimalist Smartphone Glyph (Grid 64x64, Lucide-scale 2)
GLYPH = '<g transform="translate(8, 8) scale(2)"><rect x="5" y="2" width="14" height="20" rx="3.2" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="9.5" y="4.5" width="5" height="1.8" rx="0.9" fill="#64D2FF"/><rect x="9.5" y="18" width="5" height="1.4" rx="0.7" fill="#FFFFFF"/></g>'


def main():
    ICONS_DIR.mkdir(parents=True, exist_ok=True)
    print("[*] Menjalankan zero-bloat-icon-favicon-skill engine...")

    cmd = [
        "python3",
        str(SKILL_GENERATOR),
        "--glyph", GLYPH,
        "--bg", "#0071E3",
        "--style", "flat",
        "--name", "Mobile View - Device Frame Studio",
        "--prefix", "icons/",
        "--out", str(ICONS_DIR),
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("[-] Gagal menjalankan generator skill:", res.stderr)
        return False
    print(res.stdout.strip())

    # Sinkronisasi alias file Chrome Extension
    print("[*] Menyinkronkan alias aset Chrome Extension...")
    shutil.copy2(ICONS_DIR / "favicon.svg", ICONS_DIR / "icon.svg")
    shutil.copy2(ICONS_DIR / "favicon-16x16.png", ICONS_DIR / "icon16.png")
    shutil.copy2(ICONS_DIR / "favicon-32x32.png", ICONS_DIR / "icon32.png")
    shutil.copy2(ICONS_DIR / "favicon-48x48.png", ICONS_DIR / "icon48.png")

    # Render 128x128 untuk Chrome Web Store
    master_png = ICONS_DIR / "android-chrome-512x512.png"
    if master_png.exists():
        with Image.open(master_png) as im:
            im.resize((128, 128), Image.Resampling.LANCZOS).save(
                ICONS_DIR / "icon128.png", "PNG", optimize=True
            )
        print("[+] Berhasil slice: icon128.png (128x128)")

    print("[✓] Seluruh aset icon & favicon selesai diproduksi:")
    for f in sorted(ICONS_DIR.iterdir()):
        if f.is_file():
            print(f"    - {f.name:24} ({f.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
