# Catatan Servis & Rekam Medis (Changelog)

Seluruh perubahan teknis, rekam perbaikan sirkuit, dan evolusi arsitektur pada proyek **Mobile View - Device Frame Studio** dicatat secara kronologis di bawah ini.

Format pencatatan mengacu pada standar *Keep a Changelog* dengan prinsip pelaporan berbasis dampak fisik konkret pada sistem hardware, memori, dan geometri tampilan.

---

## [1.15.1] - 2026-09-26

### Diperbaiki (Fixed)
* **Sekring Fatal Crash `ReferenceError: totalW is not defined`**: Memulihkan variabel pembacaan HUD dimensi di `content.js` ke `${screenW} × ${screenH} px` sehingga inisialisasi overlay studio dan listener resize jendela berjalan mulus tanpa menghentikan eksekusi script.
* **Kalibrasi Fit-Scale Viewport Jendela Non-Fullscreen**: Mengkalkulasi ulang ruang vertikal aman `calculateFitScale` (`availH = window.innerHeight - 96` dan `availW = window.innerWidth - 32`) dengan batas aman bawah 80px, memastikan sasis fisik smartphone tidak lagi terpotong atau menyentuh tepian layar saat browser berada dalam mode windowed atau resolusi layar laptop kecil.
* **Pencegahan Pemotongan Bilah Atas (*Topbar Overflow Safety*)**: Mengamankan bilah atas `#mv-topbar` dengan `overflow-x: auto`, `flex-shrink: 0`, dan `scrollbar-width: none`. Tombol tetap utuh 100% dan dapat diakses pada layar sempit/split-screen hingga lebar 500px tanpa merusak posisi canvas studio.
* **Media Query Adaptif Bilah Kontrol**: Menyembunyikan label teks merek pada lebar <= 1080px dan label teks tombol aksi (Putar, Setelan, Tutup) pada lebar <= 960px dengan tetap mempertahankan ikon SVG Lucide dan lencana keyboard, menghemat ruang horizontal lebih dari 180px di jendela browser sempit.
* **Kanvas Bebas Terpotong pada Zoom 100%**: Mengubah perilaku area `#mv-canvas` dari `overflow: hidden` menjadi `overflow: auto` dengan styling scrollbar tipis netral. Pengguna dapat menggulir kanvas secara ergonomis saat memeriksa tampilan 100% pada layar monitor non-fullscreen.
* **Debouncing Halus Resize Jendela (60 FPS)**: Membungkus pendengar event `resize` pada `content.js` dan `preview.js` dengan `requestAnimationFrame` untuk mengeliminasi pemborosan repaint GPU dan layout thrashing saat jendela browser diubah ukurannya secara dinamis.
* **Kueri Tab Multi-Window Fail-Safe di Background Worker**: Memperbarui listener `chrome.commands` pada `background.js` dengan rantai pencarian tab bertingkat (`currentWindow` → `lastFocusedWindow` → active tab) agar pintasan keyboard `Alt+M` selalu tereksekusi meskipun fokus jendela browser sempat berpindah ke jendela lain.

---

## [1.15.0] - 2026-09-26

### Ditambahkan (Added)
* **Kalibrasi Layar 1:1 Presisi Piksel**: Mengkalkulasi ulang lebar sasis luar `frameW = screenW + (2 * bezel)` sehingga area layar dalam (`.mv-screen-container` dan `#mv-viewport-iframe`) mengunci dimensi hardware murni tanpa kehilangan piksel (iPhone 15 Pro persis 393×852 px, Galaxy S24 persis 360×780 px, SE persis 375×667 px, iPad Mini persis 768×1024 px).
* **Keselarasan Garis Horizontal Topbar (Uniform 30px)**: Menyeragamkan seluruh kapsul merek, segmented groove, dan tombol workstation ke ketinggian presisi 30px (selisih vertikal 0.0px lintas-elemen), merapikan tombol reload menjadi bujur sangkar simetris 30×30 px, dan menetralkan titik suar dimensi ke palet slate bebas warna biru.
* **Konsentrisitas Radius Sasis Smartphone**: Menerapkan formula radius konsentris matematis $R_{outer} = R_{inner} + \text{bezel}$ pada sasis fisik dan layar dalam sehingga lengkungan bingkai luar sejajar presisi dengan kurva kaca layar.
* **Panel Setelan Taktil di Topbar**: Menambahkan tombol saklar pengaturan terintegrasi pada bilah atas studio (`#mv-settings-btn`) dengan tombol pintasan keyboard `,` (koma) tanpa mengotori fungsi klik kiri ikon ekstensi browser.
* **Tab Preferensi Bawaan**: Menyimpan preferensi default pengguna secara otomatis ke `localStorage` dan tersinkronisasi lintas-domain via `chrome.storage.local` (Tema default, perangkat default, mode zoom awal, dan orientasi fisik).
* **Tab Tentang & Identitas Ruko**: Profil teknis studio Megapass Intra Solusindo, atribusi arsitek Cak Hizam Nahari (Certified Electronics Technician BNSP/BMY), tautan profil GitHub `@4ntiDandruff`, dan rekam medis versi.
* **Watchdog Auto-Reload Inotify (`dev-watcher.js`)**: Daemon Node.js mandiri hemat resource (RAM ~21MB, 0% CPU standby) pada port 8897 yang memonitor kernel inotify Linux. Terhubung dengan service worker `background.js` untuk me-reload ekstensi dan tab aktif secara otomatis saat berkas kode disimpan (*zero-touch development*).
* **Paket Lengkap Ikon Flat Minimalis**: Regenerasi 11 aset ikon dan favicon resolusi tinggi (16px hingga 512px) berbasis palet Solid Electric Blue (`#0071E3`) dan aksen Electric Cyan (`#64D2FF`) menggunakan mesin C-native `zero-bloat-icon-favicon-skill`.
* **Dokumen Kebijakan Privasi Resmi (`PRIVACY.md`)**: Komitmen perlindungan data 100% offline, zero-telemetry, bebas pelacak pihak ketiga, dan justifikasi teknis seluruh izin Manifest V3.
* **Distribusi Mandiri GitHub Releases**: Penerbitan paket rilis resmi di GitHub Releases tanpa perantara berbayar Chrome Web Store ($5) dan tanpa masa tunggu tinjauan Google.

### Diubah (Changed)
* **Harmonisasi Kapsul Brand Topbar (Zero-Blue Solid Matte)**: Mengganti warna teks, latar, dan border biru/cyan pada kapsul MOBILE VIEW (`.mv-brand`) di mode dark menjadi palet Solid Matte Workstation netral (`#1E2433`, border `#2F384C`, teks `#E2E8F0`), menjadikannya 100% seragam dengan tombol kontrol studio lainnya tanpa pendaran warna yang mengganggu fokus kerja teknisi.
* **Bingkai Smartphone Selalu Aktif (*Always-On*)**: Tombol saklar frame `[F]` di topbar dieliminasi secara permanen, memanfaatkan ruang kosong topbar untuk tombol Pengaturan yang lebih fungsional.
* **Transisi CSS Terisolasi**: Mengganti seluruh sintaks boros `transition: all` menjadi deklarasi properti terarah (`background-color`, `border-color`, `color`, `transform`, `box-shadow`) untuk memangkas siklus repaint GPU.
* **Tipografi & Wrapping Taktil**: Menerapkan `text-wrap: balance` pada judul modal dan `text-wrap: pretty` pada seluruh teks deskripsi untuk mencegah kata menggantung (*orphan words*).
* **Tabular Numbers pada Badge**: Menambahkan `font-variant-numeric: tabular-nums` pada `.mv-log-badge` dan `.mv-dim-pill` guna mengunci kestabilan lebar karakter numerik saat rendering font monospace.

### Diperbaiki (Fixed)
* **Penciutan Dimensi Layar Viewport**: Menghilangkan efek kompresi resolusi akibat `box-sizing: border-box` yang sebelumnya memangkas lebar viewport hingga 12px lebih sempit dari spesifikasi fisik asli.
* **Rekursi Stack Overflow `safeSet()`**: Memperbaiki fungsi pembungkus penyimpanan yang sebelumnya memanggil dirinya sendiri secara rekursif hingga batas `Maximum call stack size`, sehingga setelan preferensi kini tersimpan permanen ke media penyimpanan.
* **Tabrakan Saklar Keyboard Global**: Menambahkan sekring penyaring modifier key (`e.ctrlKey || e.metaKey || e.altKey`) agar kombinasi tombol browser `Ctrl+R` (Reload) dan `Ctrl+T` (Buka Tab Baru) tidak memutar layar smartphone atau mengganti tema studio secara liar.
* **Intersepsi Input Teks Kaya**: Menambahkan filter `e.target.isContentEditable` pada listener tombol global agar pengetikan pada editor dokumen web (Notion, Google Docs, Slack) tidak memicu pintasan ekstensi.
* **Pencahayaan Scrim Modal Light Mode**: Menghaluskan lapisan redup backdrop modal tema terang dari sebelumnya hitam pekat `rgba(0,0,0,0.65)` menjadi kabut kristal lembut `rgba(15,23,42,0.32)` dengan efek blur optik 10px.
* **Rotasi Tombol Hardware Sasis**: Menyesuaikan koordinat tombol fisik volume dan power sasis smartphone di `content.js` agar berpindah otomatis ke tepian horizontal saat diputar ke mode landscape.

---

## [1.14.0] - 2026-09-25

### Diubah (Changed)
* **Eliminasi Aksen Biru pada Light Mode**: Menghapus seluruh pendaran warna biru pada tombol dan elemen studio tema terang, mengunci kemurnian palet neomorphic putih monokromatik (`#FFFFFF` dengan border tipis netral `rgba(0,0,0,0.12)`).

---

## [1.13.1] - 2026-09-25

### Diubah (Changed)
* **Harmonisasi Tombol Bingkai Workstation**: Menghilangkan aksen biru pada saklar bingkai smartphone di topbar studio, menggantinya dengan palet Solid Matte Slate yang serasi dengan tombol kontrol workstation lainnya.

---

## [1.13.0] - 2026-09-24

### Ditambahkan (Added)
* **Arsitektur Solid Matte Workstation**: Merombak antarmuka studio tema gelap dari efek kaca mika akrilik (*frosted glass*) ke palet solid slate gelap tahan panas (`#0F131D`), memangkas beban kalkulasi shader GPU secara signifikan pada laptop berspesifikasi ruko.

---

## [1.12.0] - 2026-09-23

### Diubah (Changed)
* **Penyelarasan Tipografi Modern**: Mengintegrasikan font Plus Jakarta Sans untuk teks antarmuka dan JetBrains Mono untuk metrik dimensi layar, mengacu pada standar visual bersih `cekweb.megapass.web.id`.

---

## [1.11.0] - 2026-09-22

### Dihapus (Removed)
* **Pendaran Glow Diffuse Backlight**: Mematikan efek cahaya pendar di belakang sasis smartphone (`.mv-ambient-glow`) guna mencegah distorsi kontras warna saat melakukan inspeksi desain web.

---

## [1.10.0] - 2026-09-21

### Ditambahkan (Added)
* **Integrasi Declarative Net Request**: Menambahkan aturan deklaratif `rules.json` untuk menanggalkan pembatasan header HTTP `X-Frame-Options` dan `CSP frame-ancestors` pada iframe subframe secara lokal.

---

## [1.0.0] - 2026-09-20

### Ditambahkan (Added)
* **Inisialisasi Proyek Mobile View Studio**: Ekstensi browser berbasis Manifest V3 dengan injeksi DOM overlay sasis smartphone sekali klik via pintasan keyboard `Alt + M`.
