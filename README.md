# Life Dashboard

Dashboard harian berbasis HTML, CSS, dan JavaScript. Buka `index.html` di browser untuk mencoba. GitHub Pages dapat menyajikan file ini langsung tanpa proses build atau backend.

## Struktur

- `index.html` berisi struktur dashboard dan formulir.
- `css/style.css` mengatur tampilan, tema, dan layout responsif.
- `js/app.js` mengatur sapaan, timer, daftar tugas, tautan, dan Local Storage.
- `.kiro/steering/project.md` berisi kriteria brief untuk digunakan sebagai konteks di Kiro.

## Cek fitur

1. Pastikan hari, tanggal, jam setempat, dan sapaan tampil.
2. Mulai timer 25 menit, jeda, mulai kembali, lalu reset ke 25:00.
3. Tambah dua tugas, edit salah satunya, tandai selesai, lalu muat ulang. Pastikan data dan status selesai bertahan. Hapus tugas yang sudah tidak diperlukan.
4. Coba masukkan dua tugas yang hanya berbeda huruf besar/kecil atau spasi. Coba juga mengedit satu tugas menjadi nama tugas lain. Keduanya harus ditolak.
5. Tambah tautan favorit, muat ulang, lalu buka tautannya. Pastikan alamat yang tidak valid ditolak.
6. Ubah nama sapaan dan aktifkan mode gelap. Pastikan kedua pengaturan bertahan setelah halaman dimuat ulang.
7. Ulangi cek di browser modern yang tersedia dan coba ukuran layar ponsel.

## GitHub dan GitHub Pages

1. Konfirmasi tanggal hari pertama batch dan nama peserta. Gunakan format `CodingCamp-[tanggal-batch]-[namapeserta]`. Brief mencontohkan bulan ditulis lengkap dalam bahasa Inggris dan tahun dua digit. Jika tanggalnya 16 November 2026 dan nama pendaftarannya Ahmad Farhan, gunakan `CodingCamp-16November26-ahmadfarhan`.
2. Di akun GitHub pribadi, buat repositori **Public** dengan nama yang sudah dikonfirmasi. Di GitHub Desktop, pilih **File → Clone repository** dan clone repositori itu.
3. Salin isi folder proyek ke folder hasil clone, termasuk `.kiro`. Buka folder hasil clone di Kiro dan gunakan panduan proyek untuk memeriksa kriteria brief.
4. Di GitHub Desktop, pastikan perubahan mencakup `index.html`, `css/style.css`, `js/app.js`, dan `.kiro/steering/project.md`. Buat commit dengan ringkasan `Build Life Dashboard`, lalu klik **Publish branch** atau **Push origin**.
5. Di GitHub, buka **Settings → Pages → Deploy from a branch**. Pilih branch yang berisi commit, biasanya `main`, dan folder `/(root)`. Klik **Save** dan tunggu deployment berhasil di tab **Actions**.
6. Salin tautan dari **Settings → Pages**. Buka tautan repo dan tautan Pages di jendela privat untuk memastikan penilai bisa membuka keduanya. Coba satu tugas dan muat ulang halaman Pages untuk mengecek penyimpanan.

## Pengumpulan

Siapkan nama lengkap sesuai pendaftaran (tanpa gelar atau tanda baca), email pendaftaran, AWS Builder ID yang digunakan di Kiro, URL repositori GitHub, dan URL website GitHub Pages. Isi sesuai label yang muncul di Paperform dan periksa ulang kedua URL sebelum mengirim.

Brief dan Paperform menuliskan jam tenggat dengan format berbeda. Konfirmasi jam pastinya dari pengumuman resmi batch.

- [Brief RevoU](https://rebrand.ly/brief-miniproject)
- [Tutorial GitHub dan pengumpulan](https://revou.id/Tutorial-Miniproject)
- [Formulir pengumpulan](https://revou.id/FCSWE-miniproject)
