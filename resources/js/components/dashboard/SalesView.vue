<script setup lang="ts">
import { computed } from 'vue';
import {
    Banknote,
    ShoppingBag,
    Calculator,
    XCircle,
    TrendingUp,
    Users,
    Layers,
    ArrowUpRight,
    ArrowRight,
} from '@lucide/vue';
import KpiCard from './KpiCard.vue';
import { initialSalesData } from '@/data/salesData';
import { formatNumber, formatRupiah, formatDateIndo } from '@/lib/formatters';
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
import { Line, Doughnut, Bar } from 'vue-chartjs';

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
    searchQuery?: string;
    categoryFilter?: string;
}>();

const summary = initialSalesData.summary;

// Filtered customer sales
const filteredCustomers = computed(() => {
    return initialSalesData.topCustomersByRevenue.filter((c) => {
        if (!props.searchQuery) return true;
        const q = props.searchQuery.toLowerCase();
        return (
            c.customerName.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            c.type.toLowerCase().includes(q)
        );
    });
});

// Category Donut Chart
const categoryChartData = computed(() => {
    return {
        labels: initialSalesData.revenueByProductCategory.map((c) => c.category),
        datasets: [
            {
                data: initialSalesData.revenueByProductCategory.map((c) => c.revenue),
                backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'],
                borderWidth: 2,
                borderColor: props.isDark ? '#0f172a' : '#ffffff',
            },
        ],
    };
});

const categoryChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                color: props.isDark ? '#cbd5e1' : '#64748b',
                boxWidth: 8,
                padding: 12,
                font: { size: 10 },
            },
        },
        tooltip: {
            backgroundColor: props.isDark ? '#0f172a' : '#ffffff',
            titleColor: props.isDark ? '#f8fafc' : '#0f172a',
            bodyColor: props.isDark ? '#cbd5e1' : '#475569',
            borderColor: props.isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            callbacks: {
                label: (ctx: any) => ` ${ctx.label}: ${formatRupiah(ctx.parsed)}`,
            },
        },
    },
}));

// Sales trend (Periode ini vs Periode lalu)
const trendChartData = computed(() => ({
    labels: initialSalesData.salesTrend.periods,
    datasets: [
        {
            label: 'Periode Berjalan',
            data: initialSalesData.salesTrend.currentPeriod,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
        },
        {
            label: 'Periode Sebelumnya',
            data: initialSalesData.salesTrend.previousPeriod,
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            fill: false,
            tension: 0.35,
            borderWidth: 2,
        },
    ],
}));

const trendChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
            align: 'end' as const,
            labels: {
                color: props.isDark ? '#cbd5e1' : '#64748b',
                boxWidth: 8,
                usePointStyle: true,
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
            grid: {
                color: props.isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(241, 245, 249, 1)',
            },
            ticks: {
                color: props.isDark ? '#64748b' : '#94a3b8',
                callback: (v: any) => `Rp ${(v / 1000000).toFixed(0)}jt`,
                font: { size: 10 },
            },
            border: { display: false },
        },
        x: {
            grid: { display: false },
            ticks: {
                color: props.isDark ? '#94a3b8' : '#64748b',
                font: { size: 11 },
            },
            border: { display: false },
        },
    },
}));
</script>

<template>
    <div class="space-y-6">

        <!-- Sales KPI Summary Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                title="Total Pendapatan Penjualan"
                :value="summary.totalRevenue"
                type="currency"
                :change="summary.revenueGrowth"
                :is-positive="true"
                period-text="vs. Rp 164.100.000 bln lalu"
                tooltip="Akumulasi omzet penjualan dari seluruh pesanan terverifikasi."
                :icon="Banknote"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />
            <KpiCard
                title="Jumlah Pesanan Masuk"
                :value="summary.totalOrders"
                type="number"
                unit="Order"
                :change="summary.ordersGrowth"
                :is-positive="true"
                period-text="Total 5.840 pcs dipesan"
                tooltip="Jumlah transaksi PO / invoice pesanan masuk periode ini."
                :icon="ShoppingBag"
                icon-bg="bg-indigo-50 dark:bg-indigo-950/40"
                icon-color="text-indigo-600 dark:text-indigo-400"
            />
            <KpiCard
                title="Rata-rata Nilai Pesanan (AOV)"
                :value="summary.avgOrderValue"
                type="currency"
                :change="summary.avgOrderValueGrowth"
                :is-positive="true"
                period-text="Rata-rata per transaksi"
                tooltip="Average Order Value = Total omzet dibagi jumlah pesanan masuk."
                :icon="Calculator"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />
            <KpiCard
                title="Pesanan Dibatalkan"
                :value="summary.cancelledOrders"
                type="number"
                unit="Order"
                :change="-summary.cancellationRate"
                :is-positive="false"
                period-text="Nilai Rp 3.800.000 (1.7%)"
                tooltip="Pesanan yang dibatalkan sebelum proses potong kain dimulai."
                :icon="XCircle"
                icon-bg="bg-rose-50 dark:bg-rose-950/40"
                icon-color="text-rose-600 dark:text-rose-400"
            />
        </section>

        <!-- Charts: Tren Penjualan & Kategori Produk -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <!-- Tren Penjualan vs Periode Lalu (8 Kolom) -->
            <div class="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Perbandingan Tren Penjualan Antarperiode</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Pertumbuhan nominal mingguan bulan ini vs bulan lalu</p>
                        </div>
                        <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                            +12.4% Pertumbuhan
                        </span>
                    </div>

                    <div class="h-[270px] w-full mt-4">
                        <Line :data="trendChartData" :options="trendChartOptions" />
                    </div>
                </div>

                <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>Minggu ke-4 mencatatkan performa tertinggi didorong pesanan seragam B2B.</span>
                </div>
            </div>

            <!-- Distribusi Jenis Produk (4 Kolom) -->
            <div class="lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Pendapatan per Kategori</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Komposisi produk pakaian</p>
                        </div>
                        <Layers class="h-4 w-4 text-slate-400" />
                    </div>

                    <div class="h-[240px] w-full mt-3">
                        <Doughnut :data="categoryChartData" :options="categoryChartOptions" />
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                    Kemeja & Polo menyumbang 58.2% dari seluruh pendapatan.
                </div>
            </div>
        </section>

        <!-- Top Customer Revenue Table -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 class="text-base font-semibold text-slate-900 dark:text-white">Pendapatan Berdasarkan Pelanggan Teratas</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Kontribusi nilai transaksi dari pelanggan kunci (B2B, Institusi, Retail)</p>
                </div>
                <span class="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    {{ filteredCustomers.length }} Pelanggan Ditampilkan
                </span>
            </div>

            <div class="mt-4 overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                            <th class="pb-3 font-semibold">Pelanggan</th>
                            <th class="pb-3 font-semibold">Tipe Segmen</th>
                            <th class="pb-3 font-semibold text-center">Jumlah Order</th>
                            <th class="pb-3 font-semibold text-right">Total Nilai Pembelian</th>
                            <th class="pb-3 font-semibold text-center">Order Terakhir</th>
                            <th class="pb-3 font-semibold text-right">Status Bayar</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
                        <tr
                            v-for="c in filteredCustomers"
                            :key="c.id"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                        >
                            <td class="py-3.5 pr-3">
                                <div class="font-semibold text-slate-900 dark:text-white">{{ c.customerName }}</div>
                                <div class="text-[11px] text-slate-400">{{ c.id }}</div>
                            </td>
                            <td class="py-3.5 text-slate-600 dark:text-slate-300">
                                {{ c.type }}
                            </td>
                            <td class="py-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                                {{ c.orderCount }}x
                            </td>
                            <td class="py-3.5 text-right font-bold text-blue-600 dark:text-blue-400">
                                {{ formatRupiah(c.totalRevenue) }}
                            </td>
                            <td class="py-3.5 text-center text-slate-500 dark:text-slate-400">
                                {{ formatDateIndo(c.lastOrderDate) }}
                            </td>
                            <td class="py-3.5 text-right">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                    :class="[
                                        c.status === 'Lunas'
                                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                            : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                                    ]"
                                >
                                    {{ c.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

    </div>
</template>
