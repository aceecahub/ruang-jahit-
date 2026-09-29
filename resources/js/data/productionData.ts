/**
 * Production Analytics Data - Convection & Tailoring Business
 */

export interface ProductionStageDetail {
    stageId: 'cutting' | 'sewing' | 'obras' | 'finishing' | 'qc' | 'shipping';
    name: string;
    alias: string;
    activePcs: number;
    activeOrders: number;
    targetDailyPcs: number;
    actualDailyPcs: number;
    leadTimeDays: number;
    status: 'optimal' | 'normal' | 'bottleneck' | 'waiting';
    statusLabel: string;
}

export interface ProductionOrderItem {
    orderNumber: string;
    customerName: string;
    productName: string;
    category: string;
    targetPcs: number;
    completedPcs: number;
    progressPercentage: number;
    deadline: string;
    currentStage: string;
    status: 'Dalam Antrean' | 'Sedang Dipotong' | 'Sedang Dijahit' | 'Obras & Bordir' | 'Finishing & QC' | 'Siap Dikirim' | 'Terlambat';
    priority: 'Normal' | 'Tinggi' | 'Urgent';
}

export interface ProductionAnalyticsData {
    summary: {
        totalTargetPcs: number;
        totalActualPcs: number;
        achievementRate: number;
        inProgressOrders: number;
        inProgressPcs: number;
        completedOrders: number;
        completedPcs: number;
        overdueOrders: number;
        overduePcs: number;
        avgLeadTimeDays: number;
        defectivePcs: number;
        reworkPcs: number;
        reworkRate: number;
    };
    stages: ProductionStageDetail[];
    orders: ProductionOrderItem[];
}

export const initialProductionData: ProductionAnalyticsData = {
    summary: {
        totalTargetPcs: 6000,
        totalActualPcs: 5480,
        achievementRate: 91.3,
        inProgressOrders: 46,
        inProgressPcs: 1920,
        completedOrders: 114,
        completedPcs: 3680,
        overdueOrders: 5,
        overduePcs: 160,
        avgLeadTimeDays: 4.8,
        defectivePcs: 140,
        reworkPcs: 85,
        reworkRate: 1.5,
    },
    stages: [
        {
            stageId: 'cutting',
            name: 'Pola & Potong (Cutting)',
            alias: 'Gelar kain, jiplak pola CAD & potong mesin',
            activePcs: 450,
            activeOrders: 11,
            targetDailyPcs: 500,
            actualDailyPcs: 490,
            leadTimeDays: 1.2,
            status: 'optimal',
            statusLabel: 'Lancar & Terkontrol',
        },
        {
            stageId: 'sewing',
            name: 'Jahit Utama (Sewing)',
            alias: 'Perakitan badan, pasang kerah & manset',
            activePcs: 780,
            activeOrders: 18,
            targetDailyPcs: 600,
            actualDailyPcs: 520,
            leadTimeDays: 3.2,
            status: 'bottleneck',
            statusLabel: 'Beban Padat (Overload)',
        },
        {
            stageId: 'obras',
            name: 'Obras & Jahit Tepi',
            alias: 'Kelim, obras 5 benang & pasang elastik',
            activePcs: 260,
            activeOrders: 8,
            targetDailyPcs: 400,
            actualDailyPcs: 410,
            leadTimeDays: 1.0,
            status: 'normal',
            statusLabel: 'Kapasitas Normal',
        },
        {
            stageId: 'finishing',
            name: 'Finishing & Steam',
            alias: 'Buang benang, pasang kancing & setrika uap',
            activePcs: 220,
            activeOrders: 6,
            targetDailyPcs: 450,
            actualDailyPcs: 440,
            leadTimeDays: 0.8,
            status: 'optimal',
            statusLabel: 'Lancar',
        },
        {
            stageId: 'qc',
            name: 'Quality Control (QC)',
            alias: 'Uji dimensi ukuran, periksa jahitan & kelolosan',
            activePcs: 120,
            activeOrders: 4,
            targetDailyPcs: 500,
            actualDailyPcs: 490,
            leadTimeDays: 0.5,
            status: 'optimal',
            statusLabel: 'Lancar & Teliti',
        },
        {
            stageId: 'shipping',
            name: 'Packing & Pengiriman',
            alias: 'Lipat rapi, plastik opp, labelling & kurir',
            activePcs: 90,
            activeOrders: 3,
            targetDailyPcs: 300,
            actualDailyPcs: 300,
            leadTimeDays: 0.3,
            status: 'normal',
            statusLabel: 'Siap Kirim',
        },
    ],
    orders: [
        {
            orderNumber: 'ORD-2026-0881',
            customerName: 'PT Samudera Logistik Jaya',
            productName: 'Kemeja Kantor Drill Kombinasi Batik',
            category: 'Kemeja',
            targetPcs: 300,
            completedPcs: 270,
            progressPercentage: 90,
            deadline: '2026-10-02',
            currentStage: 'Finishing & QC',
            status: 'Finishing & QC',
            priority: 'Tinggi',
        },
        {
            orderNumber: 'ORD-2026-0882',
            customerName: 'Yayasan Bina Prestasi (SMK 1)',
            productName: 'Seragam Praktik Wearpack Otomotif',
            category: 'Wearpack',
            targetPcs: 250,
            completedPcs: 150,
            progressPercentage: 60,
            deadline: '2026-10-04',
            currentStage: 'Sedang Dijahit',
            status: 'Sedang Dijahit',
            priority: 'Tinggi',
        },
        {
            orderNumber: 'ORD-2026-0883',
            customerName: 'CV Sumber Makmur Abadi',
            productName: 'Kaos Polo Lacoste Katun CVC 24s',
            category: 'Kaos Polo',
            targetPcs: 500,
            completedPcs: 500,
            progressPercentage: 100,
            deadline: '2026-10-01',
            currentStage: 'Packing & Pengiriman',
            status: 'Siap Dikirim',
            priority: 'Normal',
        },
        {
            orderNumber: 'ORD-2026-0884',
            customerName: 'Komunitas Trail Runner Jkt',
            productName: 'Jersey Dryfit Milano Sublimasi Fullprint',
            category: 'Jersey',
            targetPcs: 180,
            completedPcs: 72,
            progressPercentage: 40,
            deadline: '2026-09-28',
            currentStage: 'Sedang Dijahit',
            status: 'Terlambat',
            priority: 'Urgent',
        },
        {
            orderNumber: 'ORD-2026-0885',
            customerName: 'Boutique Siti Rahayu',
            productName: 'Gamis Set Rayon Twill Premium Busui',
            category: 'Gamis',
            targetPcs: 120,
            completedPcs: 96,
            progressPercentage: 80,
            deadline: '2026-10-05',
            currentStage: 'Obras & Bordir',
            status: 'Obras & Bordir',
            priority: 'Normal',
        },
        {
            orderNumber: 'ORD-2026-0886',
            customerName: 'Bank Daerah KC Utama',
            productName: 'Blazer Kerja Semi Wool Full Furing',
            category: 'Jas/Blazer',
            targetPcs: 80,
            completedPcs: 20,
            progressPercentage: 25,
            deadline: '2026-10-10',
            currentStage: 'Pola & Potong',
            status: 'Sedang Dipotong',
            priority: 'Normal',
        },
        {
            orderNumber: 'ORD-2026-0887',
            customerName: 'Alumni SMAN 5 Angkatan 2004',
            productName: 'Jaket Bomber Taslan Water Resistant',
            category: 'Jaket',
            targetPcs: 150,
            completedPcs: 0,
            progressPercentage: 5,
            deadline: '2026-10-14',
            currentStage: 'Dalam Antrean',
            status: 'Dalam Antrean',
            priority: 'Normal',
        },
    ],
};
