<div align="center">

# Mobile View Studio
**Ekstensi Browser Workbench untuk Pratinjau Mode Mobile Sekali Klik**

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-38bdf8?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Zero Build](https://img.shields.io/badge/Build-Zero--Step-10b981?style=flat-square)](/)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](/)

</div>

---

### Masalah yang Diselesaikan
Saat membuat atau merapikan tampilan website di laptop/PC, kita sering harus menekan `F12`, mengaktifkan tombol kecil Device Toolbar (`Ctrl+Shift+M`), lalu mengatur ukuran layar secara manual. Proses ini berulang-ulang dan panel inspect bawaan sering memakan ruang kerja.

**Mobile View** memotong seluruh langkah manual tersebut: cukup tekan shortcut **`Alt+M`** atau klik 1x ikon ekstensi di toolbar, website yang sedang dibuka langsung meletup ke dalam **mockup fisik smartphone** yang siap di-inspect.

---

### Fitur Utama

* **Akses Instan 1-Klik**: Shortcut global `Alt+M`, klik ikon toolbar, atau klik kanan di halaman mana pun.
* **Mockup Fisik Hardware Presisi**:
  * iPhone 15 Pro & Pro Max (Dynamic Island + Titanium bezel)
  * iPhone 14 / 13 (Classic Notch)
  * iPhone SE 3rd Gen
  * Samsung Galaxy S24 (Punch-hole display)
  * Google Pixel 8
  * iPad Mini 6th Gen
  * Custom Dimensi (bebas atur lebar x tinggi)
* **Rotasi Mulus (Portrait ⇄ Landscape)**: Cukup tekan tombol `R` di keyboard.
* **Skala Adaptif (Fit to Screen)**: Menyesuaikan otomatis agar frame HP pas di layar monitor tanpa terpotong.
* **Sekring Anti-Blokir (DNR Subframe)**: Otomatis melucuti proteksi `X-Frame-Options` dan `CSP frame-ancestors` pada iframe preview, sehingga website lokal (`localhost`) maupun publik dapat dimuat tanpa layar putih.
* **Siap Inspect Element Native**: Klik kanan di dalam layar smartphone ➜ **Inspect** (atau tekan `F12`). Chrome DevTools langsung aktif menginspeksi elemen HTML/CSS di dalam iframe.

---

### Cara Pemasangan di Browser (Chrome / Brave / Edge)

1. Buka browser Chromium (Brave / Chrome / Edge).
2. Masuk ke halaman ekstensi: `chrome://extensions` (atau `brave://extensions`).
3. Aktifkan saklar **Developer mode** di pojok kanan atas.
4. Klik tombol **Load unpacked** (Muat yang belum dibongkar).
5. Pilih folder:
   ```text
   /home/hizam/proyek/mobile-view
   ```
6. Ekstensi langsung aktif dan siap digunakan.

---

### Struktur Berkas (Zero-Bloat)

```text
mobile-view/
├── manifest.json       # Manifest V3 + shortcut Alt+M
├── background.js       # Background service worker penangkap event
├── rules.json          # Sekring declarativeNetRequest pelucut header blokir
├── preview.html        # Antarmuka studio workstation & frame HP
├── preview.js          # Pengendali reaktif (preset, rotasi, zoom, sync)
└── icons/              # Aset ikon PNG (16, 32, 48, 128 px)
```

---

<div align="center">
Megapass Intra Solusindo • Sidoarjo, Indonesia
</div>
