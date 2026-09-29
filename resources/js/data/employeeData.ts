/**
 * Employee & Tailor Productivity Analytics Data
 */

export interface EmployeeProductivityItem {
    id: string;
    nip: string;
    name: string;
    role: string;
    department: 'Cutting' | 'Sewing' | 'Obras' | 'Finishing' | 'QC' | 'Bordir/Sablon';
    attendanceRate: number; // 98%
    completedPcs: number;
    targetPcs: number;
    achievementRate: number; // %
    overtimeHours: number;
    defectPcs: number;
    defectRate: number; // %
    efficiencyRating: 'Sangat Baik (A+)' | 'Baik (A)' | 'Cukup (B)' | 'Perlu Supervisi (C)';
}

export interface DepartmentProductivity {
    department: string;
    staffCount: number;
    avgDailyPcs: number;
    targetDailyPcs: number;
    efficiencyRate: number;
    totalOvertimeHours: number;
}

export interface EmployeeAnalyticsData {
    summary: {
        totalActiveStaff: number;
        attendancePercentage: number;
        totalPcsCompleted: number;
        totalOvertimeHours: number;
        avgPcsPerTailorDaily: number;
        totalDefectPcs: number;
        avgDefectRate: number;
    };
    departmentProductivity: DepartmentProductivity[];
    employees: EmployeeProductivityItem[];
}

export const initialEmployeeData: EmployeeAnalyticsData = {
    summary: {
        totalActiveStaff: 24,
        attendancePercentage: 96.2,
        totalPcsCompleted: 5480,
        totalOvertimeHours: 142,
        avgPcsPerTailorDaily: 28.5,
        totalDefectPcs: 140,
        avgDefectRate: 2.5,
    },
    departmentProductivity: [
        { department: 'Pola & Potong (Cutting)', staffCount: 3, avgDailyPcs: 490, targetDailyPcs: 500, efficiencyRate: 98.0, totalOvertimeHours: 18 },
        { department: 'Jahit Utama (Sewing)', staffCount: 12, avgDailyPcs: 520, targetDailyPcs: 600, efficiencyRate: 86.7, totalOvertimeHours: 64 },
        { department: 'Obras & Jahit Tepi', staffCount: 3, avgDailyPcs: 410, targetDailyPcs: 400, efficiencyRate: 102.5, totalOvertimeHours: 16 },
        { department: 'Bordir & Sablon', staffCount: 2, avgDailyPcs: 340, targetDailyPcs: 350, efficiencyRate: 97.1, totalOvertimeHours: 22 },
        { department: 'Finishing, Setrika & QC', staffCount: 4, avgDailyPcs: 490, targetDailyPcs: 500, efficiencyRate: 98.0, totalOvertimeHours: 22 },
    ],
    employees: [
        {
            id: 'EMP-01',
            nip: 'TK-0101',
            name: 'Kang Asep Sudrajat (Regu A)',
            role: 'Lead Penjahit Kaos & Polo',
            department: 'Sewing',
            attendanceRate: 98.5,
            completedPcs: 680,
            targetPcs: 650,
            achievementRate: 104.6,
            overtimeHours: 12,
            defectPcs: 2,
            defectRate: 0.3,
            efficiencyRating: 'Sangat Baik (A+)',
        },
        {
            id: 'EMP-02',
            nip: 'TK-0102',
            name: 'Siti Aminah',
            role: 'Spesialis Kemeja Formal & Manset',
            department: 'Sewing',
            attendanceRate: 100.0,
            completedPcs: 420,
            targetPcs: 400,
            achievementRate: 105.0,
            overtimeHours: 8,
            defectPcs: 2,
            defectRate: 0.5,
            efficiencyRating: 'Sangat Baik (A+)',
        },
        {
            id: 'EMP-03',
            nip: 'TK-0103',
            name: 'Pak Joko Purnomo',
            role: 'Operator Bordir Komputer 12 Kepala',
            department: 'Bordir/Sablon',
            attendanceRate: 96.0,
            completedPcs: 850,
            targetPcs: 800,
            achievementRate: 106.2,
            overtimeHours: 14,
            defectPcs: 7,
            defectRate: 0.8,
            efficiencyRating: 'Baik (A)',
        },
        {
            id: 'EMP-04',
            nip: 'TK-0104',
            name: 'Budi Sutrisno',
            role: 'Spesialis Gamis & Busana Muslim',
            department: 'Sewing',
            attendanceRate: 94.0,
            completedPcs: 390,
            targetPcs: 400,
            achievementRate: 97.5,
            overtimeHours: 6,
            defectPcs: 4,
            defectRate: 1.0,
            efficiencyRating: 'Baik (A)',
        },
        {
            id: 'EMP-05',
            nip: 'TK-0105',
            name: 'Mas Doni Wibowo (Regu C)',
            role: 'Spesialis Jaket, Parka & Wearpack',
            department: 'Sewing',
            attendanceRate: 92.5,
            completedPcs: 300,
            targetPcs: 350,
            achievementRate: 85.7,
            overtimeHours: 16,
            defectPcs: 7,
            defectRate: 2.3,
            efficiencyRating: 'Cukup (B)',
        },
        {
            id: 'EMP-06',
            nip: 'TK-0106',
            name: 'Pak Rahmat Hidayat',
            role: 'Kepala Bagian Potong & Pola CAD',
            department: 'Cutting',
            attendanceRate: 98.0,
            completedPcs: 1450,
            targetPcs: 1400,
            achievementRate: 103.5,
            overtimeHours: 10,
            defectPcs: 3,
            defectRate: 0.2,
            efficiencyRating: 'Sangat Baik (A+)',
        },
        {
            id: 'EMP-07',
            nip: 'TK-0107',
            name: 'Ibu Endang Sri Lestari',
            role: 'Supervisor Quality Control (QC)',
            department: 'QC',
            attendanceRate: 100.0,
            completedPcs: 5480,
            targetPcs: 5500,
            achievementRate: 99.6,
            overtimeHours: 12,
            defectPcs: 0,
            defectRate: 0.0,
            efficiencyRating: 'Sangat Baik (A+)',
        },
    ],
};
