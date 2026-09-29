/**
 * Customer Analytics Data - Convection & Tailoring Business
 */

export interface CustomerDetailItem {
    id: string;
    name: string;
    companyOrOrg: string;
    type: 'B2B Korporat' | 'Instansi/Sekolah' | 'Retail/Komunitas' | 'Individu';
    contactPerson: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
    outstandingReceivable: number;
    lastOrderDate: string;
    loyaltyTier: 'Platinum' | 'Gold' | 'Silver' | 'Standard';
    repeatRatePercentage: number;
}

export interface CustomerAnalyticsData {
    summary: {
        totalCustomers: number;
        newCustomersThisMonth: number;
        activeCustomers: number;
        repeatCustomerRate: number; // 68.2%
        avgOrderFrequencyPerYear: number; // 3.8x
        avgOrderValue: number;
        totalReceivableCustomers: number;
        totalReceivableAmount: number;
    };
    customerSegments: {
        segment: string;
        count: number;
        revenue: number;
        percentage: number;
    }[];
    customerList: CustomerDetailItem[];
}

export const initialCustomerData: CustomerAnalyticsData = {
    summary: {
        totalCustomers: 142,
        newCustomersThisMonth: 18,
        activeCustomers: 54,
        repeatCustomerRate: 68.2,
        avgOrderFrequencyPerYear: 3.8,
        avgOrderValue: 1098214,
        totalReceivableCustomers: 12,
        totalReceivableAmount: 42600000,
    },
    customerSegments: [
        { segment: 'B2B Korporat & Pabrik', count: 32, revenue: 84500000, percentage: 45.8 },
        { segment: 'Instansi & Sekolah/Kampus', count: 28, revenue: 48200000, percentage: 26.1 },
        { segment: 'Komunitas, Olahraga & Event', count: 44, revenue: 32600000, percentage: 17.7 },
        { segment: 'Fashion Brand & Reseller', count: 38, revenue: 19200000, percentage: 10.4 },
    ],
    customerList: [
        {
            id: 'CUST-001',
            name: 'PT Samudera Logistik Jaya',
            companyOrOrg: 'Divisi HRD & Operasional',
            type: 'B2B Korporat',
            contactPerson: 'Bapak Hendra Gunawan',
            phone: '0812-8899-7711',
            totalOrders: 14,
            totalSpent: 96500000,
            avgOrderValue: 6892857,
            outstandingReceivable: 14200000,
            lastOrderDate: '2026-09-24',
            loyaltyTier: 'Platinum',
            repeatRatePercentage: 100,
        },
        {
            id: 'CUST-002',
            name: 'Yayasan Bina Prestasi (SMK 1)',
            companyOrOrg: 'Pengadaan Seragam Sekolah',
            type: 'Instansi/Sekolah',
            contactPerson: 'Ibu Dra. Hj. Nurjanah',
            phone: '0813-1122-3344',
            totalOrders: 8,
            totalSpent: 62400000,
            avgOrderValue: 7800000,
            outstandingReceivable: 0,
            lastOrderDate: '2026-09-20',
            loyaltyTier: 'Gold',
            repeatRatePercentage: 88,
        },
        {
            id: 'CUST-003',
            name: 'CV Sumber Makmur Abadi',
            companyOrOrg: 'Pengadaan Kaos Promosi & Event',
            type: 'B2B Korporat',
            contactPerson: 'Pak Kevin Sanjaya',
            phone: '0857-4455-6677',
            totalOrders: 11,
            totalSpent: 54100000,
            avgOrderValue: 4918181,
            outstandingReceivable: 9800000,
            lastOrderDate: '2026-09-26',
            loyaltyTier: 'Gold',
            repeatRatePercentage: 92,
        },
        {
            id: 'CUST-004',
            name: 'Boutique Siti Rahayu',
            companyOrOrg: 'Koleksi Busana Muslimah',
            type: 'Individu',
            contactPerson: 'Ibu Siti Rahayu',
            phone: '0811-9988-1234',
            totalOrders: 19,
            totalSpent: 48600000,
            avgOrderValue: 2557894,
            outstandingReceivable: 0,
            lastOrderDate: '2026-09-27',
            loyaltyTier: 'Platinum',
            repeatRatePercentage: 95,
        },
        {
            id: 'CUST-005',
            name: 'Komunitas Trail Runner Jakarta',
            companyOrOrg: 'Divisi Merchandise Komunitas',
            type: 'Retail/Komunitas',
            contactPerson: 'Mas Randy Pratama',
            phone: '0818-7766-5544',
            totalOrders: 5,
            totalSpent: 28400000,
            avgOrderValue: 5680000,
            outstandingReceivable: 6500000,
            lastOrderDate: '2026-09-18',
            loyaltyTier: 'Silver',
            repeatRatePercentage: 75,
        },
        {
            id: 'CUST-006',
            name: 'Klinik Medika Sehat Sentosa',
            companyOrOrg: 'Seragam Perawat & Baju Scrub',
            type: 'B2B Korporat',
            contactPerson: 'dr. Farah Anggraini',
            phone: '0821-3344-5566',
            totalOrders: 3,
            totalSpent: 16800000,
            avgOrderValue: 5600000,
            outstandingReceivable: 4800000,
            lastOrderDate: '2026-09-15',
            loyaltyTier: 'Silver',
            repeatRatePercentage: 66,
        },
    ],
};
