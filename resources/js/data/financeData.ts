/**
 * Finance Analytics Data - Convection & Tailoring Business
 */

export interface ExpenseCategoryItem {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface OrderProfitAnalysisItem {
    orderNumber: string;
    customerName: string;
    itemDesc: string;
    pcs: number;
    revenue: number;
    materialCost: number;
    laborCost: number;
    otherCost: number;
    totalCost: number;
    netProfit: number;
    profitMargin: number;
}

export interface FinanceAnalyticsData {
    summary: {
        totalRevenue: number;
        productionCost: number; // HPP (Bahan + Ongkos jahit)
        operationalCost: number; // Opex (Sewa, Listrik, Maint)
        grossProfit: number;
        netProfit: number;
        netProfitMargin: number;
        cashInflow: number;
        cashOutflow: number;
        cashBalance: number;
        customerReceivables: number;
        supplierPayables: number;
    };
    expenseDistribution: ExpenseCategoryItem[];
    monthlyFinanceTrend: {
        months: string[];
        revenue: number[];
        expenses: number[];
        netProfit: number[];
    };
    orderProfitabilityTable: OrderProfitAnalysisItem[];
}

export const initialFinanceData: FinanceAnalyticsData = {
    summary: {
        totalRevenue: 184500000,
        productionCost: 112400000, // Bahan 74.2jt + Upah Jahit 38.2jt
        operationalCost: 18600000,
        grossProfit: 72100000,
        netProfit: 53500000,
        netProfitMargin: 29.0,
        cashInflow: 141900000,
        cashOutflow: 124300000,
        cashBalance: 64800000,
        customerReceivables: 42600000,
        supplierPayables: 18200000,
    },
    expenseDistribution: [
        { category: 'Kain & Bahan Baku Utama', amount: 62500000, percentage: 47.7, color: '#2563eb' },
        { category: 'Upah Jahit & Borongan Regu', amount: 38200000, percentage: 29.2, color: '#10b981' },
        { category: 'Benang, Kancing & Aksesoris', amount: 11700000, percentage: 8.9, color: '#f59e0b' },
        { category: 'Listrik Workshop & Mesin Uap', amount: 8400000, percentage: 6.4, color: '#6366f1' },
        { category: 'Sewa Workshop & Maintenance Mesin', amount: 6200000, percentage: 4.7, color: '#ec4899' },
        { category: 'Packaging, Kurir & Transportasi', amount: 4000000, percentage: 3.1, color: '#64748b' },
    ],
    monthlyFinanceTrend: {
        months: ['Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt (Est)'],
        revenue: [185000000, 160000000, 172000000, 178000000, 184500000, 192000000],
        expenses: [129500000, 112000000, 120400000, 124600000, 131000000, 134400000],
        netProfit: [55500000, 48000000, 51600000, 53400000, 53500000, 57600000],
    },
    orderProfitabilityTable: [
        {
            orderNumber: 'ORD-2026-0881',
            customerName: 'PT Samudera Logistik Jaya',
            itemDesc: '300 Pcs Kemeja Drill Kombinasi Batik',
            pcs: 300,
            revenue: 38500000,
            materialCost: 18200000,
            laborCost: 6900000,
            otherCost: 1400000,
            totalCost: 26500000,
            netProfit: 12000000,
            profitMargin: 31.2,
        },
        {
            orderNumber: 'ORD-2026-0882',
            customerName: 'Yayasan Bina Prestasi (SMK 1)',
            itemDesc: '250 Pcs Wearpack Otomotif Katun Drill',
            pcs: 250,
            revenue: 28400000,
            materialCost: 14100000,
            laborCost: 5200000,
            otherCost: 950000,
            totalCost: 20250000,
            netProfit: 8150000,
            profitMargin: 28.7,
        },
        {
            orderNumber: 'ORD-2026-0883',
            customerName: 'CV Sumber Makmur Abadi',
            itemDesc: '500 Pcs Kaos Polo Lacoste CVC Bordir',
            pcs: 500,
            revenue: 32500000,
            materialCost: 16800000,
            laborCost: 5500000,
            otherCost: 1200000,
            totalCost: 23500000,
            netProfit: 9000000,
            profitMargin: 27.7,
        },
        {
            orderNumber: 'ORD-2026-0885',
            customerName: 'Boutique Siti Rahayu',
            itemDesc: '120 Pcs Gamis Set Rayon Twill Premium',
            pcs: 120,
            revenue: 19800000,
            materialCost: 8900000,
            laborCost: 3600000,
            otherCost: 800000,
            totalCost: 13300000,
            netProfit: 6500000,
            profitMargin: 32.8,
        },
        {
            orderNumber: 'ORD-2026-0886',
            customerName: 'Bank Daerah KC Utama',
            itemDesc: '80 Pcs Blazer Formal Semi Wool Furing',
            pcs: 80,
            revenue: 26000000,
            materialCost: 11400000,
            laborCost: 4800000,
            otherCost: 1100000,
            totalCost: 17300000,
            netProfit: 8700000,
            profitMargin: 33.5,
        },
    ],
};
