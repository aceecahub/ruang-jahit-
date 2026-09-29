<script setup lang="ts">
import { computed } from 'vue';
import {
    Users,
    UserPlus,
    UserCheck,
    RotateCcw,
    Calculator,
    AlertCircle,
    Calendar,
    Phone,
} from '@lucide/vue';
import KpiCard from './KpiCard.vue';
import { initialCustomerData } from '@/data/customerData';
import { formatNumber, formatRupiah, formatDateIndo } from '@/lib/formatters';

const props = defineProps<{
    isDark?: boolean;
    searchQuery?: string;
}>();

const summary = initialCustomerData.summary;

// Filtered customer list
const filteredCustomers = computed(() => {
    return initialCustomerData.customerList.filter((c) => {
        if (!props.searchQuery) return true;
        const q = props.searchQuery.toLowerCase();
        return (
            c.name.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            c.contactPerson.toLowerCase().includes(q) ||
            c.type.toLowerCase().includes(q)
        );
    });
});
</script>

<template>
    <div class="space-y-6">

        <!-- Customer KPI Matrix -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                title="Total Pelanggan Terdaftar"
                :value="summary.totalCustomers"
                unit="Klien"
                type="number"
                :change="14.5"
                :is-positive="true"
                period-text="18 Klien baru bergabung"
                tooltip="Jumlah basis klien B2B, instansi, dan retail yang pernah memesan."
                :icon="Users"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />
            <KpiCard
                title="Tingkat Pemesanan Ulang (Repeat Order)"
                :value="summary.repeatCustomerRate"
                type="percent"
                :change="5.2"
                :is-positive="true"
                period-text="Frekuensi rata-rata: 3.8x / thn"
                tooltip="Persentase klien yang melakukan reorder minimal dua kali dalam setahun."
                :icon="RotateCcw"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />
            <KpiCard
                title="Pelanggan Aktif Bertransaksi"
                :value="summary.activeCustomers"
                unit="Klien"
                type="number"
                :change="8.0"
                :is-positive="true"
                period-text="Bertransaksi 90 hari terakhir"
                tooltip="Klien yang memiliki order berjalan atau baru tuntas dalam 3 bulan terakhir."
                :icon="UserCheck"
                icon-bg="bg-indigo-50 dark:bg-indigo-950/40"
                icon-color="text-indigo-600 dark:text-indigo-400"
            />
            <KpiCard
                title="Klien Memiliki Piutang Berjalan"
                :value="summary.totalReceivableCustomers"
                unit="Klien"
                type="number"
                :change="-2.0"
                :is-positive="true"
                period-text="Total Rp 42.600.000 piutang"
                tooltip="Klien dengan pesanan selesai yang tagihannya belum lunas 100%."
                :icon="AlertCircle"
                icon-bg="bg-amber-50 dark:bg-amber-950/40"
                icon-color="text-amber-600 dark:text-amber-400"
            />
        </section>

        <!-- Segmentasi & Distribusi Pelanggan -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
                v-for="seg in initialCustomerData.customerSegments"
                :key="seg.segment"
                class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm shadow-slate-200/40 dark:shadow-none"
            >
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">{{ seg.segment }}</span>
                <div class="mt-2 flex items-baseline justify-between">
                    <span class="text-xl font-bold text-slate-900 dark:text-white">{{ seg.count }} Klien</span>
                    <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">{{ seg.percentage }}%</span>
                </div>
                <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    Nilai Omzet: <strong class="text-slate-800 dark:text-slate-200">{{ formatRupiah(seg.revenue) }}</strong>
                </div>
            </div>
        </section>

        <!-- Tabel Detail Pelanggan & Status Piutang -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 class="text-base font-semibold text-slate-900 dark:text-white">Daftar Pelanggan & Analisis Piutang</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Pemantauan loyalitas pelanggan, riwayat belanja, dan sisa tagihan berjalan</p>
                </div>
                <span class="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    {{ filteredCustomers.length }} Pelanggan Terdaftar
                </span>
            </div>

            <div class="mt-4 overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                            <th class="pb-3 font-semibold">Nama Instansi / Klien</th>
                            <th class="pb-3 font-semibold">Kontak PIC</th>
                            <th class="pb-3 font-semibold text-center">Total Order</th>
                            <th class="pb-3 font-semibold text-right">Total Transaksi</th>
                            <th class="pb-3 font-semibold text-right">Sisa Piutang</th>
                            <th class="pb-3 font-semibold text-center">Status Piutang</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
                        <tr
                            v-for="c in filteredCustomers"
                            :key="c.id"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                        >
                            <td class="py-3.5 pr-3">
                                <div class="font-bold text-slate-900 dark:text-white">{{ c.name }}</div>
                                <div class="text-[11px] text-slate-400">{{ c.companyOrOrg }} • <span class="text-slate-600 dark:text-slate-300 font-medium">{{ c.type }}</span></div>
                            </td>
                            <td class="py-3.5">
                                <div class="font-medium text-slate-800 dark:text-slate-200">{{ c.contactPerson }}</div>
                                <div class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                    <Phone class="h-3 w-3" />
                                    {{ c.phone }}
                                </div>
                            </td>
                            <td class="py-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                                {{ c.totalOrders }}x
                            </td>
                            <td class="py-3.5 text-right font-bold text-slate-900 dark:text-white">
                                {{ formatRupiah(c.totalSpent) }}
                            </td>
                            <td class="py-3.5 text-right font-bold" :class="c.outstandingReceivable > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'">
                                {{ c.outstandingReceivable > 0 ? formatRupiah(c.outstandingReceivable) : 'Rp 0' }}
                            </td>
                            <td class="py-3.5 text-center">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                    :class="[
                                        c.outstandingReceivable === 0
                                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                            : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                                    ]"
                                >
                                    {{ c.outstandingReceivable === 0 ? 'Lunas 100%' : 'Ada Piutang' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

    </div>
</template>
