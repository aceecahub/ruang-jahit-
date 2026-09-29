/**
 * Inventory Analytics Data - Convection & Tailoring Business
 */

export interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    colorCode: string;
    category: 'Kain Katun' | 'Kain Drill & Twill' | 'Kain Kaos & Rajut' | 'Kain Jas & Wool' | 'Aksesoris & Benang' | 'Bahan Pelapis';
    currentStock: number;
    unit: 'Meter' | 'Roll' | 'Lusin' | 'Gross' | 'Kg';
    minStock: number;
    unitCost: number;
    totalValue: number;
    status: 'aman' | 'menipis' | 'habis';
    supplier: string;
    lastRestockDate: string;
}

export interface PurchaseHistoryItem {
    poNumber: string;
    date: string;
    supplier: string;
    itemsSummary: string;
    totalAmount: number;
    status: 'Diterima Lengkap' | 'Sebagian Datang' | 'Menunggu Kirim';
}

export interface InventoryAnalyticsData {
    summary: {
        totalMaterialTypes: number;
        totalInventoryValue: number;
        totalFabricMeters: number;
        itemsBelowMinStock: number;
        usedMetersThisMonth: number;
        scrapWastePercentage: number;
        scrapMeters: number;
        leftoverReusableMeters: number;
    };
    categoryStockValuation: {
        category: string;
        value: number;
        itemsCount: number;
        percentage: number;
    }[];
    inventoryList: InventoryItem[];
    recentPurchases: PurchaseHistoryItem[];
}

export const initialInventoryData: InventoryAnalyticsData = {
    summary: {
        totalMaterialTypes: 48,
        totalInventoryValue: 94800000,
        totalFabricMeters: 4850,
        itemsBelowMinStock: 5,
        usedMetersThisMonth: 3420,
        scrapWastePercentage: 2.8,
        scrapMeters: 96,
        leftoverReusableMeters: 310,
    },
    categoryStockValuation: [
        { category: 'Kain Drill & Twill', value: 36400000, itemsCount: 12, percentage: 38.4 },
        { category: 'Kain Katun (Toyobo, Poplin)', value: 24800000, itemsCount: 14, percentage: 26.2 },
        { category: 'Kain Kaos & Rajut (CVC, Combed)', value: 16500000, itemsCount: 8, percentage: 17.4 },
        { category: 'Aksesoris, Kancing & Benang', value: 9200000, itemsCount: 10, percentage: 9.7 },
        { category: 'Bahan Pelapis & Furing', value: 7900000, itemsCount: 4, percentage: 8.3 },
    ],
    inventoryList: [
        {
            id: 'INV-01',
            sku: 'DRL-NVA-01',
            name: 'American Drill 1919 Original',
            colorCode: 'Navy Blue #14',
            category: 'Kain Drill & Twill',
            currentStock: 420,
            unit: 'Meter',
            minStock: 200,
            unitCost: 38000,
            totalValue: 15960000,
            status: 'aman',
            supplier: 'CV Tekstil Mandiri',
            lastRestockDate: '2026-09-15',
        },
        {
            id: 'INV-02',
            sku: 'TYB-FOD-02',
            name: 'Katun Toyobo Fodu Import',
            colorCode: 'Navy Gelap #04',
            category: 'Kain Katun',
            currentStock: 18,
            unit: 'Meter',
            minStock: 60,
            unitCost: 45000,
            totalValue: 810000,
            status: 'menipis',
            supplier: 'PT Kain Mulia Nusantara',
            lastRestockDate: '2026-08-28',
        },
        {
            id: 'INV-03',
            sku: 'BNG-AST-03',
            name: 'Benang Jahit Astra 40/2 (5000 Yard)',
            colorCode: 'Hitam Jet Black',
            category: 'Aksesoris & Benang',
            currentStock: 4,
            unit: 'Lusin',
            minStock: 15,
            unitCost: 145000,
            totalValue: 580000,
            status: 'habis',
            supplier: 'Toko Sumber Benang',
            lastRestockDate: '2026-09-02',
        },
        {
            id: 'INV-04',
            sku: 'LCS-CVC-04',
            name: 'Polo Lacoste Katun CVC 24s',
            colorCode: 'Putih Bersih #01',
            category: 'Kain Kaos & Rajut',
            currentStock: 280,
            unit: 'Meter',
            minStock: 100,
            unitCost: 48000,
            totalValue: 13440000,
            status: 'aman',
            supplier: 'Pabrik Rajut Bandung Jaya',
            lastRestockDate: '2026-09-22',
        },
        {
            id: 'INV-05',
            sku: 'RYN-TWL-05',
            name: 'Rayon Twill Premium 100% Rayon',
            colorCode: 'Sage Green #12',
            category: 'Kain Katun',
            currentStock: 32,
            unit: 'Meter',
            minStock: 80,
            unitCost: 36000,
            totalValue: 1152000,
            status: 'menipis',
            supplier: 'PT Kain Mulia Nusantara',
            lastRestockDate: '2026-09-10',
        },
        {
            id: 'INV-06',
            sku: 'KNC-4LB-06',
            name: 'Kancing Kemeja 4 Lubang 18L',
            colorCode: 'Putih Mutiara',
            category: 'Aksesoris & Benang',
            currentStock: 120,
            unit: 'Gross',
            minStock: 250,
            unitCost: 18000,
            totalValue: 2160000,
            status: 'menipis',
            supplier: 'Kancing Utama Jaya',
            lastRestockDate: '2026-08-30',
        },
        {
            id: 'INV-07',
            sku: 'FUR-ASH-07',
            name: 'Furing Asahi Halus High Grade',
            colorCode: 'Hitam Standard',
            category: 'Bahan Pelapis',
            currentStock: 14,
            unit: 'Meter',
            minStock: 50,
            unitCost: 16000,
            totalValue: 224000,
            status: 'habis',
            supplier: 'CV Tekstil Mandiri',
            lastRestockDate: '2026-08-14',
        },
    ],
    recentPurchases: [
        { poNumber: 'PO-2026-091', date: '2026-09-22', supplier: 'Pabrik Rajut Bandung Jaya', itemsSummary: 'Lacoste CVC Putih (300m) & Rib Kerah', totalAmount: 16500000, status: 'Diterima Lengkap' },
        { poNumber: 'PO-2026-092', date: '2026-09-18', supplier: 'CV Tekstil Mandiri', itemsSummary: 'American Drill Navy (450m) & Khaki (200m)', totalAmount: 24700000, status: 'Diterima Lengkap' },
        { poNumber: 'PO-2026-093', date: '2026-09-26', supplier: 'PT Kain Mulia Nusantara', itemsSummary: 'Toyobo Fodu Navy (150m) & Rayon Sage (100m)', totalAmount: 10350000, status: 'Menunggu Kirim' },
    ],
};
