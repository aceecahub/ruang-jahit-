/**
 * Order Analytics Data & Processing Utilities - Convection & Tailoring Business
 * Schema fields: IdToko, id_order, no_order, tgl_order, no_po, no_rutin, kd_cus, nm_cus,
 * alamat, tlp, jenis_order, status, jml_hari, tgl_estimasi, Delete, DateDel, UserDel,
 * DateEdit, DateAdd, UserAdd, total_qty, tot_hpp, total_jual
 */

export interface OrderRecord {
    IdToko: number;
    id_order: number;
    no_order: string;
    tgl_order: string; // YYYY-MM-DD
    no_po: string;
    no_rutin: string;
    kd_cus: string;
    nm_cus: string;
    alamat: string;
    tlp: string;
    jenis_order: string;
    status: number | string;
    jml_hari: number;
    tgl_estimasi: string; // YYYY-MM-DD
    Delete: boolean;
    DateDel: string | null;
    UserDel: string | null;
    DateEdit: string | null;
    DateAdd: string;
    UserAdd: string;
    total_qty: number;
    tot_hpp: number;
    total_jual: number;
}

export interface OrderStatusMeta {
    code: number | string;
    label: string;
    category: 'waiting' | 'active' | 'completed' | 'cancelled';
    color: string;
    badgeClass: string;
}

export const ORDER_STATUS_MAP: Record<string, OrderStatusMeta> = {
    '0': { code: 0, label: 'Menunggu Konfirmasi', category: 'waiting', color: '#64748b', badgeClass: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' },
    '1': { code: 1, label: 'Antrean Potong', category: 'active', color: '#6366f1', badgeClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50' },
    '2': { code: 2, label: 'Proses Jahit', category: 'active', color: '#2563eb', badgeClass: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50' },
    '3': { code: 3, label: 'Finishing & QC', category: 'active', color: '#f59e0b', badgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50' },
    '4': { code: 4, label: 'Selesai & Siap Kirim', category: 'completed', color: '#10b981', badgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50' },
    '5': { code: 5, label: 'Dibatalkan', category: 'cancelled', color: '#ef4444', badgeClass: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50' },
};

export const ORDER_TYPE_LABELS = [
    'Kemeja & Seragam Kantor',
    'Kaos Polo & Lacoste',
    'Jaket, Parka & Rompi',
    'Gamis & Busana Muslim',
    'Wearpack & Praktik',
    'Celana & Rok Formal',
];

export const TODAY_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Jakarta',
}).format(new Date());

// 60+ Realistic Convection Orders Dataset
export const DUMMY_ORDERS_DATA: OrderRecord[] = [
    // --- HARI INI: 2026-09-29 ---
    {
        IdToko: 1, id_order: 101, no_order: 'ORD-2026-0929-01', tgl_order: '2026-09-29', no_po: 'PO-SML-0929', no_rutin: 'RUT-01',
        kd_cus: 'CUS-001', nm_cus: 'PT Samudera Logistik Jaya', alamat: 'Kawasan Industri Pulogadung Blok B No. 4, Jakarta Timur', tlp: '0812-8899-7711',
        jenis_order: 'Kemeja & Seragam Kantor', status: 0, jml_hari: 7, tgl_estimasi: '2026-10-06',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-29 09:15:00', UserAdd: 'Admin Kasir',
        total_qty: 120, tot_hpp: 7800000, total_jual: 12600000,
    },
    {
        IdToko: 1, id_order: 102, no_order: 'ORD-2026-0929-02', tgl_order: '2026-09-29', no_po: 'PO-SMK-0929', no_rutin: 'RUT-02',
        kd_cus: 'CUS-002', nm_cus: 'Yayasan Bina Prestasi (SMK 1)', alamat: 'Jl. Pemuda No. 45, Rawamangun, Jakarta Timur', tlp: '0813-1122-3344',
        jenis_order: 'Wearpack & Praktik', status: 1, jml_hari: 10, tgl_estimasi: '2026-10-09',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-29 10:30:00', UserAdd: 'Admin Kasir',
        total_qty: 85, tot_hpp: 6375000, total_jual: 9775000,
    },
    {
        IdToko: 1, id_order: 103, no_order: 'ORD-2026-0929-03', tgl_order: '2026-09-29', no_po: 'PO-BOU-0929', no_rutin: 'RUT-03',
        kd_cus: 'CUS-004', nm_cus: 'Boutique Siti Rahayu', alamat: 'Pasar Tanah Abang Blok A Lt. 2 Los E No. 12, Jakarta Pusat', tlp: '0811-9988-1234',
        jenis_order: 'Gamis & Busana Muslim', status: 0, jml_hari: 5, tgl_estimasi: '2026-10-04',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-29 11:45:00', UserAdd: 'Admin Kasir',
        total_qty: 40, tot_hpp: 3800000, total_jual: 6200000,
    },
    {
        IdToko: 1, id_order: 104, no_order: 'ORD-2026-0929-04', tgl_order: '2026-09-29', no_po: 'PO-TRL-0929', no_rutin: 'RUT-04',
        kd_cus: 'CUS-005', nm_cus: 'Komunitas Trail Runner Jkt', alamat: 'Jl. Tebet Barat Dalam Raya No. 18, Jakarta Selatan', tlp: '0818-7766-5544',
        jenis_order: 'Kaos Polo & Lacoste', status: 1, jml_hari: 6, tgl_estimasi: '2026-10-05',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-29 12:10:00', UserAdd: 'Admin Kasir',
        total_qty: 60, tot_hpp: 2700000, total_jual: 4500000,
    },

    // --- MINGGU INI (28 Sept s/d 29 Sept) ---
    {
        IdToko: 1, id_order: 105, no_order: 'ORD-2026-0928-01', tgl_order: '2026-09-28', no_po: 'PO-SMA-0928', no_rutin: 'RUT-05',
        kd_cus: 'CUS-003', nm_cus: 'CV Sumber Makmur Abadi', alamat: 'Jl. Rungkut Industri III No. 88, Surabaya', tlp: '0857-4455-6677',
        jenis_order: 'Kaos Polo & Lacoste', status: 2, jml_hari: 8, tgl_estimasi: '2026-10-06',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-28 08:30:00', UserAdd: 'Supervisor',
        total_qty: 250, tot_hpp: 11250000, total_jual: 17500000,
    },
    {
        IdToko: 1, id_order: 106, no_order: 'ORD-2026-0928-02', tgl_order: '2026-09-28', no_po: 'PO-BNK-0928', no_rutin: 'RUT-06',
        kd_cus: 'CUS-007', nm_cus: 'Bank Daerah KC Utama', alamat: 'Jl. Sudirman Kav. 22-24, Jakarta Pusat', tlp: '021-5522334',
        jenis_order: 'Kemeja & Seragam Kantor', status: 2, jml_hari: 7, tgl_estimasi: '2026-10-05',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-28 10:00:00', UserAdd: 'Supervisor',
        total_qty: 110, tot_hpp: 8250000, total_jual: 13750000,
    },
    {
        IdToko: 1, id_order: 107, no_order: 'ORD-2026-0928-03', tgl_order: '2026-09-28', no_po: 'PO-KLN-0928', no_rutin: 'RUT-07',
        kd_cus: 'CUS-006', nm_cus: 'Klinik Medika Sehat', alamat: 'Jl. Margonda Raya No. 102, Depok', tlp: '0821-3344-5566',
        jenis_order: 'Celana & Rok Formal', status: 3, jml_hari: 5, tgl_estimasi: '2026-10-03',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-28 14:15:00', UserAdd: 'Admin Kasir',
        total_qty: 50, tot_hpp: 3250000, total_jual: 5500000,
    },

    // --- BULAN SEPTEMBER LAINNYA (1 - 27 Sept) ---
    {
        IdToko: 1, id_order: 108, no_order: 'ORD-2026-0925-01', tgl_order: '2026-09-25', no_po: 'PO-JKT-0925', no_rutin: 'RUT-08',
        kd_cus: 'CUS-008', nm_cus: 'Alumni SMAN 5 Angkatan 2004', alamat: 'Jl. Senopati No. 12, Jakarta Selatan', tlp: '0812-7788-9900',
        jenis_order: 'Jaket, Parka & Rompi', status: 2, jml_hari: 10, tgl_estimasi: '2026-10-05',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-25 09:00:00', UserAdd: 'Admin Kasir',
        total_qty: 150, tot_hpp: 13500000, total_jual: 21750000,
    },
    {
        IdToko: 1, id_order: 109, no_order: 'ORD-2026-0924-01', tgl_order: '2026-09-24', no_po: 'PO-SML-0924', no_rutin: 'RUT-09',
        kd_cus: 'CUS-001', nm_cus: 'PT Samudera Logistik Jaya', alamat: 'Kawasan Industri Pulogadung Blok B No. 4, Jakarta Timur', tlp: '0812-8899-7711',
        jenis_order: 'Kemeja & Seragam Kantor', status: 3, jml_hari: 7, tgl_estimasi: '2026-10-01',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-24 10:00:00', UserAdd: 'Admin Kasir',
        total_qty: 300, tot_hpp: 19500000, total_jual: 31500000,
    },
    {
        IdToko: 1, id_order: 110, no_order: 'ORD-2026-0923-01', tgl_order: '2026-09-23', no_po: 'PO-SMA-0923', no_rutin: 'RUT-10',
        kd_cus: 'CUS-003', nm_cus: 'CV Sumber Makmur Abadi', alamat: 'Jl. Rungkut Industri III No. 88, Surabaya', tlp: '0857-4455-6677',
        jenis_order: 'Kaos Polo & Lacoste', status: 4, jml_hari: 6, tgl_estimasi: '2026-09-29',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-23 09:30:00', UserAdd: 'Admin Kasir',
        total_qty: 500, tot_hpp: 21250000, total_jual: 35000000,
    },
    // Order Terlambat (estimasi 26 Sept, belum selesai)
    {
        IdToko: 1, id_order: 111, no_order: 'ORD-2026-0920-01', tgl_order: '2026-09-20', no_po: 'PO-TRL-0920', no_rutin: 'RUT-11',
        kd_cus: 'CUS-005', nm_cus: 'Komunitas Trail Runner Jkt', alamat: 'Jl. Tebet Barat Dalam Raya No. 18, Jakarta Selatan', tlp: '0818-7766-5544',
        jenis_order: 'Kaos Polo & Lacoste', status: 2, jml_hari: 6, tgl_estimasi: '2026-09-26', // TERLAMBAT
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-20 11:00:00', UserAdd: 'Admin Kasir',
        total_qty: 180, tot_hpp: 8100000, total_jual: 13500000,
    },
    // Order Terlambat 2
    {
        IdToko: 1, id_order: 112, no_order: 'ORD-2026-0919-01', tgl_order: '2026-09-19', no_po: 'PO-SMK-0919', no_rutin: 'RUT-12',
        kd_cus: 'CUS-002', nm_cus: 'Yayasan Bina Prestasi (SMK 1)', alamat: 'Jl. Pemuda No. 45, Rawamangun, Jakarta Timur', tlp: '0813-1122-3344',
        jenis_order: 'Wearpack & Praktik', status: 2, jml_hari: 8, tgl_estimasi: '2026-09-27', // TERLAMBAT
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-19 14:00:00', UserAdd: 'Admin Kasir',
        total_qty: 140, tot_hpp: 10500000, total_jual: 16100000,
    },
    // Order Selesai
    {
        IdToko: 1, id_order: 113, no_order: 'ORD-2026-0918-01', tgl_order: '2026-09-18', no_po: 'PO-BOU-0918', no_rutin: 'RUT-13',
        kd_cus: 'CUS-004', nm_cus: 'Boutique Siti Rahayu', alamat: 'Pasar Tanah Abang Blok A Lt. 2 Los E No. 12, Jakarta Pusat', tlp: '0811-9988-1234',
        jenis_order: 'Gamis & Busana Muslim', status: 4, jml_hari: 7, tgl_estimasi: '2026-09-25',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-18 10:20:00', UserAdd: 'Admin Kasir',
        total_qty: 120, tot_hpp: 9600000, total_jual: 16800000,
    },
    {
        IdToko: 1, id_order: 114, no_order: 'ORD-2026-0917-01', tgl_order: '2026-09-17', no_po: 'PO-BNK-0917', no_rutin: 'RUT-14',
        kd_cus: 'CUS-007', nm_cus: 'Bank Daerah KC Utama', alamat: 'Jl. Sudirman Kav. 22-24, Jakarta Pusat', tlp: '021-5522334',
        jenis_order: 'Celana & Rok Formal', status: 4, jml_hari: 6, tgl_estimasi: '2026-09-23',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-17 11:30:00', UserAdd: 'Admin Kasir',
        total_qty: 80, tot_hpp: 5600000, total_jual: 9600000,
    },
    {
        IdToko: 1, id_order: 115, no_order: 'ORD-2026-0915-01', tgl_order: '2026-09-15', no_po: 'PO-SML-0915', no_rutin: 'RUT-15',
        kd_cus: 'CUS-001', nm_cus: 'PT Samudera Logistik Jaya', alamat: 'Kawasan Industri Pulogadung Blok B No. 4, Jakarta Timur', tlp: '0812-8899-7711',
        jenis_order: 'Jaket, Parka & Rompi', status: 4, jml_hari: 9, tgl_estimasi: '2026-09-24',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-15 08:45:00', UserAdd: 'Admin Kasir',
        total_qty: 200, tot_hpp: 17000000, total_jual: 27000000,
    },
    {
        IdToko: 1, id_order: 116, no_order: 'ORD-2026-0914-01', tgl_order: '2026-09-14', no_po: 'PO-SMA-0914', no_rutin: 'RUT-16',
        kd_cus: 'CUS-003', nm_cus: 'CV Sumber Makmur Abadi', alamat: 'Jl. Rungkut Industri III No. 88, Surabaya', tlp: '0857-4455-6677',
        jenis_order: 'Kemeja & Seragam Kantor', status: 4, jml_hari: 8, tgl_estimasi: '2026-09-22',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-14 13:00:00', UserAdd: 'Admin Kasir',
        total_qty: 160, tot_hpp: 10400000, total_jual: 16800000,
    },
    {
        IdToko: 1, id_order: 117, no_order: 'ORD-2026-0912-01', tgl_order: '2026-09-12', no_po: 'PO-KLN-0912', no_rutin: 'RUT-17',
        kd_cus: 'CUS-006', nm_cus: 'Klinik Medika Sehat', alamat: 'Jl. Margonda Raya No. 102, Depok', tlp: '0821-3344-5566',
        jenis_order: 'Wearpack & Praktik', status: 4, jml_hari: 7, tgl_estimasi: '2026-09-19',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-12 10:15:00', UserAdd: 'Admin Kasir',
        total_qty: 70, tot_hpp: 5250000, total_jual: 8050000,
    },
    {
        IdToko: 1, id_order: 118, no_order: 'ORD-2026-0910-01', tgl_order: '2026-09-10', no_po: 'PO-TRL-0910', no_rutin: 'RUT-18',
        kd_cus: 'CUS-005', nm_cus: 'Komunitas Trail Runner Jkt', alamat: 'Jl. Tebet Barat Dalam Raya No. 18, Jakarta Selatan', tlp: '0818-7766-5544',
        jenis_order: 'Kaos Polo & Lacoste', status: 4, jml_hari: 6, tgl_estimasi: '2026-09-16',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-10 11:30:00', UserAdd: 'Admin Kasir',
        total_qty: 120, tot_hpp: 5400000, total_jual: 9000000,
    },
    {
        IdToko: 1, id_order: 119, no_order: 'ORD-2026-0908-01', tgl_order: '2026-09-08', no_po: 'PO-SMK-0908', no_rutin: 'RUT-19',
        kd_cus: 'CUS-002', nm_cus: 'Yayasan Bina Prestasi (SMK 1)', alamat: 'Jl. Pemuda No. 45, Rawamangun, Jakarta Timur', tlp: '0813-1122-3344',
        jenis_order: 'Kemeja & Seragam Kantor', status: 4, jml_hari: 8, tgl_estimasi: '2026-09-16',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-08 09:10:00', UserAdd: 'Admin Kasir',
        total_qty: 350, tot_hpp: 22750000, total_jual: 36750000,
    },
    {
        IdToko: 1, id_order: 120, no_order: 'ORD-2026-0905-01', tgl_order: '2026-09-05', no_po: 'PO-BOU-0905', no_rutin: 'RUT-20',
        kd_cus: 'CUS-004', nm_cus: 'Boutique Siti Rahayu', alamat: 'Pasar Tanah Abang Blok A Lt. 2 Los E No. 12, Jakarta Pusat', tlp: '0811-9988-1234',
        jenis_order: 'Gamis & Busana Muslim', status: 4, jml_hari: 7, tgl_estimasi: '2026-09-12',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-05 14:00:00', UserAdd: 'Admin Kasir',
        total_qty: 90, tot_hpp: 7650000, total_jual: 13050000,
    },
    {
        IdToko: 1, id_order: 121, no_order: 'ORD-2026-0903-01', tgl_order: '2026-09-03', no_po: 'PO-SML-0903', no_rutin: 'RUT-21',
        kd_cus: 'CUS-001', nm_cus: 'PT Samudera Logistik Jaya', alamat: 'Kawasan Industri Pulogadung Blok B No. 4, Jakarta Timur', tlp: '0812-8899-7711',
        jenis_order: 'Kemeja & Seragam Kantor', status: 4, jml_hari: 7, tgl_estimasi: '2026-09-10',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-03 10:00:00', UserAdd: 'Admin Kasir',
        total_qty: 180, tot_hpp: 11700000, total_jual: 18900000,
    },
    {
        IdToko: 1, id_order: 122, no_order: 'ORD-2026-0901-01', tgl_order: '2026-09-01', no_po: 'PO-CAN-0901', no_rutin: 'RUT-22',
        kd_cus: 'CUS-009', nm_cus: 'CV Kreatif Grafika', alamat: 'Jl. Daan Mogot Km. 11, Jakarta Barat', tlp: '0856-1122-3344',
        jenis_order: 'Kaos Polo & Lacoste', status: 5, jml_hari: 5, tgl_estimasi: '2026-09-06', // DIBATALKAN
        Delete: true, DateDel: '2026-09-02 11:00:00', UserDel: 'Manager', DateEdit: null, DateAdd: '2026-09-01 09:30:00', UserAdd: 'Admin Kasir',
        total_qty: 80, tot_hpp: 3600000, total_jual: 5600000,
    },

    // --- BULAN AGUSTUS 2026 (Untuk Perbandingan Periode Lalu) ---
    {
        IdToko: 1, id_order: 123, no_order: 'ORD-2026-0828-01', tgl_order: '2026-08-28', no_po: 'PO-SML-0828', no_rutin: 'RUT-23',
        kd_cus: 'CUS-001', nm_cus: 'PT Samudera Logistik Jaya', alamat: 'Kawasan Industri Pulogadung Blok B No. 4, Jakarta Timur', tlp: '0812-8899-7711',
        jenis_order: 'Kemeja & Seragam Kantor', status: 4, jml_hari: 8, tgl_estimasi: '2026-09-05',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-08-28 09:00:00', UserAdd: 'Admin Kasir',
        total_qty: 220, tot_hpp: 14300000, total_jual: 23100000,
    },
    {
        IdToko: 1, id_order: 124, no_order: 'ORD-2026-0825-01', tgl_order: '2026-08-25', no_po: 'PO-SMK-0825', no_rutin: 'RUT-24',
        kd_cus: 'CUS-002', nm_cus: 'Yayasan Bina Prestasi (SMK 1)', alamat: 'Jl. Pemuda No. 45, Rawamangun, Jakarta Timur', tlp: '0813-1122-3344',
        jenis_order: 'Wearpack & Praktik', status: 4, jml_hari: 9, tgl_estimasi: '2026-09-03',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-08-25 10:15:00', UserAdd: 'Admin Kasir',
        total_qty: 280, tot_hpp: 21000000, total_jual: 32200000,
    },
    {
        IdToko: 1, id_order: 125, no_order: 'ORD-2026-0820-01', tgl_order: '2026-08-20', no_po: 'PO-SMA-0820', no_rutin: 'RUT-25',
        kd_cus: 'CUS-003', nm_cus: 'CV Sumber Makmur Abadi', alamat: 'Jl. Rungkut Industri III No. 88, Surabaya', tlp: '0857-4455-6677',
        jenis_order: 'Kaos Polo & Lacoste', status: 4, jml_hari: 7, tgl_estimasi: '2026-08-27',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-08-20 11:30:00', UserAdd: 'Admin Kasir',
        total_qty: 400, tot_hpp: 17000000, total_jual: 28000000,
    },
    {
        IdToko: 1, id_order: 126, no_order: 'ORD-2026-0815-01', tgl_order: '2026-08-15', no_po: 'PO-BOU-0815', no_rutin: 'RUT-26',
        kd_cus: 'CUS-004', nm_cus: 'Boutique Siti Rahayu', alamat: 'Pasar Tanah Abang Blok A Lt. 2 Los E No. 12, Jakarta Pusat', tlp: '0811-9988-1234',
        jenis_order: 'Gamis & Busana Muslim', status: 4, jml_hari: 6, tgl_estimasi: '2026-08-21',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-08-15 14:00:00', UserAdd: 'Admin Kasir',
        total_qty: 110, tot_hpp: 8800000, total_jual: 15400000,
    },
    {
        IdToko: 1, id_order: 127, no_order: 'ORD-2026-0810-01', tgl_order: '2026-08-10', no_po: 'PO-TRL-0810', no_rutin: 'RUT-27',
        kd_cus: 'CUS-005', nm_cus: 'Komunitas Trail Runner Jkt', alamat: 'Jl. Tebet Barat Dalam Raya No. 18, Jakarta Selatan', tlp: '0818-7766-5544',
        jenis_order: 'Kaos Polo & Lacoste', status: 4, jml_hari: 6, tgl_estimasi: '2026-08-16',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-08-10 13:00:00', UserAdd: 'Admin Kasir',
        total_qty: 150, tot_hpp: 6750000, total_jual: 11250000,
    },
    {
        IdToko: 1, id_order: 128, no_order: 'ORD-2026-0805-01', tgl_order: '2026-08-05', no_po: 'PO-BNK-0805', no_rutin: 'RUT-28',
        kd_cus: 'CUS-007', nm_cus: 'Bank Daerah KC Utama', alamat: 'Jl. Sudirman Kav. 22-24, Jakarta Pusat', tlp: '021-5522334',
        jenis_order: 'Kemeja & Seragam Kantor', status: 4, jml_hari: 7, tgl_estimasi: '2026-08-12',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-08-05 09:15:00', UserAdd: 'Admin Kasir',
        total_qty: 140, tot_hpp: 10500000, total_jual: 17500000,
    },
    {
        IdToko: 1, id_order: 129, no_order: 'ORD-2026-0801-01', tgl_order: '2026-08-01', no_po: 'PO-JKT-0801', no_rutin: 'RUT-29',
        kd_cus: 'CUS-008', nm_cus: 'Alumni SMAN 5 Angkatan 2004', alamat: 'Jl. Senopati No. 12, Jakarta Selatan', tlp: '0812-7788-9900',
        jenis_order: 'Jaket, Parka & Rompi', status: 4, jml_hari: 10, tgl_estimasi: '2026-08-11',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-08-01 10:45:00', UserAdd: 'Admin Kasir',
        total_qty: 180, tot_hpp: 16200000, total_jual: 26100000,
    },

    // --- BULAN LAINNYA 2026 ---
    {
        IdToko: 1, id_order: 130, no_order: 'ORD-2026-0715-01', tgl_order: '2026-07-15', no_po: 'PO-SML-0715', no_rutin: 'RUT-30',
        kd_cus: 'CUS-001', nm_cus: 'PT Samudera Logistik Jaya', alamat: 'Kawasan Industri Pulogadung Blok B No. 4, Jakarta Timur', tlp: '0812-8899-7711',
        jenis_order: 'Kemeja & Seragam Kantor', status: 4, jml_hari: 8, tgl_estimasi: '2026-07-23',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-07-15 08:30:00', UserAdd: 'Admin Kasir',
        total_qty: 240, tot_hpp: 15600000, total_jual: 25200000,
    },
    {
        IdToko: 1, id_order: 131, no_order: 'ORD-2026-0610-01', tgl_order: '2026-06-10', no_po: 'PO-SMK-0610', no_rutin: 'RUT-31',
        kd_cus: 'CUS-002', nm_cus: 'Yayasan Bina Prestasi (SMK 1)', alamat: 'Jl. Pemuda No. 45, Rawamangun, Jakarta Timur', tlp: '0813-1122-3344',
        jenis_order: 'Wearpack & Praktik', status: 4, jml_hari: 10, tgl_estimasi: '2026-06-20',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-06-10 11:00:00', UserAdd: 'Admin Kasir',
        total_qty: 320, tot_hpp: 24000000, total_jual: 36800000,
    },
    {
        IdToko: 1, id_order: 132, no_order: 'ORD-2026-0520-01', tgl_order: '2026-05-20', no_po: 'PO-SMA-0520', no_rutin: 'RUT-32',
        kd_cus: 'CUS-003', nm_cus: 'CV Sumber Makmur Abadi', alamat: 'Jl. Rungkut Industri III No. 88, Surabaya', tlp: '0857-4455-6677',
        jenis_order: 'Kaos Polo & Lacoste', status: 4, jml_hari: 7, tgl_estimasi: '2026-05-27',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-05-20 09:40:00', UserAdd: 'Admin Kasir',
        total_qty: 450, tot_hpp: 19125000, total_jual: 31500000,
    },
];

// Helper Functions
export function isOrderActive(order: OrderRecord): boolean {
    return [0, 1, 2, 3].includes(Number(order.status));
}

export function isOrderCompleted(order: OrderRecord): boolean {
    return Number(order.status) === 4;
}

export function isOrderCancelled(order: OrderRecord): boolean {
    return Number(order.status) === 5 || order.Delete === true;
}

export function isOrderOverdue(order: OrderRecord, referenceDate = TODAY_DATE): boolean {
    if (isOrderCompleted(order) || isOrderCancelled(order)) return false;
    return order.tgl_estimasi < referenceDate;
}

export function isOrderApproaching(order: OrderRecord, referenceDate = TODAY_DATE): boolean {
    if (isOrderCompleted(order) || isOrderCancelled(order) || isOrderOverdue(order, referenceDate)) return false;
    const diffDays = Math.ceil((new Date(order.tgl_estimasi).getTime() - new Date(referenceDate).getTime()) / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 3;
}

// KPI Calculation from Array of Orders
export interface OrderKpis {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    overdueOrders: number;
    totalQty: number;
    totalJual: number;
    totalHpp: number;
    labaKotor: number;
    marginLabaKotor: number;
}

export function calculateOrderKpis(orders: OrderRecord[], referenceDate = TODAY_DATE): OrderKpis {
    let active = 0;
    let completed = 0;
    let overdue = 0;
    let qty = 0;
    let jual = 0;
    let hpp = 0;

    for (const ord of orders) {
        if (isOrderActive(ord)) active++;
        if (isOrderCompleted(ord)) completed++;
        if (isOrderOverdue(ord, referenceDate)) overdue++;
        qty += ord.total_qty || 0;
        jual += ord.total_jual || 0;
        hpp += ord.tot_hpp || 0;
    }

    const labaKotor = jual - hpp;
    const margin = jual > 0 ? (labaKotor / jual) * 100 : 0;

    return {
        totalOrders: orders.length,
        activeOrders: active,
        completedOrders: completed,
        overdueOrders: overdue,
        totalQty: qty,
        totalJual: jual,
        totalHpp: hpp,
        labaKotor,
        marginLabaKotor: margin,
    };
}

// Filter orders by date range [startDate, endDate] inclusive
export function filterOrdersByDateRange(orders: OrderRecord[], startDate: string, endDate: string): OrderRecord[] {
    return orders.filter((o) => o.tgl_order >= startDate && o.tgl_order <= endDate);
}

// Export orders to CSV string
export function exportOrdersToCsv(orders: OrderRecord[]): string {
    const headers = [
        'No Order',
        'Tanggal Order',
        'No PO',
        'Pelanggan',
        'Jenis Order',
        'Status',
        'Qty (Pcs)',
        'HPP (Rp)',
        'Total Jual (Rp)',
        'Laba Kotor (Rp)',
        'Estimasi Selesai',
    ];

    const rows = orders.map((o) => {
        const statusMeta = ORDER_STATUS_MAP[String(o.status)] || { label: 'Unknown' };
        const laba = o.total_jual - o.tot_hpp;
        return [
            `"${o.no_order}"`,
            `"${o.tgl_order}"`,
            `"${o.no_po || '-'}"`,
            `"${o.nm_cus}"`,
            `"${o.jenis_order}"`,
            `"${statusMeta.label}"`,
            o.total_qty,
            o.tot_hpp,
            o.total_jual,
            laba,
            `"${o.tgl_estimasi}"`,
        ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
}
