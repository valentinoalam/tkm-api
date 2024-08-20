# Aplikasi Tata Kelola Masjid

Tujuan dibuatnya Aplikasi Web Sistem Tata Kelola Masjid dan Website Pelayanan Masjid adalah untuk meningkatkan efisiensi pengelolaan melalui pengaturan inventaris, keuangan, kegiatan, zakat, qurban, dan aktivitas lainnya secara terstruktur dan transparan. Dengan menyediakan laporan yang jelas dan dapat diakses oleh jamaah, aplikasi ini meningkatkan transparansi dan akuntabilitas, serta memudahkan akses informasi seperti jadwal ceramah, kegiatan rutin, dan fasilitas masjid. Selain itu, aplikasi ini mempermudah jamaah dalam melakukan pendaftaran itiqaf, pembayaran zakat, pendaftaran qurban, dan konsultasi zakat secara online, sehingga pelayanan menjadi lebih cepat dan efisien. Aplikasi ini juga memungkinkan penyimpanan dan akses mudah terhadap dokumentasi kegiatan, laporan, dan arsip penting lainnya, serta mendorong interaksi yang lebih baik antara pengurus masjid dan jamaah, meningkatkan partisipasi aktif jamaah dalam kegiatan dan program masjid.

## Usecase

1. Pencatatan Pemasukan

    - Pencatatan semua sumber pemasukan kas masjid seperti sumbangan, donasi, dan dana lainnya dari muzakki.

2. Pencatatan Pengeluaran

    - Pencatatan semua pengeluaran yang dilakukan oleh masjid seperti biaya operasional, pembayaran gaji staf, dan pengeluaran lainnya.

3. Pelaporan Keuangan

    - Membuat laporan keuangan reguler yang mencakup ringkasan pemasukan dan pengeluaran kas masjid.
    - Laporan bulanan, tahunan, dan laporan khusus lainnya sesuai kebutuhan.

4. Perencanaan Anggaran

    - Perencanaan dan pengawasan terhadap anggaran kas masjid untuk pengeluaran dan proyek-proyek tertentu.

5. Pengelolaan Kas Kecil

    - Pengelolaan kas kecil untuk kebutuhan sehari-hari masjid seperti pembelian kecil atau biaya operasional harian.

6. Manajemen Zakat dan Sedekah

    - Pengelolaan zakat dan sedekah yang diterima dan dikelola oleh masjid untuk diberikan kepada mustahik.

7. Audit Keuangan

    - Proses audit rutin untuk memastikan keakuratan pencatatan dan transparansi dalam pengelolaan keuangan masjid.

8. Pelacakan Sumber Dana

    - Pelacakan sumber dana yang digunakan untuk pengeluaran tertentu untuk memastikan dana digunakan sesuai dengan ketentuan yang berlaku

9. Pemantauan dan Evaluasi
    - Pemantauan secara berkala terhadap kondisi keuangan masjid dan evaluasi terhadap efektivitas pengelolaan dana dan penggunaan kas.

10. Pembatasan Akses Informasi Keuangan

## 1. User Management Service

**Fungsi:**

- Autentikasi dan otorisasi pengguna
- Pendaftaran dan manajemen profil pengguna (administrator masjid, imam, jamaah)

**Endpoint:**

- `POST /register`
- `POST /login`
- `GET /profile/{userId}`
- `PUT /profile/{userId}`

## 2. Prayer Schedule Service

**Fungsi:**

- Manajemen jadwal sholat
- Penentuan waktu sholat berdasarkan lokasi masjid

**Endpoint:**

- `GET /prayerschedule/{mosqueId}`
- `POST /prayerschedule`
- `PUT /prayerschedule/{scheduleId}`

## 3. Event Management Service

**Fungsi:**

- Penjadwalan dan manajemen acara (pengajian, ceramah, kegiatan sosial)
- Notifikasi acara kepada jamaah

**Endpoint:**

- `GET /events/{mosqueId}`
- `POST /events`
- `PUT /events/{eventId}`
- `DELETE /events/{eventId}`

## 4. Financial Management Service

**Fungsi:**

- Pencatatan pemasukan dan pengeluaran masjid
- Manajemen donasi dan zakat

**Endpoint:**

- `GET /finances/{mosqueId}`
- `POST /donations`
- `POST /expenses`
- `GET /reports/{mosqueId}`

## 5. Notification Service

**Fungsi:**

- Pengiriman notifikasi ke pengguna (SMS, Email, Push Notifications)

**Endpoint:**

- `POST /notifications`

## 6. Volunteer Management Service

**Fungsi:**

- Manajemen relawan untuk berbagai kegiatan masjid

**Endpoint:**

- `GET /volunteers/{mosqueId}`
- `POST /volunteers`
- `PUT /volunteers/{volunteerId}`
- `DELETE /volunteers/{volunteerId}`

## 7. Content Management Service

**Fungsi:**

- Manajemen konten dakwah (artikel, video, audio)

**Endpoint:**

- `GET /content/{mosqueId}`
- `POST /content`
- `PUT /content/{contentId}`
- `DELETE /content/{contentId}`

## 8. Feedback and Suggestion Service

**Fungsi:**

- Pengumpulan dan manajemen saran serta feedback dari jamaah

**Endpoint:**

- `POST /feedback`
- `GET /feedback/{mosqueId}`

## 9. Maintenance Service

**Fungsi:**

- Manajemen pemeliharaan dan perbaikan fasilitas masjid

**Endpoint:**

- `GET /maintenance/{mosqueId}`
- `POST /maintenance`
- `PUT /maintenance/{maintenanceId}`
- `DELETE /maintenance/{maintenanceId}`

## 10. Analytics Service

**Fungsi:**

- Analisis data aktivitas masjid (kehadiran sholat, kehadiran acara, jumlah donasi)

**Endpoint:**

- `GET /analytics/{mosqueId}`