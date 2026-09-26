# Kebijakan Privasi (Privacy Policy)
**Mobile View - Device Frame Studio**
*Terakhir Diperbarui: 26 September 2026*

Kebijakan Privasi ini menjelaskan komitmen perlindungan data dan privasi pengguna ekstensi browser **Mobile View - Device Frame Studio** yang dikembangkan oleh **Megapass Intra Solusindo**.

---

### 1. Prinsip Utama: Nol Pengumpulan Data (Zero-Telemetry)

Ekstensi **Mobile View - Device Frame Studio** dirancang dengan arsitektur sirkuit terbuka yang beroperasi **100% secara lokal dan offline** di dalam browser pengguna:

* **TIDAK Mengumpulkan Data Pribadi**: Ekstensi ini tidak mencatat, mengumpulkan, atau menyimpan nama, email, alamat IP, riwayat penjelajahan (browsing history), atau data identitas apa pun.
* **TIDAK Mengirimkan Data ke Server Eksternal**: Tidak ada server analitik, pelacak (tracking cookies), periklanan (ad network), atau telemetri pihak ketiga yang disematkan dalam ekstensi ini.
* **TIDAK Menjual atau Mentransfer Data**: Karena tidak ada data yang dikumpulkan, tidak ada data apa pun yang dijual, disewakan, atau dibagikan kepada pihak ketiga.

---

### 2. Penggunaan Izin Browser (Permissions Justification)

Ekstensi hanya meminta izin teknis yang mutlak diperlukan untuk menjalankan fungsi utamanya sebagai simulator pratinjau mobile responsif:

1. **`storage`**:
   * Digunakan semata-mata untuk menyimpan preferensi tampilan pengguna (seperti tema gelap/terang, perangkat bawaan, dan orientasi layar) pada media penyimpanan lokal browser (`localStorage` dan `chrome.storage.local`).
2. **`activeTab` & `tabs`**:
   * Digunakan untuk mendeteksi URL halaman yang sedang dibuka saat pengguna secara sengaja menekan tombol pintasan keyboard (`Alt+M`) atau mengklik ikon ekstensi, guna memuat halaman tersebut ke dalam bingkai simulasi smartphone.
3. **`scripting`**:
   * Digunakan untuk menginjeksi antarmuka DOM studio (sasis smartphone dan bilah alat atas) ke dalam halaman web yang sedang aktif diperiksa oleh pengguna.
4. **`declarativeNetRequest`**:
   * Digunakan secara deklaratif untuk menonaktifkan pembatasan header HTTP `X-Frame-Options` dan `Content-Security-Policy: frame-ancestors` pada subframe lokal, sehingga pengembang web dapat mempratinjau dashboard internal atau website tanpa terhalang proteksi *frame-busting*.
5. **`host_permissions` (`<all_urls>`)**:
   * Diperlukan agar pengguna dapat menguji responsivitas tampilan mobile pada domain web apa pun yang sedang mereka kembangkan atau inspeksi. Ekstensi tidak membaca atau memanipulasi konten formulir, kata sandi, atau data sensitif pada domain tersebut.

---

### 3. Keamanan & OPSEC

Kode sumber ekstensi ini sepenuhnya transparan, berarsitektur *zero-bloat*, bebas dari pustaka pihak ketiga yang tidak terverifikasi (*zero npm runtime dependencies*), dan telah melalui audit sanitasi OPSEC ketat sebelum dipublikasikan.

Kode sumber lengkap dapat diaudit secara terbuka pada repositori GitHub resmi:
[https://github.com/4ntiDandruff/mobile-view](https://github.com/4ntiDandruff/mobile-view)

---

### 4. Kontak Pengembang

Jika Anda memiliki pertanyaan mengenai kebijakan privasi atau audit teknis ekstensi ini, silakan hubungi:

* **Pengembang**: Cak Hizam Nahari (Certified Electronics Technician BNSP/BMY)
* **Organisasi**: Megapass Intra Solusindo
* **Lokasi Workshop**: Sidoarjo, Jawa Timur, Indonesia
* **Situs Web**: [https://megapass.web.id](https://megapass.web.id)
* **GitHub**: [https://github.com/4ntiDandruff](https://github.com/4ntiDandruff)
