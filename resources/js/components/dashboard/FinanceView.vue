<script setup lang="ts">
import { computed } from 'vue';
import {
    Banknote,
    Wallet,
    Landmark,
    TrendingUp,
    FileSpreadsheet,
    DollarSign,
    Layers,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
} from '@lucide/vue';
import KpiCard from './KpiCard.vue';
import { initialFinanceData } from '@/data/financeData';
import { formatNumber, formatRupiah } from '@/lib/formatters';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const props = defineProps<{
    isDark?: boolean;
    searchQuery?: string;
}>();

const summary = initialFinanceData.summary;

// Filtered profitability table
const filteredProfitability = computed(() => {
    return initialFinanceData.orderProfitabilityTable.filter((row) => {
        if (!props.searchQuery) return true;
        const q = props.searchQuery.toLowerCase();
        return (
            row.orderNumber.toLowerCase().includes(q) ||
            row.customerName.toLowerCase().includes(q) ||
            row.itemDesc.toLowerCase().includes(q)
        );
    });
});

// Bar Chart: Pendapatan vs Pengeluaran
const financeBarChartData = computed(() => ({
    labels: initialFinanceData.monthlyFinanceTrend.months,
    datasets: [
        {
            label: 'Pendapatan (Revenue)',
            data: initialFinanceData.monthlyFinanceTrend.revenue,
            backgroundColor: '#2563eb', // Royal Blue
            borderRadius: 6,
            barPercentage: 0.65,
        },
        {
            label: 'Pengeluaran (Total Biaya)',
            data: initialFinanceData.monthlyFinanceTrend.expenses,
            backgroundColor: props.isDark ? '#475569' : '#cbd5e1',
            borderRadius: 6,
            barPercentage: 0.65,
        },
    ],
}));

const financeBarChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
            align: 'end' as const,
            labels: {
                color: props.isDark ? '#cbd5e1' : '#64748b',
                usePointStyle: true,
                boxWidth: 8,
                padding: 12,
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

// Donut Chart: Distribusi Pengeluaran
const expenseDoughnutData = computed(() => ({
    labels: initialFinanceData.expenseDistribution.map((e) => e.category),
    datasets: [
        {
            data: initialFinanceData.expenseDistribution.map((e) => e.amount),
            backgroundColor: initialFinanceData.expenseDistribution.map((e) => e.color),
            borderColor: props.isDark ? '#0f172a' : '#ffffff',
            borderWidth: 2,
        },
    ],
}));

const expenseDoughnutOptions = computed(() => ({
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
</script>

<template>
    <div class="space-y-6">

        <!-- Financial Overview Matrix (6 Cards) -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard
                title="Total Pendapatan (Omzet)"
                :value="summary.totalRevenue"
                type="currency"
                :change="12.4"
                :is-positive="true"
                period-text="Akumulasi penerimaan kotor"
                tooltip="Gross revenue dari seluruh pesanan yang tervalidasi."
                :icon="Banknote"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />
            <KpiCard
                title="Laba Kotor (Gross Profit)"
                :value="summary.grossProfit"
                type="currency"
                :change="10.2"
                :is-positive="true"
                period-text="Setelah HPP Produksi Rp 112.4jt"
                tooltip="Omzet dikurangi HPP (Bahan baku kain + Upah langsung penjahit)."
                :icon="TrendingUp"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />
            <KpiCard
                title="Laba Bersih (Net Profit)"
                :value="summary.netProfit"
                type="currency"
                :change="summary.netProfitMargin"
                :is-positive="true"
                period-text="Margin Bersih: 29.0%"
                tooltip="Keuntungan riil setelah dipotong seluruh beban produksi & operasional."
                :icon="Wallet"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />
            <KpiCard
                title="Saldo Kas & Bank"
                :value="summary.cashBalance"
                type="currency"
                :change="14.1"
                :is-positive="true"
                period-text="Likuiditas lancar workshop"
                tooltip="Uang tunai kas kecil + rekening bank operasional konveksi."
                :icon="Landmark"
                icon-bg="bg-indigo-50 dark:bg-indigo-950/40"
                icon-color="text-indigo-600 dark:text-indigo-400"
            />
            <KpiCard
                title="Piutang Pelanggan (Receivable)"
                :value="summary.customerReceivables"
                type="currency"
                :change="-5.2"
                :is-positive="true"
                period-text="12 Faktur invoice berjalan"
                tooltip="Tagihan pesanan yang masih dalam termin pelunasan pelanggan."
                :icon="FileSpreadsheet"
                icon-bg="bg-amber-50 dark:bg-amber-950/40"
                icon-color="text-amber-600 dark:text-amber-400"
            />
            <KpiCard
                title="Utang Supplier Bahan (Payables)"
                :value="summary.supplierPayables"
                type="currency"
                :change="-3.8"
                :is-positive="true"
                period-text="Jatuh tempo 15 - 30 hari"
                tooltip="Tagihan pembelian kain & aksesoris ke pabrik tekstil."
                :icon="DollarSign"
                icon-bg="bg-purple-50 dark:bg-purple-950/40"
                icon-color="text-purple-600 dark:text-purple-400"
            />
        </section>

        <!-- Financial Charts (Pendapatan vs Pengeluaran & Distribusi Biaya) -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <!-- Grafik Pendapatan vs Pengeluaran (7 Kolom) -->
            <div class="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Arus Pendapatan vs Pengeluaran</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Perbandingan nominal bulanan usaha jahit</p>
                        </div>
                    </div>

                    <div class="h-[270px] w-full mt-4">
                        <Bar :data="financeBarChartData" :options="financeBarChartOptions" />
                    </div>
                </div>

                <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>Kas Masuk Periode Ini: <strong class="text-emerald-600 font-semibold">{{ formatRupiah(summary.cashInflow) }}</strong></span>
                    <span>Kas Keluar: <strong class="text-slate-600 dark:text-slate-300 font-semibold">{{ formatRupiah(summary.cashOutflow) }}</strong></span>
                </div>
            </div>

            <!-- Distribusi Pengeluaran (5 Kolom) -->
            <div class="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Struktur Biaya Operasional & HPP</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Distribusi pengeluaran konveksi</p>
                        </div>
                        <PieChart class="h-4 w-4 text-slate-400" />
                    </div>

                    <div class="h-[250px] w-full mt-3">
                        <Doughnut :data={...expenseDoughnutData} :options={...expenseDoughnutOptions} />
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                    Bahan kain dan upah jahit mendominasi 76.9% total biaya operasional.
                </div>
            </div>
        </section>

        <!-- Tabel Analisis Keuntungan per Pesanan -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 class="text-base font-semibold text-slate-900 dark:text-white">Analisis Keuntungan per Pesanan</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Rincian pendapatan, rincian biaya HPP, laba bersih, dan profit margin per order</p>
                </div>
                <span class="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    {{ filteredProfitability.length }} Pesanan Dianalisis
                </span>
            </div>

            <div class="mt-4 overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                            <th class="pb-3 font-semibold">Nomor & Pelanggan</th>
                            <th class="pb-3 font-semibold">Rincian Order</th>
                            <th class="pb-3 font-semibold text-right">Pendapatan</th>
                            <th class="pb-3 font-semibold text-right">Biaya Bahan</th>
                            <th class="pb-3 font-semibold text-right">Upah Tenaga</th>
                            <th class="pb-3 font-semibold text-right">Laba Bersih</th>
                            <th class="pb-3 font-semibold text-right">Margin (%)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
                        <tr
                            v-for="row in filteredProfitability"
                            :key="row.orderNumber"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                        >
                            <td class="py-3.5 pr-3">
                                <span class="font-bold text-slate-900 dark:text-white">{{ row.orderNumber }}</span>
                                <p class="text-[11px] text-slate-400">{{ row.customerName }}</p>
                            </td>
                            <td class="py-3.5 text-slate-700 dark:text-slate-300">
                                {{ row.itemDesc }}
                            </td>
                            <td class="py-3.5 text-right font-bold text-slate-900 dark:text-white">
                                {{ formatRupiah(row.revenue) }}
                            </td>
                            <td class="py-3.5 text-right text-slate-500 dark:text-slate-400">
                                {{ formatRupiah(row.materialCost) }}
                            </td>
                            <td class="py-3.5 text-right text-slate-500 dark:text-slate-400">
                                {{ formatRupiah(row.laborCost) }}
                            </td>
                            <td class="py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                {{ formatRupiah(row.netProfit) }}
                            </td>
                            <td class="py-3.5 text-right">
                                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    {{ row.profitMargin }}%
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

    </div>
</template>
