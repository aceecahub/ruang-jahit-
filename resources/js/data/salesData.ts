/**
 * Sales Analytics Data - Convection & Tailoring Business
 */

export interface SalesCategoryBreakdown {
    category: string;
    revenue: number;
    ordersCount: number;
    pcsSold: number;
    percentage: number;
}

export interface CustomerSalesSummary {
    id: string;
    customerName: string;
    type: 'B2B Korporat' | 'Instansi/Sekolah' | 'Retail/Komunitas' | 'Individu';
    totalRevenue: number;
    orderCount: number;
    lastOrderDate: string;
    status: 'Lunas' | 'Sebagian Piutang';
}

export interface SalesAnalyticsData {
    summary: {
        totalRevenue: number;
        revenueGrowth: number;
        totalOrders: number;
        ordersGrowth: number;
        avgOrderValue: number;
        avgOrderValueGrowth: number;
        cancelledOrders: number;
        cancelledOrdersValue: number;
        cancellationRate: number;
        previousPeriodRevenue: number;
    };
    revenueByProductCategory: SalesCategoryBreakdown[];
    topCustomersByRevenue: CustomerSalesSummary[];
    salesTrend: {
        periods: string[];
        currentPeriod: number[];
        previousPeriod: number[];
    };
    cancelledReasons: {
        reason: string;
        count: number;
        percentage: number;
    }[];
}

export const initialSalesData: SalesAnalyticsData = {
    summary: {
        totalRevenue: 184500000,
        revenueGrowth: 12.4,
        totalOrders: 168,
        ordersGrowth: 8.6,
        avgOrderValue: 1098214,
        avgOrderValueGrowth: 3.5,
        cancelledOrders: 3,
        cancelledOrdersValue: 3800000,
        cancellationRate: 1.7,
        previousPeriodRevenue: 164100000,
    },
    revenueByProductCategory: [
        { category: 'Kemeja & Seragam Kantor', revenue: 64500000, ordersCount: 48, pcsSold: 1850, percentage: 35.0 },
        { category: 'Kaos Polo & Wangki Lacoste', revenue: 42800000, ordersCount: 52, pcsSold: 2100, percentage: 23.2 },
        { category: 'Jaket, Parka & Rompi Safety', revenue: 35200000, ordersCount: 26, pcsSold: 680, percentage: 19.1 },
        { category: 'Gamis, Kaftan & Busana Muslim', revenue: 26500000, ordersCount: 24, pcsSold: 740, percentage: 14.4 },
        { category: 'Celana Kain & Rok Kerja', revenue: 15500000, ordersCount: 18, pcsSold: 470, percentage: 8.3 },
    ],
    topCustomersByRevenue: [
        { id: 'CUST-001', customerName: 'PT Samudera Logistik Jaya', type: 'B2B Korporat', totalRevenue: 38500000, orderCount: 6, lastOrderDate: '2026-09-24', status: 'Sebagian Piutang' },
        { id: 'CUST-002', customerName: 'Yayasan Bina Prestasi (SMK 1)', type: 'Instansi/Sekolah', totalRevenue: 28400000, orderCount: 4, lastOrderDate: '2026-09-20', status: 'Lunas' },
        { id: 'CUST-003', customerName: 'CV Sumber Makmur Abadi', type: 'B2B Korporat', totalRevenue: 22100000, orderCount: 5, lastOrderDate: '2026-09-26', status: 'Sebagian Piutang' },
        { id: 'CUST-004', customerName: 'Komunitas Trail Runner Jkt', type: 'Retail/Komunitas', totalRevenue: 16800000, orderCount: 3, lastOrderDate: '2026-09-18', status: 'Lunas' },
        { id: 'CUST-005', customerName: 'Boutique Siti Rahayu', type: 'Individu', totalRevenue: 14200000, orderCount: 8, lastOrderDate: '2026-09-27', status: 'Lunas' },
    ],
    salesTrend: {
        periods: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        currentPeriod: [42500000, 48200000, 46100000, 47700000],
        previousPeriod: [38000000, 41500000, 43200000, 41400000],
    },
    cancelledReasons: [
        { reason: 'Perubahan Desain / Batal Event Pelanggan', count: 2, percentage: 66.7 },
        { reason: 'Kain Khusus Supplier Kosong', count: 1, percentage: 33.3 },
    ],
};
