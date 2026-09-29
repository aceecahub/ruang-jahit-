/**
 * Dashboard Overview Data - Convection & Sewing Business
 */

export interface KpiItem {
    id: string;
    title: string;
    value: number;
    formattedValue?: string;
    unit?: string;
    change: number; // percentage change
    isPositive: boolean;
    periodText: string;
    tooltip: string;
    type: 'currency' | 'number' | 'percent';
}

export interface RevenueTrendPeriod {
    labels: string[];
    revenue: number[];
    profit: number[];
}

export interface OrderStatusSummary {
    statusKey: string;
    label: string;
    count: number;
    pcs: number;
    color: string;
}

export interface ProductionSummary {
    targetPcs: number;
    actualPcs: number;
    achievementRate: number;
    approachingDeadlineOrders: number;
    overdueOrders: number;
    qcPassedPcs: number;
    qcPassedRate: number;
}

export interface DashboardAlert {
    id: string;
    type: 'deadline' | 'overdue' | 'stock' | 'receivable' | 'production';
    severity: 'danger' | 'warning' | 'info';
    title: string;
    description: string;
    time: string;
    actionLabel?: string;
    meta?: string;
}

export interface DashboardOverviewData {
    kpis: KpiItem[];
    revenueTrends: {
        weekly: RevenueTrendPeriod;
        monthly: RevenueTrendPeriod;
        yearly: RevenueTrendPeriod;
    };
    orderStatusCounts: OrderStatusSummary[];
    productionSummary: ProductionSummary;
    alerts: DashboardAlert[];
}

export const initialDashboardData: DashboardOverviewData = {
    kpis: [
        {
            id: 'revenue',
            title: 'Total Pendapatan',
            value: 184500000,
            change: 12.4,
            isPositive: true,
            periodText: 'vs. bulan lalu',
            tooltip: 'Total penerimaan kotor dari seluruh pesanan masuk & terselesaikan bulan ini.',
            type: 'currency',
        },
        {
            id: 'net_profit',
            title: 'Laba Bersih',
            value: 53500000,
            change: 8.7,
            isPositive: true,
            periodText: 'vs. bulan lalu',
            tooltip: 'Estimasi keuntungan bersih setelah dikurangi HPP kain, upah tenaga kerja, dan biaya operasional.',
            type: 'currency',
        },
        {
            id: 'active_orders',
            title: 'Pesanan Aktif',
            value: 46,
            unit: 'Order',
            change: 4.2,
            isPositive: true,
            periodText: '1.920 Pcs proses',
            tooltip: 'Jumlah order yang saat ini sedang dalam antrean potong, jahit, atau finishing.',
            type: 'number',
        },
        {
            id: 'completed_orders',
            title: 'Pesanan Selesai',
            value: 114,
            unit: 'Order',
            change: 15.1,
            isPositive: true,
            periodText: '3.680 Pcs tuntas',
            tooltip: 'Jumlah order yang telah 100% selesai diproduksi dan lolos QC periode ini.',
            type: 'number',
        },
        {
            id: 'receivables',
            title: 'Piutang Pelanggan',
            value: 42600000,
            change: -5.2,
            isPositive: true,
            periodText: 'Pelunasan berjalan',
            tooltip: 'Sisa tagihan invoice order yang belum dilunasi oleh pelanggan/B2B.',
            type: 'currency',
        },
        {
            id: 'cash_balance',
            title: 'Saldo Kas & Bank',
            value: 64800000,
            change: 14.1,
            isPositive: true,
            periodText: 'Likuiditas aman',
            tooltip: 'Total dana kas tunai dan saldo rekening operasional konveksi saat ini.',
            type: 'currency',
        },
        {
            id: 'production_rate',
            title: 'Penyelesaian Produksi',
            value: 91.3,
            change: 3.5,
            isPositive: true,
            periodText: 'Target 6.000 Pcs',
            tooltip: 'Rasio capaian jumlah output fisik pakaian terhadap target kuota produksi.',
            type: 'percent',
        },
        {
            id: 'overdue_orders',
            title: 'Pesanan Terlambat',
            value: 5,
            unit: 'Order',
            change: -2.0,
            isPositive: false,
            periodText: 'Perlu lembur regu',
            tooltip: 'Pesanan yang melewati tanggal deadline kesepakatan dengan pelanggan.',
            type: 'number',
        },
    ],
    revenueTrends: {
        weekly: {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            revenue: [22500000, 28400000, 24100000, 31200000, 34500000, 26800000, 17000000],
            profit: [6800000, 8900000, 7200000, 9600000, 10800000, 7500000, 4700000],
        },
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
            revenue: [120000000, 135000000, 142000000, 168000000, 185000000, 160000000, 172000000, 178000000, 184500000, 192000000, 210000000, 225000000],
            profit: [36000000, 40500000, 42600000, 50400000, 55500000, 48000000, 51600000, 53400000, 53500000, 57600000, 63000000, 67500000],
        },
        yearly: {
            labels: ['2022', '2023', '2024', '2025', '2026 (Est)'],
            revenue: [1150000000, 1420000000, 1780000000, 2150000000, 2380000000],
            profit: [322000000, 411000000, 516000000, 645000000, 714000000],
        },
    },
    orderStatusCounts: [
        { statusKey: 'waiting_confirmation', label: 'Menunggu Konfirmasi', count: 8, pcs: 280, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' },
        { statusKey: 'waiting_production', label: 'Menunggu Produksi', count: 14, pcs: 540, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' },
        { statusKey: 'in_production', label: 'Dalam Proses Produksi', count: 24, pcs: 1100, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
        { statusKey: 'production_completed', label: 'Selesai Diproduksi', count: 18, pcs: 580, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
        { statusKey: 'ready_to_ship', label: 'Siap Dikirim', count: 12, pcs: 420, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' },
        { statusKey: 'shipped', label: 'Sudah Dikirim', count: 114, pcs: 3680, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
        { statusKey: 'cancelled', label: 'Dibatalkan', count: 3, pcs: 80, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
    ],
    productionSummary: {
        targetPcs: 6000,
        actualPcs: 5480,
        achievementRate: 91.3,
        approachingDeadlineOrders: 9,
        overdueOrders: 5,
        qcPassedPcs: 5340,
        qcPassedRate: 97.4,
    },
    alerts: [
        {
            id: 'alt-1',
            type: 'overdue',
            severity: 'danger',
            title: '2 Pesanan Melewati Deadline',
            description: 'Order #ORD-804 (PT Samudera Jaya - 300 Pcs Kemeja) & #ORD-811 (SMK 1 - 150 Pcs Seragam) belum tuntas jahit.',
            time: '2 jam lalu',
            actionLabel: 'Instruksikan Lembur',
            meta: 'Tenggat: Kemarin',
        },
        {
            id: 'alt-2',
            type: 'stock',
            severity: 'danger',
            title: 'Stok Bahan Baku Kritis (< Batas Aman)',
            description: 'Kain Katun Toyobo Fodu Navy sisa 18 meter (min. 50 meter) & Benang Jahit Astra Hitam sisa 4 lusin.',
            time: '4 jam lalu',
            actionLabel: 'Buat PO Bahan',
            meta: 'Stok Rendah',
        },
        {
            id: 'alt-3',
            type: 'deadline',
            severity: 'warning',
            title: '9 Pesanan Mendekati Tenggat (< 3 Hari)',
            description: 'Total 480 pcs seragam kantor & kaos event dijadwalkan kirim tanggal 2 s/d 4 Oktober.',
            time: 'Hari ini',
            actionLabel: 'Pantau Lini Jahit',
            meta: 'Deadline Dekat',
        },
        {
            id: 'alt-4',
            type: 'receivable',
            severity: 'warning',
            title: 'Piutang Jatuh Tempo Rp 18.500.000',
            description: 'Tagihan invoice #INV-204 atas nama CV Mega Logistik telah jatuh tempo 5 hari.',
            time: '1 hari lalu',
            actionLabel: 'Kirim Pengingat',
            meta: 'Termin Lewat',
        },
        {
            id: 'alt-5',
            type: 'production',
            severity: 'info',
            title: 'Kapasitas Lini Potong Masih Tersedia',
            description: 'Stasiun Cutting mencapai output 98% lebih awal. Siap menerima gelar kain untuk batch baru.',
            time: 'Pagi ini',
            actionLabel: 'Jadwalkan Potong',
            meta: 'Optimal',
        },
    ],
};
