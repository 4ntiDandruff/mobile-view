# Catatan Servis & Rekam Medis (Changelog)

Seluruh perubahan teknis, rekam perbaikan sirkuit, dan evolusi arsitektur pada proyek **Mobile View - Device Frame Studio** dicatat secara kronologis di bawah ini.

Format pencatatan mengacu pada standar *Keep a Changelog* dengan prinsip pelaporan berbasis dampak fisik konkret pada sistem hardware dan memori.

---

## [1.15.0] - 2026-09-26

### Ditambahkan (Added)
* **Panel Setelan Taktil di Topbar**: Saklar pengaturan terintegrasi pada bilah atas studio (`#mv-settings-btn`) dengan tombol shortcut keyboard `,` (koma) tanpa mengotori fungsi klik kiri ikon ekstensi browser.
* **Tab Preferensi Bawaan**: Menyimpan preferensi default pengguna secara otomatis ke `localStorage` dan tersinkronisasi lintas-domain via `chrome.storage.local` (Tema default, perangkat default, mode zoom awal, dan orientasi fisik).
* **Tab Tentang & Identitas Ruko**: Profil teknis studio Megapass Intra Solusindo, atribusi arsitek Cak Hizam Nahari (Certified Electronics Technician BNSP/BMY), tautan profil GitHub `@4ntiDandruff`, dan rekam medis versi.
* **Watchdog Auto-Reload Inotify (`dev-watcher.js`)**: Daemon Node.js mandiri hemat resource (RAM ~21MB, 0% CPU standby) pada port 8897 yang memonitor kernel inotify Linux. Terhubung dengan service worker `background.js` untuk me-reload ekstensi dan tab aktif secara otomatis saat berkas kode disimpan (*zero-touch development*).
* **Paket Lengkap Ikon Flat Minimalis**: Regenerasi 11 aset ikon dan favicon resolusi tinggi (16px hingga 512px) berbasis palet Solid Electric Blue (`#0071E3`) dan aksen Electric Cyan (`#64D2FF`) menggunakan mesin C-native `zero-bloat-icon-favicon-skill`.

### Diubah (Changed)
* **Harmonisasi Kapsul Brand Topbar (Zero-Blue Solid Matte)**: Mengganti warna teks, latar, dan border biru/cyan pada kapsul MOBILE VIEW (`.mv-brand`) di mode dark menjadi palet Solid Matte Workstation netral (`#1E2433`, border `#2F384C`, teks `#E2E8F0`), menjadikannya 100% seragam dengan tombol kontrol studio lainnya tanpa pendaran warna yang mengganggu fokus kerja teknisi.
* **Bingkai Smartphone Selalu Aktif (*Always-On*)**: Tombol saklar frame `[F]` di topbar dieliminasi secara permanen, memanfaatkan ruang kosong topbar untuk tombol Pengaturan yang lebih fungsional.
* **Transisi CSS Terisolasi**: Mengganti seluruh sintaks boros `transition: all` menjadi deklarasi properti terarah (`background-color`, `border-color`, `color`, `transform`, `box-shadow`) untuk memangkas siklus repaint GPU.
* **Tipografi & Wrapping Taktil**: Menerapkan `text-wrap: balance` pada judul modal dan `text-wrap: pretty` pada seluruh teks deskripsi untuk mencegah kata menggantung (*orphan words*).
* **Tabular Numbers pada Badge**: Menambahkan `font-variant-numeric: tabular-nums` pada `.mv-log-badge` dan `.mv-dim-pill` guna mengunci kestabilan lebar karakter numerik saat rendering font monospace.

### Diperbaiki (Fixed)
* **Rekursi Stack Overflow `safeSet()`**: Memperbaiki fungsi pembungkus penyimpanan yang sebelumnya memanggil dirinya sendiri secara rekursif hingga batas `Maximum call stack size`, sehingga setelan preferensi kini tersimpan permanen ke media penyimpanan.
* **Tabrakan Saklar Keyboard Global**: Menambahkan sekring penyaring modifier key (`e.ctrlKey || e.metaKey || e.altKey`) agar kombinasi tombol browser `Ctrl+R` (Reload) dan `Ctrl+T` (Buka Tab Baru) tidak memutar layar smartphone atau mengganti tema studio secara liar.
* **Intersepsi Input Teks Kaya**: Menambahkan filter `e.target.isContentEditable` pada listener tombol global agar pengetikan pada editor dokumen web (Notion, Google Docs, Slack) tidak memicu pintasan ekstensi.
* **Pencahayaan Scrim Modal Light Mode**: Menghaluskan lapisan redup backdrop modal tema terang dari sebelumnya hitam pekat `rgba(0,0,0,0.65)` menjadi kabut kristal lembut `rgba(15,23,42,0.32)` dengan efek blur optik 10px.

---

## [1.14.0] - 2026-09-25

### Diubah (Changed)
* **Eliminasi Aksen Biru pada Light Mode**: Menghapus seluruh pendaran warna biru pada tombol dan elemen studio tema terang, mengunci kemurnian palet neomorphic putih monokromatik (`#FFFFFF` dengan border tipis netral `rgba(0,0,0,0.12)`).

### Diperbaiki (Fixed)
* **Harmonisasi Tombol Topbar**: Menyelaraskan kontras teks dan bayangan lembut pada tombol tutup, pemilih perangkat, dan indikator dimensi saat berpindah ke mode terang.

---

## [1.13.1] - 2026-09-24

### Diperbaiki (Fixed)
* **Harmonisasi Tombol Bingkai**: Mengeliminasi residu pendaran biru pada tombol Bingkai aktif di Dark Mode, menyelaraskannya ke palet baku Solid Matte Workstation.

---

## [1.13.0] - 2026-09-24

### Diubah (Changed)
* **Migrasi Solid Matte Workstation**: Merombak tampilan Dark Mode dari efek kaca akrilik berkabut (*smoky glassmorphism*) menjadi lempengan solid matte pekat (`#0F131D` dengan parit `#090C12`). Memangkas beban GPU rendering pada hardware terintegrasi (Intel HD 2500 / Radeon Vega).

---

## [1.12.0] - 2026-09-23

### Diubah (Changed)
* **Kalibrasi Tipografi Proporsional**: Mengadopsi font *Plus Jakarta Sans* untuk elemen antarmuka tombol dan *JetBrains Mono* untuk kapsul dimensi layar presisi (standar kanonikal `cekweb.megapass.web.id`).

---

## [1.11.0] - 2026-09-22

### Diubah (Changed)
* **Pembersihan Efek Glow**: Menghapus seluruh bayangan semu (*ambient glow*) di sekitar sasis fisik smartphone agar tampilan frame menyerupai perangkat fisik asli di meja kerja teknisi.
* **Kompensasi Skala Monitor**: Menyesuaikan kalkulasi zoom adaptif (*Fit to Screen*) dengan memperhitungkan jarak batas bilah topbar setinggi 76px.

---

## [1.0.0] - 2026-09-20

### Ditambahkan (Added)
* **Arsitektur Inti Manifest V3**: Inisialisasi ekstensi Chromium tanpa dependensi bundler atau framework eksternal (*zero build-step*).
* **Katalog Sasis Smartphone Presisi**: Presisi dimensi fisik untuk iPhone 15 Pro, iPhone SE (3rd Gen), Samsung Galaxy S24, dan iPad Mini (6th Gen).
* **Sekring Declarative Net Request**: Pelucutan otomatis header `X-Frame-Options` dan `Content-Security-Policy` subframe pada `rules.json` untuk mencegah layar putih (*frame-busting*) pada localhost maupun web publik.
* **Akses Global Cepat**: Pemicu studio instan via pintasan keyboard `Alt+M` dan menu klik kanan halaman (*context menu*).
