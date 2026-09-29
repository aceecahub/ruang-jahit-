<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Search,
    Download,
    Eye,
    TrendingUp,
    TrendingDown,
    Clock,
    AlertTriangle,
    CheckCircle2,
    ShoppingBag,
    Boxes,
    Banknote,
    Layers,
    Users,
    Filter,
    ArrowUpDown,
    X,
} from '@lucide/vue';
import KpiCard from './KpiCard.vue';
import {
    type OrderRecord,
    DUMMY_ORDERS_DATA,
    ORDER_STATUS_MAP,
    ORDER_TYPE_LABELS,
    TODAY_DATE,
    calculateOrderKpis,
    isOrderActive,
    isOrderCompleted,
    isOrderOverdue,
    isOrderApproaching,
    exportOrdersToCsv,
} from '@/data/orderData';
import { formatNumber, formatRupiah, formatDateIndo } from '@/lib/formatters';
import { toast } from 'vue-sonner';

// Sheet (Drawer) Components for Detail Orderan
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';

// Chart.js Components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'vue-chartjs';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const props = defineProps<{
    isDark?: boolean;
}>();

// --- 1. Filter Periode State ---
type PeriodPreset = 'today' | 'this_week' | 'this_month' | 'this_year' | 'custom';
const activePreset = ref<PeriodPreset>('this_month');

// Date ranges
const startDate = ref<string>('2026-09-01');
const endDate = ref<string>('2026-09-30');

// Temp inputs for custom date picker
const customStartInput = ref<string>('2026-09-10');
const customEndInput = ref<string>('2026-09-25');

// Navigation state offset
const periodOffset = ref(0);

// Helper to set preset dates based on reference TODAY_DATE ('2026-09-29')
function applyPreset(preset: PeriodPreset) {
    activePreset.value = preset;
    periodOffset.value = 0;

    const base = new Date(TODAY_DATE);

    if (preset === 'today') {
        startDate.value = TODAY_DATE;
        endDate.value = TODAY_DATE;
    } else if (preset === 'this_week') {
        // Monday of current week
        const day = base.getDay();
        const diffToMon = day === 0 ? -6 : 1 - day;
        const mon = new Date(base);
        mon.setDate(base.getDate() + diffToMon);
        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);

        startDate.value = mon.toISOString().slice(0, 10);
        endDate.value = sun.toISOString().slice(0, 10);
    } else if (preset === 'this_month') {
        const y = base.getFullYear();
        const m = String(base.getMonth() + 1).padStart(2, '0');
        const lastDay = new Date(y, base.getMonth() + 1, 0).getDate();

        startDate.value = `${y}-${m}-01`;
        endDate.value = `${y}-${m}-${lastDay}`;
    } else if (preset === 'this_year') {
        const y = base.getFullYear();
        startDate.value = `${y}-01-01`;
        endDate.value = `${y}-12-31`;
    } else if (preset === 'custom') {
        startDate.value = customStartInput.value;
        endDate.value = customEndInput.value;
    }
}

// Custom Date Range Submit & Reset
function applyCustomRange() {
    if (customStartInput.value > customEndInput.value) {
        toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
        return;
    }
    activePreset.value = 'custom';
    startDate.value = customStartInput.value;
    endDate.value = customEndInput.value;
    toast.success('Rentang tanggal khusus berhasil diterapkan');
}

function resetPeriod() {
    activePreset.value = 'this_month';
    customStartInput.value = '2026-09-10';
    customEndInput.value = '2026-09-25';
    applyPreset('this_month');
    toast.info('Filter periode dikembalikan ke Bulan Ini');
}

// Period navigation (Previous / Next)
function navigatePeriod(direction: -1 | 1) {
    if (activePreset.value === 'custom') return;
    periodOffset.value += direction;

    const base = new Date(TODAY_DATE);

    if (activePreset.value === 'today') {
        base.setDate(base.getDate() + periodOffset.value);
        const str = base.toISOString().slice(0, 10);
        startDate.value = str;
        endDate.value = str;
    } else if (activePreset.value === 'this_week') {
        const day = base.getDay();
        const diffToMon = (day === 0 ? -6 : 1 - day) + periodOffset.value * 7;
        const mon = new Date(base);
        mon.setDate(base.getDate() + diffToMon);
        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);

        startDate.value = mon.toISOString().slice(0, 10);
        endDate.value = sun.toISOString().slice(0, 10);
    } else if (activePreset.value === 'this_month') {
        const targetDate = new Date(base.getFullYear(), base.getMonth() + periodOffset.value, 1);
        const y = targetDate.getFullYear();
        const m = String(targetDate.getMonth() + 1).padStart(2, '0');
        const lastDay = new Date(y, targetDate.getMonth() + 1, 0).getDate();

        startDate.value = `${y}-${m}-01`;
        endDate.value = `${y}-${m}-${lastDay}`;
    } else if (activePreset.value === 'this_year') {
        const y = base.getFullYear() + periodOffset.value;
        startDate.value = `${y}-01-01`;
        endDate.value = `${y}-12-31`;
    }
}

// --- 2. Filtered Dataset by Date Range ---
const filteredOrdersByPeriod = computed(() => {
    return DUMMY_ORDERS_DATA.filter((o) => {
        return o.tgl_order >= startDate.value && o.tgl_order <= endDate.value;
    });
});

// Calculate Previous Equivalent Period for Growth KPI Comparison
const previousPeriodKpis = computed(() => {
    // Determine span length in milliseconds
    const start = new Date(startDate.value).getTime();
    const end = new Date(endDate.value).getTime();
    const duration = end - start + 86400000;

    const prevEnd = new Date(start - 86400000);
    const prevStart = new Date(start - duration);

    const prevStartStr = prevStart.toISOString().slice(0, 10);
    const prevEndStr = prevEnd.toISOString().slice(0, 10);

    const prevOrders = DUMMY_ORDERS_DATA.filter((o) => o.tgl_order >= prevStartStr && o.tgl_order <= prevEndStr);
    return calculateOrderKpis(prevOrders, TODAY_DATE);
});

// Dynamic Current Period KPIs
const currentKpis = computed(() => {
    return calculateOrderKpis(filteredOrdersByPeriod.value, TODAY_DATE);
});

// Growth calculator helper
function calculateGrowth(current: number, previous: number): number | undefined {
    if (!previous || previous <= 0) return undefined;
    const growth = ((current - previous) / previous) * 100;
    return Number(growth.toFixed(1));
}

// --- 3. Table Filters, Sorting & Pagination ---
const tableSearch = ref('');
const statusFilter = ref('ALL');
const typeFilter = ref('ALL');
const sortBy = ref<'tgl_order' | 'total_jual' | 'total_qty' | 'tgl_estimasi'>('tgl_order');
const sortOrder = ref<'asc' | 'desc'>('desc');
const perPage = ref(10);
const currentPage = ref(1);

function toggleSort(col: 'tgl_order' | 'total_jual' | 'total_qty' | 'tgl_estimasi') {
    if (sortBy.value === col) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy.value = col;
        sortOrder.value = 'desc';
    }
}

// Filtered and Sorted Orders for Table
const tableOrders = computed(() => {
    let result = [...filteredOrdersByPeriod.value];

    // Search query
    if (tableSearch.value) {
        const q = tableSearch.value.toLowerCase();
        result = result.filter((o) => {
            return (
                o.no_order.toLowerCase().includes(q) ||
                (o.no_po && o.no_po.toLowerCase().includes(q)) ||
                o.nm_cus.toLowerCase().includes(q) ||
                o.kd_cus.toLowerCase().includes(q)
            );
        });
    }

    // Status filter
    if (statusFilter.value !== 'ALL') {
        result = result.filter((o) => String(o.status) === statusFilter.value);
    }

    // Type filter
    if (typeFilter.value !== 'ALL') {
        result = result.filter((o) => o.jenis_order === typeFilter.value);
    }

    // Sorting
    result.sort((a, b) => {
        let valA = a[sortBy.value];
        let valB = b[sortBy.value];

        if (typeof valA === 'string') {
            return sortOrder.value === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
        }
        return sortOrder.value === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    return result;
});

// Pagination slices
const totalPages = computed(() => Math.ceil(tableOrders.value.length / perPage.value) || 1);
const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return tableOrders.value.slice(start, start + perPage.value);
});

watch([tableSearch, statusFilter, typeFilter, perPage, startDate, endDate], () => {
    currentPage.value = 1;
});

// CSV Export
function triggerCsvExport() {
    if (filteredOrdersByPeriod.value.length === 0) {
        toast.warning('Tidak ada orderan pada periode ini untuk diekspor.');
        return;
    }
    const csvContent = exportOrdersToCsv(filteredOrdersByPeriod.value);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Orderan_${startDate.value}_sd_${endDate.value}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('File CSV orderan berhasil diunduh!');
}

// --- 4. Charts Configurations (Dynamically Fed by Filtered Orders) ---
// A. Tren Orderan (Grouped by date or week)
const orderTrendChartData = computed(() => {
    const countsMap: Record<string, number> = {};
    // Sort dates
    const sorted = [...filteredOrdersByPeriod.value].sort((a, b) => a.tgl_order.localeCompare(b.tgl_order));

    for (const o of sorted) {
        countsMap[o.tgl_order] = (countsMap[o.tgl_order] || 0) + 1;
    }

    const labels = Object.keys(countsMap).map((d) => formatDateIndo(d));
    const data = Object.values(countsMap);

    return {
        labels: labels.length ? labels : ['Tidak Ada Data'],
        datasets: [
            {
                label: 'Jumlah Orderan',
                data: data.length ? data : [0],
                borderColor: '#2563eb',
                backgroundColor: props.isDark ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#2563eb',
            },
        ],
    };
});

// B. Tren Penjualan dan HPP
const salesHppChartData = computed(() => {
    const datesMap: Record<string, { jual: number; hpp: number; laba: number }> = {};
    const sorted = [...filteredOrdersByPeriod.value].sort((a, b) => a.tgl_order.localeCompare(b.tgl_order));

    for (const o of sorted) {
        if (!datesMap[o.tgl_order]) {
            datesMap[o.tgl_order] = { jual: 0, hpp: 0, laba: 0 };
        }
        datesMap[o.tgl_order].jual += o.total_jual;
        datesMap[o.tgl_order].hpp += o.tot_hpp;
        datesMap[o.tgl_order].laba += o.total_jual - o.tot_hpp;
    }

    const labels = Object.keys(datesMap).map((d) => formatDateIndo(d));
    const jualData = Object.values(datesMap).map((v) => v.jual);
    const hppData = Object.values(datesMap).map((v) => v.hpp);
    const labaData = Object.values(datesMap).map((v) => v.laba);

    return {
        labels: labels.length ? labels : ['Tidak Ada Data'],
        datasets: [
            {
                label: 'Penjualan (Rp)',
                data: jualData.length ? jualData : [0],
                backgroundColor: '#2563eb',
                borderRadius: 6,
                barPercentage: 0.6,
            },
            {
                label: 'HPP (Rp)',
                data: hppData.length ? hppData : [0],
                backgroundColor: props.isDark ? '#475569' : '#cbd5e1',
                borderRadius: 6,
                barPercentage: 0.6,
            },
            {
                label: 'Laba Kotor (Rp)',
                data: labaData.length ? labaData : [0],
                backgroundColor: '#10b981',
                borderRadius: 6,
                barPercentage: 0.6,
            },
        ],
    };
});

// C. Distribusi Status Orderan
const statusDistributionData = computed(() => {
    const statusCounts: Record<string, number> = {};
    for (const o of filteredOrdersByPeriod.value) {
        const code = String(o.status);
        statusCounts[code] = (statusCounts[code] || 0) + 1;
    }

    const labels = Object.keys(ORDER_STATUS_MAP).map((k) => ORDER_STATUS_MAP[k].label);
    const colors = Object.keys(ORDER_STATUS_MAP).map((k) => ORDER_STATUS_MAP[k].color);
    const data = Object.keys(ORDER_STATUS_MAP).map((k) => statusCounts[k] || 0);

    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: props.isDark ? '#0f172a' : '#ffffff',
            },
        ],
    };
});

// D. Distribusi Jenis Order
const orderTypeDistributionData = computed(() => {
    const typeCounts: Record<string, number> = {};
    for (const o of filteredOrdersByPeriod.value) {
        typeCounts[o.jenis_order] = (typeCounts[o.jenis_order] || 0) + 1;
    }

    const labels = ORDER_TYPE_LABELS;
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
    const data = labels.map((l) => typeCounts[l] || 0);

    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: props.isDark ? '#0f172a' : '#ffffff',
            },
        ],
    };
});

// Common minimal chart options
const barChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
            align: 'end' as const,
            labels: {
                color: props.isDark ? '#cbd5e1' : '#64748b',
                boxWidth: 8,
                padding: 10,
                font: { size: 11 },
            },
        },
        tooltip: {
            backgroundColor: props.isDark ? '#0f172a' : '#ffffff',
            titleColor: props.isDark ? '#f8fafc' : '#0f172a',
            bodyColor: props.isDark ? '#cbd5e1' : '#475569',
            borderColor: props.isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            callbacks: {
                label: (ctx: any) => ` ${ctx.dataset.label}: ${formatRupiah(ctx.parsed.y)}`,
            },
        },
    },
    scales: {
        y: {
            grid: { color: props.isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(241, 245, 249, 1)' },
            ticks: {
                color: props.isDark ? '#64748b' : '#94a3b8',
                callback: (v: any) => `Rp ${(v / 1000000).toFixed(0)}jt`,
                font: { size: 10 },
            },
            border: { display: false },
        },
        x: {
            grid: { display: false },
            ticks: { color: props.isDark ? '#94a3b8' : '#64748b', font: { size: 10 } },
            border: { display: false },
        },
    },
}));

const donutChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                color: props.isDark ? '#cbd5e1' : '#64748b',
                boxWidth: 8,
                padding: 10,
                font: { size: 10 },
            },
        },
    },
}));

// E. Pelanggan dengan Orderan Terbanyak (Top Customers)
const topCustomers = computed(() => {
    const custMap: Record<string, { nm_cus: string; orderCount: number; totalQty: number; totalJual: number }> = {};

    for (const o of filteredOrdersByPeriod.value) {
        if (!custMap[o.kd_cus]) {
            custMap[o.kd_cus] = { nm_cus: o.nm_cus, orderCount: 0, totalQty: 0, totalJual: 0 };
        }
        custMap[o.kd_cus].orderCount += 1;
        custMap[o.kd_cus].totalQty += o.total_qty;
        custMap[o.kd_cus].totalJual += o.total_jual;
    }

    return Object.values(custMap)
        .sort((a, b) => b.totalJual - a.totalJual)
        .slice(0, 5);
});

// --- 5. Detail Order Drawer (Sheet) ---
const isDetailOpen = ref(false);
const selectedOrder = ref<OrderRecord | null>(null);

function openOrderDetail(order: OrderRecord) {
    selectedOrder.value = order;
    isDetailOpen.value = true;
}
</script>

<template>
    <div class="space-y-6">

        <!-- =========================================================================================
             2. FILTER PERIODE WAKTU — FITUR UTAMA (Core Time Filter Bar)
             ========================================================================================= -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 shadow-sm shadow-slate-200/40 dark:shadow-none space-y-4">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <!-- Quick Preset Toggles -->
                <div class="flex flex-wrap items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-xl">
                    <button
                        v-for="p in [
                            { key: 'today', label: 'Hari Ini' },
                            { key: 'this_week', label: 'Minggu Ini' },
                            { key: 'this_month', label: 'Bulan Ini' },
                            { key: 'this_year', label: 'Tahun Ini' },
                            { key: 'custom', label: 'Rentang Khusus' },
                        ]"
                        :key="p.key"
                        type="button"
                        @click="applyPreset(p.key as any)"
                        class="px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer"
                        :class="[
                            activePreset === p.key
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        ]"
                    >
                        {{ p.label }}
                    </button>
                </div>

                <!-- Navigation Previous / Next & Active Label -->
                <div class="flex flex-wrap items-center gap-2.5">
                    <!-- Previous Button -->
                    <button
                        type="button"
                        @click="navigatePeriod(-1)"
                        :disabled="activePreset === 'custom'"
                        title="Periode Sebelumnya"
                        class="p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs transition"
                    >
                        <ChevronLeft class="h-4 w-4" />
                    </button>

                    <!-- Active Period Text Display -->
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 text-xs font-bold text-blue-700 dark:text-blue-300">
                        <Calendar class="h-3.5 w-3.5" />
                        <span>Periode: {{ formatDateIndo(startDate) }} – {{ formatDateIndo(endDate) }}</span>
                    </div>

                    <!-- Next Button -->
                    <button
                        type="button"
                        @click="navigatePeriod(1)"
                        :disabled="activePreset === 'custom'"
                        title="Periode Berikutnya"
                        class="p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs transition"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </button>

                    <!-- Reset to default -->
                    <button
                        type="button"
                        @click="resetPeriod"
                        title="Kembali ke Bulan Ini"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-xs transition"
                    >
                        <RotateCcw class="h-3.5 w-3.5" />
                        Reset
                    </button>
                </div>
            </div>

            <!-- Custom Date Range Form (when activePreset === 'custom') -->
            <div
                v-if="activePreset === 'custom'"
                class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 animate-in fade-in duration-200"
            >
                <div class="flex items-center gap-2 text-xs">
                    <span class="text-slate-500 font-medium">Tanggal Mulai:</span>
                    <input
                        type="date"
                        v-model="customStartInput"
                        class="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div class="flex items-center gap-2 text-xs">
                    <span class="text-slate-500 font-medium">Tanggal Akhir:</span>
                    <input
                        type="date"
                        v-model="customEndInput"
                        class="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="button"
                    @click="applyCustomRange"
                    class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                    Terapkan Rentang
                </button>
            </div>
        </section>

        <!-- =========================================================================================
             3. KPI DASHBOARD (Dihitung Dinamis Sesuai Periode Terpilih)
             ========================================================================================= -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- 1. Total Orderan -->
            <KpiCard
                title="Total Orderan Masuk"
                :value="currentKpis.totalOrders"
                unit="Order"
                type="number"
                :change="calculateGrowth(currentKpis.totalOrders, previousPeriodKpis.totalOrders)"
                :is-positive="(calculateGrowth(currentKpis.totalOrders, previousPeriodKpis.totalOrders) ?? 0) >= 0"
                period-text="Berdasarkan tgl_order periode"
                tooltip="Jumlah total lembar pesanan masuk pada periode yang dipilih."
                :icon="ShoppingBag"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />

            <!-- 2. Orderan Aktif -->
            <KpiCard
                title="Orderan Aktif (Dalam Proses)"
                :value="currentKpis.activeOrders"
                unit="Order"
                type="number"
                :change="calculateGrowth(currentKpis.activeOrders, previousPeriodKpis.activeOrders)"
                :is-positive="true"
                period-text="Potong, jahit & QC"
                tooltip="Pesanan dengan status antrean, jahit, atau finishing yang belum selesai."
                :icon="Clock"
                icon-bg="bg-indigo-50 dark:bg-indigo-950/40"
                icon-color="text-indigo-600 dark:text-indigo-400"
            />

            <!-- 3. Orderan Selesai -->
            <KpiCard
                title="Orderan Selesai"
                :value="currentKpis.completedOrders"
                unit="Order"
                type="number"
                :change="calculateGrowth(currentKpis.completedOrders, previousPeriodKpis.completedOrders)"
                :is-positive="true"
                period-text="100% tuntas siap kirim"
                tooltip="Pesanan berstatus Selesai & Siap Kirim pada periode ini."
                :icon="CheckCircle2"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />

            <!-- 4. Orderan Terlambat -->
            <KpiCard
                title="Orderan Terlambat"
                :value="currentKpis.overdueOrders"
                unit="Order"
                type="number"
                :change="calculateGrowth(currentKpis.overdueOrders, previousPeriodKpis.overdueOrders)"
                :is-positive="(calculateGrowth(currentKpis.overdueOrders, previousPeriodKpis.overdueOrders) ?? 0) <= 0"
                period-text="Melewati tgl_estimasi"
                tooltip="Pesanan aktif yang tanggal estimasi selesainya sudah terlewati."
                :icon="AlertTriangle"
                icon-bg="bg-rose-50 dark:bg-rose-950/40"
                icon-color="text-rose-600 dark:text-rose-400"
            />

            <!-- 5. Total Kuantitas -->
            <KpiCard
                title="Total Kuantitas Pesanan"
                :value="currentKpis.totalQty"
                unit="Pcs"
                type="number"
                :change="calculateGrowth(currentKpis.totalQty, previousPeriodKpis.totalQty)"
                :is-positive="(calculateGrowth(currentKpis.totalQty, previousPeriodKpis.totalQty) ?? 0) >= 0"
                period-text="Akumulasi total_qty pakaian"
                tooltip="Jumlah total fisik pakaian yang dipesan pelanggan."
                :icon="Boxes"
                icon-bg="bg-purple-50 dark:bg-purple-950/40"
                icon-color="text-purple-600 dark:text-purple-400"
            />

            <!-- 6. Total Penjualan -->
            <KpiCard
                title="Total Nilai Penjualan"
                :value="currentKpis.totalJual"
                type="currency"
                :change="calculateGrowth(currentKpis.totalJual, previousPeriodKpis.totalJual)"
                :is-positive="(calculateGrowth(currentKpis.totalJual, previousPeriodKpis.totalJual) ?? 0) >= 0"
                period-text="Akumulasi total_jual pesanan"
                tooltip="Total omzet kotor dari seluruh orderan terfilter."
                :icon="Banknote"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />

            <!-- 7. Total HPP -->
            <KpiCard
                title="Total HPP Produksi"
                :value="currentKpis.totalHpp"
                type="currency"
                :change="calculateGrowth(currentKpis.totalHpp, previousPeriodKpis.totalHpp)"
                :is-positive="true"
                period-text="Akumulasi tot_hpp bahan & jahit"
                tooltip="Total modal bahan baku kain dan upah tenaga kerja penjahit."
                :icon="Layers"
                icon-bg="bg-slate-100 dark:bg-slate-800"
                icon-color="text-slate-600 dark:text-slate-300"
            />

            <!-- 8. Estimasi Laba Kotor -->
            <KpiCard
                title="Estimasi Laba Kotor"
                :value="currentKpis.labaKotor"
                type="currency"
                :change="Number(currentKpis.marginLabaKotor.toFixed(1))"
                :is-positive="true"
                :period-text="`Margin Laba: ${currentKpis.marginLabaKotor.toFixed(1)}%`"
                tooltip="Selisih total_jual dikurangi tot_hpp pada periode ini."
                :icon="TrendingUp"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />

        </section>

        <!-- =========================================================================================
             4. GRAFIK DAN ANALITIK ORDERAN (2 Baris x 2 Kolom)
             ========================================================================================= -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            <!-- A. Tren Orderan (6 Kolom) -->
            <div class="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Tren Kuantitas Orderan Masuk</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Frekuensi orderan harian berdasarkan tgl_order</p>
                        </div>
                        <span class="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
                            {{ currentKpis.totalOrders }} Order
                        </span>
                    </div>

                    <div class="h-[250px] w-full mt-4">
                        <Line :data="orderTrendChartData" :options="barChartOptions" />
                    </div>
                </div>
            </div>

            <!-- B. Tren Penjualan dan HPP (6 Kolom) -->
            <div class="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Perbandingan Penjualan vs HPP & Laba</h2>
                            <p class="text-xs text-slate-400 mt-0.5">total_jual vs tot_hpp vs laba kotor</p>
                        </div>
                        <span class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                            {{ formatRupiah(currentKpis.labaKotor) }}
                        </span>
                    </div>

                    <div class="h-[250px] w-full mt-4">
                        <Bar :data="salesHppChartData" :options="barChartOptions" />
                    </div>
                </div>
            </div>

        </section>

        <!-- Baris Grafik Kedua: Distribusi Status, Jenis Order, dan Top Pelanggan -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <!-- C. Distribusi Status Orderan -->
            <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 class="text-sm font-bold text-slate-900 dark:text-white">Distribusi Status Orderan</h3>
                        <span class="text-xs text-slate-400">{{ filteredOrdersByPeriod.length }} Item</span>
                    </div>
                    <div class="h-[230px] w-full mt-3">
                        <Doughnut :data="statusDistributionData" :options="donutChartOptions" />
                    </div>
                </div>
            </div>

            <!-- D. Distribusi Jenis Order -->
            <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 class="text-sm font-bold text-slate-900 dark:text-white">Distribusi Jenis Order</h3>
                        <span class="text-xs text-slate-400">Kategori</span>
                    </div>
                    <div class="h-[230px] w-full mt-3">
                        <Doughnut :data="orderTypeDistributionData" :options="donutChartOptions" />
                    </div>
                </div>
            </div>

            <!-- E. Pelanggan dengan Orderan Terbanyak -->
            <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 class="text-sm font-bold text-slate-900 dark:text-white">Pelanggan Terbanyak</h3>
                        <Users class="h-4 w-4 text-slate-400" />
                    </div>

                    <div class="mt-3 space-y-2.5">
                        <div
                            v-for="(c, idx) in topCustomers"
                            :key="c.nm_cus"
                            class="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50 flex items-center justify-between text-xs"
                        >
                            <div class="min-w-0 pr-2">
                                <span class="font-bold text-slate-900 dark:text-white truncate block">{{ idx + 1 }}. {{ c.nm_cus }}</span>
                                <span class="text-[11px] text-slate-400">{{ c.orderCount }} Order • {{ c.totalQty }} pcs</span>
                            </div>
                            <span class="font-bold text-blue-600 dark:text-blue-400 shrink-0">
                                {{ formatRupiah(c.totalJual) }}
                            </span>
                        </div>
                        <div v-if="topCustomers.length === 0" class="text-center py-8 text-xs text-slate-400">
                            Tidak ada data pelanggan pada periode ini.
                        </div>
                    </div>
                </div>
            </div>

        </section>

        <!-- =========================================================================================
             5. TABEL ORDERAN (Terfilter Sesuai Periode, Lengkap Sorting & Pagination)
             ========================================================================================= -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none space-y-4">
            
            <!-- Table Action & Search Toolbar -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 class="text-base font-semibold text-slate-900 dark:text-white">Daftar Orderan Masuk</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Menampilkan orderan berdasarkan tgl_order periode terpilih</p>
                </div>

                <div class="flex flex-wrap items-center gap-2.5">
                    <!-- Search Input -->
                    <div class="relative w-full sm:w-60">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                            type="text"
                            v-model="tableSearch"
                            placeholder="Cari no order / PO / pelanggan..."
                            class="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <!-- Status Filter Dropdown -->
                    <select
                        v-model="statusFilter"
                        class="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                    >
                        <option value="ALL">Semua Status</option>
                        <option v-for="(v, k) in ORDER_STATUS_MAP" :key="k" :value="k">{{ v.label }}</option>
                    </select>

                    <!-- Jenis Order Dropdown -->
                    <select
                        v-model="typeFilter"
                        class="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                    >
                        <option value="ALL">Semua Jenis Order</option>
                        <option v-for="t in ORDER_TYPE_LABELS" :key="t" :value="t">{{ t }}</option>
                    </select>

                    <!-- Export CSV -->
                    <button
                        type="button"
                        @click="triggerCsvExport"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-xs transition"
                    >
                        <Download class="h-3.5 w-3.5 text-slate-500" />
                        Ekspor CSV
                    </button>
                </div>
            </div>

            <!-- Table Container -->
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                            <th class="pb-3 font-semibold cursor-pointer select-none" @click="toggleSort('tgl_order')">
                                <div class="flex items-center gap-1">
                                    <span>Tgl & No Order</span>
                                    <ArrowUpDown class="h-3 w-3" />
                                </div>
                            </th>
                            <th class="pb-3 font-semibold">No PO</th>
                            <th class="pb-3 font-semibold">Pelanggan</th>
                            <th class="pb-3 font-semibold">Jenis Order</th>
                            <th class="pb-3 font-semibold text-center">Status</th>
                            <th class="pb-3 font-semibold text-center cursor-pointer select-none" @click="toggleSort('total_qty')">
                                <div class="flex items-center justify-center gap-1">
                                    <span>Kuantitas</span>
                                    <ArrowUpDown class="h-3 w-3" />
                                </div>
                            </th>
                            <th class="pb-3 font-semibold text-right">HPP</th>
                            <th class="pb-3 font-semibold text-right cursor-pointer select-none" @click="toggleSort('total_jual')">
                                <div class="flex items-center justify-end gap-1">
                                    <span>Penjualan</span>
                                    <ArrowUpDown class="h-3 w-3" />
                                </div>
                            </th>
                            <th class="pb-3 font-semibold text-center cursor-pointer select-none" @click="toggleSort('tgl_estimasi')">
                                <div class="flex items-center justify-center gap-1">
                                    <span>Estimasi Selesai</span>
                                    <ArrowUpDown class="h-3 w-3" />
                                </div>
                            </th>
                            <th class="pb-3 font-semibold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
                        <tr
                            v-for="ord in paginatedOrders"
                            :key="ord.id_order"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
                            @click="openOrderDetail(ord)"
                        >
                            <td class="py-3.5 pr-3">
                                <span class="font-bold text-slate-900 dark:text-white block">{{ ord.no_order }}</span>
                                <span class="text-[11px] text-slate-400">{{ formatDateIndo(ord.tgl_order) }}</span>
                            </td>
                            <td class="py-3.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                                {{ ord.no_po || '-' }}
                            </td>
                            <td class="py-3.5 pr-3">
                                <div class="font-semibold text-slate-900 dark:text-white">{{ ord.nm_cus }}</div>
                                <span class="text-[10px] text-slate-400">{{ ord.kd_cus }}</span>
                            </td>
                            <td class="py-3.5 text-slate-700 dark:text-slate-300">
                                {{ ord.jenis_order }}
                            </td>
                            <td class="py-3.5 text-center">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                    :class="ORDER_STATUS_MAP[String(ord.status)]?.badgeClass || 'bg-slate-100 text-slate-600'"
                                >
                                    {{ ORDER_STATUS_MAP[String(ord.status)]?.label || 'Status ' + ord.status }}
                                </span>
                            </td>
                            <td class="py-3.5 text-center font-bold text-slate-900 dark:text-white">
                                {{ formatNumber(ord.total_qty) }} pcs
                            </td>
                            <td class="py-3.5 text-right text-slate-500 dark:text-slate-400">
                                {{ formatRupiah(ord.tot_hpp) }}
                            </td>
                            <td class="py-3.5 text-right font-bold text-blue-600 dark:text-blue-400">
                                {{ formatRupiah(ord.total_jual) }}
                            </td>
                            <td class="py-3.5 text-center">
                                <span class="block font-medium text-slate-800 dark:text-slate-200">{{ formatDateIndo(ord.tgl_estimasi) }}</span>
                                <span
                                    v-if="isOrderOverdue(ord, TODAY_DATE)"
                                    class="inline-block mt-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.2 rounded"
                                >
                                    Terlambat
                                </span>
                                <span
                                    v-else-if="isOrderApproaching(ord, TODAY_DATE)"
                                    class="inline-block mt-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded"
                                >
                                    &lt; 3 Hari
                                </span>
                            </td>
                            <td class="py-3.5 text-right">
                                <button
                                    type="button"
                                    @click.stop="openOrderDetail(ord)"
                                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
                                >
                                    <Eye class="h-3.5 w-3.5" />
                                    Detail
                                </button>
                            </td>
                        </tr>
                        <tr v-if="paginatedOrders.length === 0">
                            <td colspan="10" class="py-10 text-center text-slate-400 text-xs">
                                Tidak ada orderan yang memenuhi kriteria pencarian / filter pada periode ini.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Bar -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <div class="flex items-center gap-2">
                    <span>Menampilkan {{ tableOrders.length ? (currentPage - 1) * perPage + 1 : 0 }} - {{ Math.min(currentPage * perPage, tableOrders.length) }} dari {{ tableOrders.length }} orderan</span>
                    <select
                        v-model="perPage"
                        class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                        <option :value="10">10 per halaman</option>
                        <option :value="25">25 per halaman</option>
                        <option :value="50">50 per halaman</option>
                    </select>
                </div>

                <div class="flex items-center gap-1.5">
                    <button
                        type="button"
                        @click="currentPage = Math.max(1, currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                    >
                        Sebelumnya
                    </button>
                    <span class="px-2 font-medium">Hal {{ currentPage }} / {{ totalPages }}</span>
                    <button
                        type="button"
                        @click="currentPage = Math.min(totalPages, currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>

        </section>

        <!-- =========================================================================================
             6. DETAIL ORDERAN DRAWER (Sheet dari Sisi Kanan)
             ========================================================================================= -->
        <Sheet :open="isDetailOpen" @update:open="isDetailOpen = $event">
            <SheetContent side="right" class="w-full sm:max-w-lg p-0 overflow-y-auto">
                <div v-if="selectedOrder" class="p-6 space-y-6">
                    
                    <!-- Header Drawer -->
                    <SheetHeader class="pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
                                Detail Orderan
                            </span>
                            <span
                                class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                :class="ORDER_STATUS_MAP[String(selectedOrder.status)]?.badgeClass"
                            >
                                {{ ORDER_STATUS_MAP[String(selectedOrder.status)]?.label }}
                            </span>
                        </div>
                        <SheetTitle class="text-lg font-bold text-slate-900 dark:text-white mt-1">
                            {{ selectedOrder.no_order }}
                        </SheetTitle>
                        <SheetDescription class="text-xs text-slate-400">
                            Dibuat oleh {{ selectedOrder.UserAdd }} pada {{ selectedOrder.DateAdd }}
                        </SheetDescription>
                    </SheetHeader>

                    <!-- Group 1: Informasi Order -->
                    <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/60 space-y-2.5 text-xs">
                        <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">1. Informasi Order</h4>
                        <div class="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                            <div>ID Order: <strong class="text-slate-900 dark:text-white">#{{ selectedOrder.id_order }}</strong></div>
                            <div>ID Toko: <strong class="text-slate-900 dark:text-white">TK-{{ selectedOrder.IdToko }}</strong></div>
                            <div>No PO: <strong class="text-slate-900 dark:text-white">{{ selectedOrder.no_po || '-' }}</strong></div>
                            <div>No Rutin: <strong class="text-slate-900 dark:text-white">{{ selectedOrder.no_rutin || '-' }}</strong></div>
                            <div>Tanggal Order: <strong class="text-slate-900 dark:text-white">{{ formatDateIndo(selectedOrder.tgl_order) }}</strong></div>
                            <div>Jenis Order: <strong class="text-slate-900 dark:text-white">{{ selectedOrder.jenis_order }}</strong></div>
                        </div>
                    </div>

                    <!-- Group 2: Informasi Pelanggan -->
                    <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/60 space-y-2.5 text-xs">
                        <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">2. Informasi Pelanggan</h4>
                        <div class="space-y-1.5 text-slate-600 dark:text-slate-300">
                            <div>Kode Pelanggan: <strong class="text-slate-900 dark:text-white">{{ selectedOrder.kd_cus }}</strong></div>
                            <div>Nama Pelanggan: <strong class="text-slate-900 dark:text-white">{{ selectedOrder.nm_cus }}</strong></div>
                            <div>Nomor Telepon: <strong class="text-slate-900 dark:text-white">{{ selectedOrder.tlp }}</strong></div>
                            <div>Alamat Pengiriman: <p class="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">{{ selectedOrder.alamat }}</p></div>
                        </div>
                    </div>

                    <!-- Group 3: Informasi Pengerjaan & Tenggat -->
                    <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/60 space-y-2.5 text-xs">
                        <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">3. Informasi Pengerjaan & Deadline</h4>
                        <div class="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                            <div>Estimasi Kerja: <strong class="text-slate-900 dark:text-white">{{ selectedOrder.jml_hari }} Hari</strong></div>
                            <div>Tenggat Estimasi: <strong class="text-slate-900 dark:text-white">{{ formatDateIndo(selectedOrder.tgl_estimasi) }}</strong></div>
                        </div>
                        <div class="pt-2 border-t border-slate-200 dark:border-slate-700/80">
                            <span class="text-slate-500">Kondisi Deadline:</span>
                            <span
                                v-if="isOrderOverdue(selectedOrder, TODAY_DATE)"
                                class="ml-2 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded"
                            >
                                Terlambat Melewati Jadwal
                            </span>
                            <span
                                v-else-if="isOrderApproaching(selectedOrder, TODAY_DATE)"
                                class="ml-2 font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded"
                            >
                                Kritis (&lt; 3 Hari Menjelang Kirim)
                            </span>
                            <span
                                v-else-if="isOrderCompleted(selectedOrder)"
                                class="ml-2 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded"
                            >
                                Sudah Selesai Tepat Waktu
                            </span>
                            <span v-else class="ml-2 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                Sesuai Jadwal (Aman)
                            </span>
                        </div>
                    </div>

                    <!-- Group 4: Informasi Keuangan & Margin Laba -->
                    <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/60 space-y-2.5 text-xs">
                        <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">4. Informasi Keuangan & Laba</h4>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-slate-500">Total Kuantitas:</span>
                                <span class="font-bold text-slate-900 dark:text-white">{{ formatNumber(selectedOrder.total_qty) }} Pcs</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Total Nilai Penjualan:</span>
                                <span class="font-bold text-blue-600 dark:text-blue-400">{{ formatRupiah(selectedOrder.total_jual) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Total HPP Produksi:</span>
                                <span class="font-medium text-slate-700 dark:text-slate-300">{{ formatRupiah(selectedOrder.tot_hpp) }}</span>
                            </div>
                            <div class="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm">
                                <span class="font-bold text-slate-800 dark:text-slate-200">Estimasi Laba Kotor:</span>
                                <span class="font-extrabold text-emerald-600 dark:text-emerald-400">
                                    {{ formatRupiah(selectedOrder.total_jual - selectedOrder.tot_hpp) }}
                                </span>
                            </div>
                            <div class="flex justify-between text-xs text-slate-500">
                                <span>Margin Laba Kotor:</span>
                                <span class="font-bold text-emerald-600 dark:text-emerald-400">
                                    {{ selectedOrder.total_jual > 0 ? (((selectedOrder.total_jual - selectedOrder.tot_hpp) / selectedOrder.total_jual) * 100).toFixed(1) : 0 }}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Group 5: Informasi Audit Trail -->
                    <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/60 space-y-2 text-xs text-slate-500">
                        <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">5. Informasi Audit Trail</h4>
                        <div class="grid grid-cols-2 gap-1.5 text-[11px]">
                            <div>User Add: <strong class="text-slate-700 dark:text-slate-300">{{ selectedOrder.UserAdd }}</strong></div>
                            <div>Date Add: <strong class="text-slate-700 dark:text-slate-300">{{ selectedOrder.DateAdd }}</strong></div>
                            <div>Date Edit: <strong class="text-slate-700 dark:text-slate-300">{{ selectedOrder.DateEdit || '-' }}</strong></div>
                            <div>User Del: <strong class="text-slate-700 dark:text-slate-300">{{ selectedOrder.UserDel || '-' }}</strong></div>
                            <div>Date Del: <strong class="text-slate-700 dark:text-slate-300">{{ selectedOrder.DateDel || '-' }}</strong></div>
                            <div>Status Delete: <strong :class="selectedOrder.Delete ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'">{{ selectedOrder.Delete ? 'Dihapus' : 'Aktif' }}</strong></div>
                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>

    </div>
</template>
