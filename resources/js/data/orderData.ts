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
    '0': { code: 0, label: 'Draft', category: 'waiting', color: '#64748b', badgeClass: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' },
    '1': { code: 1, label: 'Proses', category: 'active', color: '#6366f1', badgeClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50' },
    '2': { code: 2, label: 'Selesai', category: 'active', color: '#2563eb', badgeClass: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50' },
};

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

    // --- MINGGU INI (28 Sept s/d 29 Sept) ---
    {
        IdToko: 1, id_order: 105, no_order: 'ORD-2026-0928-01', tgl_order: '2026-09-28', no_po: 'PO-SMA-0928', no_rutin: 'RUT-05',
        kd_cus: 'CUS-003', nm_cus: 'CV Sumber Makmur Abadi', alamat: 'Jl. Rungkut Industri III No. 88, Surabaya', tlp: '0857-4455-6677',
        jenis_order: 'Kaos Polo & Lacoste', status: 2, jml_hari: 8, tgl_estimasi: '2026-10-06',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-28 08:30:00', UserAdd: 'Supervisor',
        total_qty: 250, tot_hpp: 11250000, total_jual: 17500000,
    },

    // --- BULAN SEPTEMBER LAINNYA (1 - 27 Sept) ---
    {
        IdToko: 1, id_order: 108, no_order: 'ORD-2026-0925-01', tgl_order: '2026-09-25', no_po: 'PO-JKT-0925', no_rutin: 'RUT-08',
        kd_cus: 'CUS-008', nm_cus: 'Alumni SMAN 5 Angkatan 2004', alamat: 'Jl. Senopati No. 12, Jakarta Selatan', tlp: '0812-7788-9900',
        jenis_order: 'Jaket, Parka & Rompi', status: 2, jml_hari: 10, tgl_estimasi: '2026-10-05',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-25 09:00:00', UserAdd: 'Admin Kasir',
        total_qty: 150, tot_hpp: 13500000, total_jual: 21750000,
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
        IdToko: 1, id_order: 121, no_order: 'ORD-2026-0903-01', tgl_order: '2026-09-03', no_po: 'PO-SML-0903', no_rutin: 'RUT-21',
        kd_cus: 'CUS-001', nm_cus: 'PT Samudera Logistik Jaya', alamat: 'Kawasan Industri Pulogadung Blok B No. 4, Jakarta Timur', tlp: '0812-8899-7711',
        jenis_order: 'Kemeja & Seragam Kantor', status: 1, jml_hari: 7, tgl_estimasi: '2026-09-10',
        Delete: false, DateDel: null, UserDel: null, DateEdit: null, DateAdd: '2026-09-03 10:00:00', UserAdd: 'Admin Kasir',
        total_qty: 180, tot_hpp: 11700000, total_jual: 18900000,
    },
];

export type OrderLike = {
    status: number | string;
    tgl_estimasi?: string | null;
    Delete?: boolean;
};

// Helper Functions
export function isOrderActive(order: OrderLike): boolean {
    return [0, 1, 2, 3].includes(Number(order.status));
}

export function isOrderCompleted(order: OrderLike): boolean {
    return Number(order.status) === 4;
}

export function isOrderCancelled(order: OrderLike): boolean {
    return Number(order.status) === 5 || order.Delete === true;
}

export function isOrderOverdue(order: OrderLike, referenceDate = TODAY_DATE): boolean {
    if (isOrderCompleted(order) || isOrderCancelled(order) || !order.tgl_estimasi) return false;
    return order.tgl_estimasi < referenceDate;
}

export function isOrderApproaching(order: OrderLike, referenceDate = TODAY_DATE): boolean {
    if (isOrderCompleted(order) || isOrderCancelled(order) || !order.tgl_estimasi || isOrderOverdue(order, referenceDate)) return false;
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
