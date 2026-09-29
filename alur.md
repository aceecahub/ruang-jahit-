# Alur Dashboard Owner — Konveksi

Dokumen ini menjelaskan **bagaimana dashboard bekerja** (alur data & navigasi) dan **apa isi setiap menu**.

---

## 1. Konsep Besar

Dashboard ini **bukan multi-halaman**. Semua menu (Ringkasan Bisnis, Penjualan, Produksi, dll.) adalah **satu halaman Inertia** (`/dashboard`) yang dipecah menjadi **8 tab**.

Yang membedakan antar-menu hanyalah **state `activeTab`** di dalam `useDashboardTab.ts`. Ganti tab ≠ pindah halaman, hanya ganti komponen yang dirender.

```
Login ──▶ /dashboard (Dashboard.vue)
              │
              ├─ Sidebar (desktop) : "Dashboard" ▸ sub-menu 8 tab
              ├─ Bottom Nav (mobile): 8 tab horizontal
              └─ Tombol navigate di OverviewView (lintas menu)
                        │
                        ▼
                 activeTab (state global)
                        │
        ┌───────────────┼───────────────┐ ... (8 view)
        ▼               ▼               ▼
  OverviewView    SalesView      ProductionView  ... dst
        │               │               │
        └───────────────┴───────────────┘
                        │
             filter global (FilterBar) + data statis (*Data.ts)
```

### State utama: `useDashboardTab.ts`

| Bagian | Isi |
|---|---|
| `DASHBOARD_TABS` | Daftar tunggal 8 tab (`key`, `title`, `icon`, `href`) — **sumber kebenaran** untuk sidebar, mobile nav, dan judul halaman |
| `activeTabState` | `ref` modul-level → **shared**, semua komponen melihat tab aktif yang sama tanpa prop drilling |
| `initTabFromUrl()` | Dipanggil `onMounted` → baca `?tab=` dari URL, validasi, set state |
| `switchTab(key)` | Validasi key → update state → sinkronkan URL |

**Perilaku `switchTab` (penting):**
- Kalau sudah di `/dashboard` → `history.replaceState` (ganti query param, **tanpa reload**, state tetap hidup).
- Kalau dari halaman lain → `router.visit('/dashboard?tab=...')` (Inertia navigate, halaman memang ter-render ulang).

---

## 2. Cara Pindah Menu (3 pintu)

| Pintu | Lokasi | Perilaku |
|---|---|---|
| **Sidebar sub-menu** | `AppSidebar.vue` → `NavMain.vue` | `Collapsible` "Dashboard" default terbuka. Klik sub-item → `switchTab(subItem.key)`. Tiap sub-item punya `key` = `DashboardTabKey`. |
| **Mobile bottom nav** | `MobileBottomNav.vue` | Render `tabs` (dari `DASHBOARD_TABS`) sebagai strip scroll horizontal, `md:hidden`. |
| **Tombol navigate** | `OverviewView.vue` | Emit `navigate(tabKey)` → `Dashboard.vue` menangkap `@navigate="switchTab"`. Contoh: "Rincian Keuangan" → `finance`, "Lihat Alur Kerja Produksi" → `production`, "Analitik Kualitas & QC" → `quality`. |

> Konsekuensi: **hanya OverviewView yang bisa menavigasi ke menu lain.** 7 view lainnya stateless (tidak emit apa pun).

### Penetapan menu aktif
Sidebar menandai aktif bila **dua syarat sama-sama terpenuhi**: `activeTab === subItem.key` **dan** `isCurrentUrl(item.href)` (`useCurrentUrl`). Jadi saat di `/dashboard?tab=sales`, yang ter-highlight adalah "Penjualan", bukan "Dashboard".

---

## 3. Kerangka Halaman (semua menu memakai ini)

`Dashboard.vue` menyediakan 4 lapisan yang selalu sama, apa pun tab-nya:

1. **Header** — judul dinamis (`currentTabTitle` dari `activeTab`) + tombol **Order Baru** (buka modal) + label periode.
2. **FilterBar** — kontrol global (lihat §4).
3. **`<main>`** — `v-if / v-else-if` chain, tepat **1 view** yang ter-render.
4. **Modal Order Baru** — simulasi frontend: nama pelanggan, jenis item, jumlah pcs, tenggat → toast sukses.

**Props yang dialirkan dari parent ke view (berlaku untuk semua menu):**

| View | `isDark` | `period` | `searchQuery` | `category` | `status` | `@navigate` |
|---|---|:-:|:-:|:-:|:-:|:-:|
| Overview | ✅ | ✅ | – | – | – | ✅ |
| Penjualan | ✅ | – | ✅ | ✅ *(belum dipakai)* | – | – |
| Produksi | ✅ | – | ✅ | ✅ | ✅ | – |
| Keuangan | ✅ | – | ✅ | – | – | – |
| Inventaris | ✅ | – | ✅ | ✅ | ✅ | – |
| Pelanggan | ✅ | – | ✅ | – | – | – |
| Karyawan | ✅ | – | ✅ | – | – | – |
| Kualitas | ✅ | – | ✅ | – | – | – |

> Pola: **semua view menerima `isDark`** (dukungan light/dark) dan **`searchQuery`** (pencarian global selalu aktif di semua menu).

---

## 4. Filter Global (`FilterBar.vue`)

Berpisah dari tab — berada di atas, berlaku lintas menu.

- **Periode**: Harian / Mingguan / Bulanan / Tahunan → dikirim ke `OverviewView`, di sana dikalikan `periodMultiplier` (0.04 / 0.25 / 1.0 / 12.0) untuk menskalakan KPI.
- **Pencarian**: input teks → diteruskan ke **semua** view lewat `searchQuery`.
- **Filter kategori**: hanya tampil di tab `overview`, `sales`, `production`, `inventory`.
- **Filter status**: hanya tampil di tab `overview`, `production`, `inventory`.
- **Reset** (`RotateCcw`) dan **Export** (emit → toast sukses).

Tipe: `FilterState = { period, category, status, searchQuery }`, dikirim dua arah lewat `v-model`.

---

## 5. Isi Tiap Menu

Semua view memakai 2 komponen bantu: **`KpiCard.vue`** (label + ikon + tooltip + nilai + badge perubahan %) dan data mock dari `resources/js/data/*.ts`.

### 5.1 Ringkasan Bisnis — `overview`
*Titik masuk default. Ringkasan lintas seluruh bidang usaha — semua angka penting dalam 1 layar.*

| Bagian | Isi |
|---|---|
| 8 KPI | Total Pendapatan, Laba Bersih, Pesanan Aktif, Pesanan Selesai, Piutang Pelanggan, Saldo Kas, Penyelesaian Produksi (%), Pesanan Terlambat |
| **Chart Line** | Tren Pendapatan vs Laba Bersih (dataset biru filled + hijau dashed), time Mingguan/Bulanan/Tahunan |
| Status Pesanan | Distribusi 7 status (jumlah order & pcs) |
| Capaian Produksi | Progress bar 5.480/6.000 pcs + 3 pill: Lolos QC, <3 Hari Tenggat, Terlambat |
| Notifikasi | 5 alert operasional (terlambat, stok kritis, piutang) |
| **Aksi** | 3 tombol navigate: `finance`, `production`, `quality` |

### 5.2 Penjualan — `sales`
*Menerjemahkan "uang masuk dari pasar" — dari mana, dibanding periode lalu, dan ke siapa.*

| Bagian | Isi |
|---|---|
| 4 KPI | Total Pendapatan, Jumlah Pesanan (5.840 pcs), Rata-rata Nilai Pesanan (AOV), Pesanan Dibatalkan |
| **Chart Line** | Tren penjualan: Periode Berjalan vs Periode Sebelumnya (garis putus-putus) |
| **Chart Doughnut** | Komposisi pendapatan per kategori (Kemeja, Kaos Polo, Wearpack, Jersey, Gamis) |
| Tabel | Pendapatan per Pelanggan Teratas: Pelanggan, Segmen, Jumlah Order, Total Pembelian, Order Terakhir, Status Bayar |

### 5.3 Produksi — `production`
*"Pabrik": urutan kerja dari bahan mentah sampai barang jadi.*

| Bagian | Isi |
|---|---|
| Pipeline 6 tahap | Potong → Jahit → Obras → Finishing → Uji QC → Pengiriman (kartu + progress bar kuota harian, deteksi bottleneck) |
| 4 KPI | Hasil Produksi, Pesanan Sedang Dikerjakan, Lead Time, Produk Cacat & Rework |
| Tabel | Progres Pesanan: Nomor & Pelanggan, Produk, Target, Selesai, % Progres, Tenggat, Status |

### 5.4 Keuangan — `finance`
*Pertanyaan "kondisi uang": berapa masuk, berapa keluar, dan berapa untung.*

| Bagian | Isi |
|---|---|
| 6 KPI | Omzet, Laba Kotor, Laba Bersih, Saldo Kas, Piutang Pelanggan, Utang Supplier |
| **Chart Bar** | Pendapatan vs Pengeluaran per bulan |
| **Chart Doughnut** | Struktur biaya & HPP: Kain, Upah Jahit, Benang/Kancing, Listrik, Sewa, Packaging |
| Tabel | Analisis Keuntungan per Pesanan: Pendapatan, Biaya Bahan, Upah, Laba, Margin % |

### 5.5 Inventaris & Bahan — `inventory`
*"Bahan baku": apakah stok cukup untuk produksi?*

| Bagian | Isi |
|---|---|
| 4 KPI | Nilai Aset Persediaan, Stok Kain Tersedia, Bahan Kritis, Scrap Rate |
| Tabel 1 | Inventaris: Nama & SKU, Kategori, Stok, Stok Minimum, Nilai, Status (Aman/Menipis/Habis) |
| Tabel 2 | Riwayat Pengadaan (PO): Nomor PO, Tanggal, Supplier, Item, Biaya, Status Penerimaan |
| Aksi | Tombol "Tambah Bahan" (belum di-wire ke handler) |

### 5.6 Pelanggan — `customers`
*Siapa pelanggan, seberapa setia, dan siapa yang masih utang.*

| Bagian | Isi |
|---|---|
| 4 KPI | Total Pelanggan, Tingkat Pemesanan Ulang, Pelanggan Aktif, Klien Berpiutang |
| Segmentasi | 4 kartu segmen (jumlah, %, pendapatan) |
| Tabel | Daftar Pelanggan: Instansi, Kontak PIC, Total Order, Total Transaksi, Sisa Piutang, Status |

### 5.7 Produktivitas Karyawan — `employees`
*"Manusia": siapa yang paling produktif, dan siapa yang perlu perhatian.*

| Bagian | Isi |
|---|---|
| 4 KPI | Karyawan Aktif, Tingkat Kehadiran, Jam Lembur, Output Harian/ Penjahit |
| Departemen | 5 kartu efisiensi output (Cutting, Sewing, Obras, Finishing, QC) |
| Tabel | Leaderboard: Nama & NIP, Peran, Presensi, Output/Target, Lembur, Cacat, Rating |

### 5.8 Kualitas & Pengiriman — `quality`
*"Akhir jalan": apakah barang bermutu dan sampai tepat waktu?*

| Bagian | Isi |
|---|---|
| 4 KPI | Lolos QC, Defect Rate, Ketepatan Waktu Kirim, Pesanan Siap Kirim |
| QC Breakdown | 5 jenis cacat tersering + bar persentase + tingkat keparahan |
| Rework vs Scrap | 2 panel: pcs berhasil di-rework vs kain discard (rusak, tidak bisa dipakai) |
| Tabel | Status Pengiriman: Resi & Order, Pelanggan, Barang, Kurir, Tgl Kirim, Status (+ hari keterlambatan) |

---

## 6. Struktur File

```
resources/js/
├── pages/Dashboard.vue              ← orchestrator: header, filter, v-if view, modal
├── composables/useDashboardTab.ts   ← state global tab + DASHBOARD_TABS
├── components/
│   ├── AppSidebar.vue               ← menu sidebar, isi dari DASHBOARD_TABS
│   ├── NavMain.vue                  ← render collapsible + sub-menu
│   ├── MobileBottomNav.vue          ← 8 tab untuk mobile
│   └── dashboard/
│       ├── FilterBar.vue            ← filter global (+ export FilterState)
│       ├── KpiCard.vue              ← kartu KPI reusable
│       ├── OverviewView.vue    SalesView.vue    ProductionView.vue
│       ├── FinanceView.vue     InventoryView.vue CustomerView.vue
│       └── EmployeeView.vue    QualityDeliveryView.vue
├── data/                            ← data mock per domain (*Data.ts)
└── types/navigation.ts              ← NavItem / NavSubItem (+ key untuk tab)
```

**Aliran data:** `data/*.ts` → `*View.vue` (computed/filter lokal) → `Dashboard.vue` (satu view aktif) → `AppShell` → sidebar/mobile nav.

---

## 7. Integrasi Backend (Langkah Selanjutnya)

Sekarang semua data masih mock di `data/*.ts`. Titik sambungnya sudah disiapkan:

- `routes/web.php`: `Route::inertia('dashboard', 'Dashboard')` — belum mengirim props.
- `Dashboard.vue:37-41` sudah menerima props opsional `initialTab`, `customKpis`, `customOrders`.
- `onMounted` sudah memprioritaskan `props.initialTab` lewat `switchTab()`.
- `handleExport` tinggal diubah dari toast → request download.

Langkah: buat `DashboardController`, kirim props berisi data per tab, lalu ganti `import { initialXData }` di tiap view dengan `props`.
