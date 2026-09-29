/**
 * Quality Control & Delivery Analytics Data
 */

export interface DefectTypeBreakdown {
    defectName: string;
    count: number;
    percentage: number;
    severity: 'Ringan (Bisa Rework)' | 'Sedang' | 'Berat (Kain Rusak)';
}

export interface RecentDeliveryItem {
    trackingNumber: string;
    orderNumber: string;
    customerName: string;
    itemDesc: string;
    pcs: number;
    courier: string;
    shippedDate: string;
    deliveryStatus: 'Tiba Tepat Waktu' | 'Dalam Perjalanan' | 'Terlambat Dikirim' | 'Menunggu Pickup';
    delayDays: number;
}

export interface QualityDeliveryAnalyticsData {
    quality: {
        totalInspectedPcs: number;
        passedQcPcs: number;
        failedQcPcs: number;
        defectRate: number; // 2.5%
        reworkedPcs: number;
        scrappedPcs: number;
        defectTypes: DefectTypeBreakdown[];
    };
    delivery: {
        totalOrdersShipped: number;
        onTimeOrders: number;
        delayedOrders: number;
        onTimeRate: number; // 93.0%
        avgDelayDays: number; // 1.8 days
        readyToShipPendingOrders: number;
        readyToShipPendingPcs: number;
        recentDeliveries: RecentDeliveryItem[];
    };
}

export const initialQualityDeliveryData: QualityDeliveryAnalyticsData = {
    quality: {
        totalInspectedPcs: 5620,
        passedQcPcs: 5480,
        failedQcPcs: 140,
        defectRate: 2.5,
        reworkedPcs: 85,
        scrappedPcs: 55,
        defectTypes: [
            { defectName: 'Jahitan Loncat / Benang Kendur', count: 52, percentage: 37.1, severity: 'Ringan (Bisa Rework)' },
            { defectName: 'Dimensi Selisih Toleransi (> 1.5 cm)', count: 34, percentage: 24.3, severity: 'Sedang' },
            { defectName: 'Noda Minyak Mesin Jahit', count: 24, percentage: 17.1, severity: 'Ringan (Bisa Rework)' },
            { defectName: 'Puckering / Kain Mengkerut', count: 18, percentage: 12.9, severity: 'Sedang' },
            { defectName: 'Cacat Anyaman / Serat Kain Cacat', count: 12, percentage: 8.6, severity: 'Berat (Kain Rusak)' },
        ],
    },
    delivery: {
        totalOrdersShipped: 114,
        onTimeOrders: 106,
        delayedOrders: 8,
        onTimeRate: 93.0,
        avgDelayDays: 1.8,
        readyToShipPendingOrders: 12,
        readyToShipPendingPcs: 420,
        recentDeliveries: [
            { trackingNumber: 'JNE-CGK-88192', orderNumber: 'ORD-2026-0870', customerName: 'PT Samudera Logistik Jaya', itemDesc: '200 Pcs Kemeja Kerja', pcs: 200, courier: 'JNE Trucking', shippedDate: '2026-09-27', deliveryStatus: 'Tiba Tepat Waktu', delayDays: 0 },
            { trackingNumber: 'SICEPAT-00912', orderNumber: 'ORD-2026-0872', customerName: 'Yayasan Bina Prestasi (SMK 1)', itemDesc: '180 Pcs Wearpack', pcs: 180, courier: 'Kurir Internal Workshop', shippedDate: '2026-09-26', deliveryStatus: 'Tiba Tepat Waktu', delayDays: 0 },
            { trackingNumber: 'LALAMOVE-9912', orderNumber: 'ORD-2026-0875', customerName: 'Boutique Siti Rahayu', itemDesc: '80 Pcs Gamis Muslimah', pcs: 80, courier: 'Lalamove Van', shippedDate: '2026-09-28', deliveryStatus: 'Tiba Tepat Waktu', delayDays: 0 },
            { trackingNumber: 'JNT-EXP-11293', orderNumber: 'ORD-2026-0865', customerName: 'Komunitas Trail Runner Jkt', itemDesc: '150 Pcs Jersey Dryfit', pcs: 150, courier: 'J&T Cargo', shippedDate: '2026-09-25', deliveryStatus: 'Terlambat Dikirim', delayDays: 2 },
            { trackingNumber: 'INTRN-STAGING', orderNumber: 'ORD-2026-0883', customerName: 'CV Sumber Makmur Abadi', itemDesc: '500 Pcs Kaos Polo', pcs: 500, courier: 'Armada Workshop', shippedDate: '2026-10-01', deliveryStatus: 'Menunggu Pickup', delayDays: 0 },
        ],
    },
};
