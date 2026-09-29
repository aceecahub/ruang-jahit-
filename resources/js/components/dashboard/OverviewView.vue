<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    Banknote,
    TrendingUp,
    Scissors,
    CheckCircle2,
    Wallet,
    Landmark,
    Activity,
    AlertCircle,
    Clock,
    AlertTriangle,
    ShieldAlert,
    ChevronRight,
    ArrowUpRight,
} from '@lucide/vue';
import KpiCard from './KpiCard.vue';
import { initialDashboardData } from '@/data/dashboardData';
import { formatNumber, formatRupiah } from '@/lib/formatters';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const props = defineProps<{
    isDark?: boolean;
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}>();

const emit = defineEmits<{
    (e: 'navigate', tabKey: string): void;
}>();

// Selected chart time frame
const trendTimeframe = ref<'weekly' | 'monthly' | 'yearly'>('monthly');

// Responsive multi-period multiplier for KPIs simulation
const periodMultiplier = computed(() => {
    if (props.period === 'daily') return 0.04;
    if (props.period === 'weekly') return 0.25;
    if (props.period === 'yearly') return 12.0;
    return 1.0; // monthly default
});

// Computed KPIs based on filter period
const computedKpis = computed(() => {
    return initialDashboardData.kpis.map((kpi) => {
        let val = kpi.value;
        if (kpi.id !== 'production_rate') {
            val = Math.round(kpi.value * periodMultiplier.value);
        }
        return {
            ...kpi,
            value: val,
        };
    });
});

// Chart data reactive to trendTimeframe & dark mode
const chartData = computed(() => {
    const periodData = initialDashboardData.revenueTrends[trendTimeframe.value];
    return {
        labels: periodData.labels,
        datasets: [
            {
                label: 'Pendapatan (Revenue)',
                data: periodData.revenue,
                borderColor: '#2563eb', // Royal Blue
                backgroundColor: props.isDark ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)',
                borderWidth: 2.5,
                pointBackgroundColor: props.isDark ? '#0f172a' : '#ffffff',
                pointBorderColor: '#2563eb',
                pointHoverRadius: 5,
                fill: true,
                tension: 0.35,
            },
            {
                label: 'Laba Bersih (Net Profit)',
                data: periodData.profit,
                borderColor: '#10b981', // Emerald
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [4, 4],
                pointBackgroundColor: props.isDark ? '#0f172a' : '#ffffff',
                pointBorderColor: '#10b981',
                pointHoverRadius: 5,
                fill: false,
                tension: 0.35,
            },
        ],
    };
});

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
            align: 'end' as const,
            labels: {
                color: props.isDark ? '#cbd5e1' : '#64748b',
                usePointStyle: true,
                boxWidth: 6,
                padding: 14,
                font: {
                    family: "'Instrument Sans', sans-serif",
                    size: 11,
                    weight: 500,
                },
            },
        },
        tooltip: {
            backgroundColor: props.isDark ? '#0f172a' : '#ffffff',
            titleColor: props.isDark ? '#f8fafc' : '#0f172a',
            bodyColor: props.isDark ? '#cbd5e1' : '#475569',
            borderColor: props.isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            padding: 10,
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
                callback: (val: any) => `Rp ${(val / 1000000).toFixed(0)}jt`,
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

        <!-- A. 8 KPI CARDS (2 Baris x 4 Grid) -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                :title="computedKpis[0].title"
                :value="computedKpis[0].value"
                type="currency"
                :change="computedKpis[0].change"
                :is-positive="computedKpis[0].isPositive"
                :period-text="computedKpis[0].periodText"
                :tooltip="computedKpis[0].tooltip"
                :icon="Banknote"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />
            <KpiCard
                :title="computedKpis[1].title"
                :value="computedKpis[1].value"
                type="currency"
                :change="computedKpis[1].change"
                :is-positive="computedKpis[1].isPositive"
                :period-text="computedKpis[1].periodText"
                :tooltip="computedKpis[1].tooltip"
                :icon="TrendingUp"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />
            <KpiCard
                :title="computedKpis[2].title"
                :value="computedKpis[2].value"
                type="number"
                unit="Order"
                :change="computedKpis[2].change"
                :is-positive="computedKpis[2].isPositive"
                :period-text="computedKpis[2].periodText"
                :tooltip="computedKpis[2].tooltip"
                :icon="Scissors"
                icon-bg="bg-amber-50 dark:bg-amber-950/40"
                icon-color="text-amber-600 dark:text-amber-400"
            />
            <KpiCard
                :title="computedKpis[3].title"
                :value="computedKpis[3].value"
                type="number"
                unit="Order"
                :change="computedKpis[3].change"
                :is-positive="computedKpis[3].isPositive"
                :period-text="computedKpis[3].periodText"
                :tooltip="computedKpis[3].tooltip"
                :icon="CheckCircle2"
                icon-bg="bg-purple-50 dark:bg-purple-950/40"
                icon-color="text-purple-600 dark:text-purple-400"
            />
            <KpiCard
                :title="computedKpis[4].title"
                :value="computedKpis[4].value"
                type="currency"
                :change="computedKpis[4].change"
                :is-positive="computedKpis[4].isPositive"
                :period-text="computedKpis[4].periodText"
                :tooltip="computedKpis[4].tooltip"
                :icon="Wallet"
                icon-bg="bg-rose-50 dark:bg-rose-950/40"
                icon-color="text-rose-600 dark:text-rose-400"
            />
            <KpiCard
                :title="computedKpis[5].title"
                :value="computedKpis[5].value"
                type="currency"
                :change="computedKpis[5].change"
                :is-positive="computedKpis[5].isPositive"
                :period-text="computedKpis[5].periodText"
                :tooltip="computedKpis[5].tooltip"
                :icon="Landmark"
                icon-bg="bg-indigo-50 dark:bg-indigo-950/40"
                icon-color="text-indigo-600 dark:text-indigo-400"
            />
            <KpiCard
                :title="computedKpis[6].title"
                :value="computedKpis[6].value"
                type="percent"
                :change="computedKpis[6].change"
                :is-positive="computedKpis[6].isPositive"
                :period-text="computedKpis[6].periodText"
                :tooltip="computedKpis[6].tooltip"
                :icon="Activity"
                icon-bg="bg-teal-50 dark:bg-teal-950/40"
                icon-color="text-teal-600 dark:text-teal-400"
            />
            <KpiCard
                :title="computedKpis[7].title"
                :value="computedKpis[7].value"
                type="number"
                unit="Order"
                :change="computedKpis[7].change"
                :is-positive="computedKpis[7].isPositive"
                :period-text="computedKpis[7].periodText"
                :tooltip="computedKpis[7].tooltip"
                :icon="AlertCircle"
                icon-bg="bg-rose-50 dark:bg-rose-950/40"
                icon-color="text-rose-600 dark:text-rose-400"
            />
        </section>

        <!-- B. GRAFIK TREN PENDAPATAN & C. RINGKASAN STATUS PESANAN (2 Kolom) -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            <!-- B. Grafik Tren Pendapatan (8 Kolom) -->
            <div class="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Tren Pendapatan & Profitabilitas</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Perbandingan arus omzet vs laba bersih usaha konveksi</p>
                        </div>

                        <!-- Selector: Mingguan / Bulanan / Tahunan -->
                        <div class="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button
                                v-for="t in [
                                    { key: 'weekly', label: 'Mingguan' },
                                    { key: 'monthly', label: 'Bulanan' },
                                    { key: 'yearly', label: 'Tahunan' },
                                ]"
                                :key="t.key"
                                type="button"
                                @click="trendTimeframe = t.key as any"
                                class="px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer"
                                :class="[
                                    trendTimeframe === t.key
                                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                                ]"
                            >
                                {{ t.label }}
                            </button>
                        </div>
                    </div>

                    <div class="h-[280px] w-full mt-4">
                        <Line :data="chartData" :options="chartOptions" />
                    </div>
                </div>

                <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Rata-rata Margin Keuntungan: <strong class="text-emerald-600 dark:text-emerald-400 font-semibold">29.0%</strong></span>
                    <button @click="emit('navigate', 'finance')" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer">
                        Rincian Keuangan <ChevronRight class="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <!-- C. Ringkasan Pesanan Berdasarkan 7 Status (4 Kolom) -->
            <div class="lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Status Pesanan</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Distribusi 168 pesanan terdaftar</p>
                        </div>
                    </div>

                    <div class="mt-4 space-y-2.5">
                        <div
                            v-for="st in initialDashboardData.orderStatusCounts"
                            :key="st.statusKey"
                            class="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50 hover:bg-slate-100/70 transition"
                        >
                            <div class="min-w-0 flex items-center gap-2">
                                <span class="h-2 w-2 rounded-full" :class="st.color"></span>
                                <span class="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{{ st.label }}</span>
                            </div>
                            <div class="text-right shrink-0">
                                <span class="text-xs font-bold text-slate-900 dark:text-white">{{ st.count }} Order</span>
                                <span class="text-[10px] text-slate-400 ml-1">({{ st.pcs }} pcs)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button @click="emit('navigate', 'orders')" class="w-full text-center text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer">
                        Lihat Data Orderan & Tracking →
                    </button>
                </div>
            </div>

        </section>

        <!-- D. RINGKASAN PRODUKSI & E. NOTIFIKASI PENTING (2 Kolom) -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-5">

            <!-- D. Ringkasan Produksi (6 Kolom) -->
            <div class="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Capaian & Matriks Produksi</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Monitoring kuota jahit & kontrol ketepatan waktu</p>
                        </div>
                        <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                            {{ initialDashboardData.productionSummary.achievementRate }}% Target
                        </span>
                    </div>

                    <!-- Progress Bar Capaian -->
                    <div class="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/80 space-y-2">
                        <div class="flex justify-between text-xs">
                            <span class="text-slate-500 dark:text-slate-400">Realisasi Selesai: <strong class="text-slate-800 dark:text-white">{{ formatNumber(initialDashboardData.productionSummary.actualPcs) }} pcs</strong></span>
                            <span class="text-slate-500 dark:text-slate-400">Target Kuota: <strong class="text-slate-800 dark:text-white">{{ formatNumber(initialDashboardData.productionSummary.targetPcs) }} pcs</strong></span>
                        </div>
                        <div class="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div class="h-full bg-blue-600 rounded-full" :style="{ width: `${initialDashboardData.productionSummary.achievementRate}%` }"></div>
                        </div>
                    </div>

                    <!-- 3 Metric Pillars -->
                    <div class="grid grid-cols-3 gap-3 mt-4">
                        <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50 text-center">
                            <span class="text-[10px] text-slate-400 uppercase font-semibold">Lolos QC</span>
                            <p class="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{{ formatNumber(initialDashboardData.productionSummary.qcPassedPcs) }}</p>
                            <span class="text-[10px] text-slate-400">{{ initialDashboardData.productionSummary.qcPassedRate }}% Rasio</span>
                        </div>
                        <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50 text-center">
                            <span class="text-[10px] text-slate-400 uppercase font-semibold">&lt; 3 Hari Tenggat</span>
                            <p class="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5">{{ initialDashboardData.productionSummary.approachingDeadlineOrders }}</p>
                            <span class="text-[10px] text-slate-400">Pesanan</span>
                        </div>
                        <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50 text-center">
                            <span class="text-[10px] text-slate-400 uppercase font-semibold">Terlambat</span>
                            <p class="text-base font-bold text-rose-600 dark:text-rose-400 mt-0.5">{{ initialDashboardData.productionSummary.overdueOrders }}</p>
                            <span class="text-[10px] text-slate-400">Pesanan</span>
                        </div>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                    <span class="text-slate-400">Efisiensi produksi minggu ini optimal</span>
                    <button @click="emit('navigate', 'quality')" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer">
                        Analitik Kualitas & QC <ChevronRight class="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <!-- E. Notifikasi Penting (6 Kolom) -->
            <div class="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div class="flex items-center gap-2">
                            <AlertCircle class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Peringatan & Notifikasi Operasional</h2>
                        </div>
                        <span class="text-xs font-semibold text-slate-400">{{ initialDashboardData.alerts.length }} Perhatian</span>
                    </div>

                    <div class="mt-4 space-y-3">
                        <div
                            v-for="alt in initialDashboardData.alerts"
                            :key="alt.id"
                            class="p-3 rounded-xl border flex items-start justify-between gap-3 transition"
                            :class="[
                                alt.severity === 'danger'
                                    ? 'border-rose-100 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20'
                                    : alt.severity === 'warning'
                                    ? 'border-amber-100 dark:border-amber-950/60 bg-amber-50/40 dark:bg-amber-950/20'
                                    : 'border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50'
                            ]"
                        >
                            <div class="flex items-start gap-2.5 min-w-0">
                                <span class="mt-0.5">
                                    <AlertTriangle v-if="alt.severity === 'danger'" class="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                    <Clock v-else-if="alt.severity === 'warning'" class="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                    <ShieldAlert v-else class="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                </span>
                                <div class="min-w-0">
                                    <p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ alt.title }}</p>
                                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{{ alt.description }}</p>
                                </div>
                            </div>
                            <div class="text-right shrink-0">
                                <span class="text-[10px] text-slate-400 block">{{ alt.time }}</span>
                                <span v-if="alt.actionLabel" class="inline-block mt-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                    {{ alt.actionLabel }} →
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                    Semua sistem pemantauan real-time aktif dan tersinkronisasi.
                </div>
            </div>

        </section>

    </div>
</template>
