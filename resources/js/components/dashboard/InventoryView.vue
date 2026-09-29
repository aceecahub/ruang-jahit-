<script setup lang="ts">
import { computed } from 'vue';
import {
    Boxes,
    Layers,
    AlertTriangle,
    Scissors,
    RotateCcw,
    Truck,
    CheckCircle2,
    Clock,
    Plus,
} from '@lucide/vue';
import KpiCard from './KpiCard.vue';
import { initialInventoryData } from '@/data/inventoryData';
import { formatNumber, formatRupiah, formatDateIndo } from '@/lib/formatters';

const props = defineProps<{
    isDark?: boolean;
    searchQuery?: string;
    categoryFilter?: string;
    statusFilter?: string;
}>();

const summary = initialInventoryData.summary;

// Filtered inventory items
const filteredInventory = computed(() => {
    return initialInventoryData.inventoryList.filter((item) => {
        if (props.searchQuery) {
            const q = props.searchQuery.toLowerCase();
            const match =
                item.name.toLowerCase().includes(q) ||
                item.sku.toLowerCase().includes(q) ||
                item.colorCode.toLowerCase().includes(q) ||
                item.supplier.toLowerCase().includes(q);
            if (!match) return false;
        }

        if (props.statusFilter && props.statusFilter !== 'Semua Status') {
            if (props.statusFilter === 'Aman' && item.status !== 'aman') return false;
            if (props.statusFilter === 'Menipis' && item.status !== 'menipis') return false;
            if (props.statusFilter === 'Habis' && item.status !== 'habis') return false;
        }

        if (props.categoryFilter && props.categoryFilter !== 'Semua Kategori') {
            if (!item.category.toLowerCase().includes(props.categoryFilter.toLowerCase())) return false;
        }

        return true;
    });
});
</script>

<template>
    <div class="space-y-6">

        <!-- Inventory KPI Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                title="Total Nilai Aset Persediaan"
                :value="summary.totalInventoryValue"
                type="currency"
                :change="6.5"
                :is-positive="true"
                period-text="48 jenis kain & aksesoris"
                tooltip="Valuasi rupiah dari seluruh stok gulungan kain & aksesoris di gudang."
                :icon="Boxes"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />
            <KpiCard
                title="Total Stok Kain Tersedia"
                :value="summary.totalFabricMeters"
                unit="Meter"
                type="number"
                :change="-3.2"
                :is-positive="true"
                period-text="Pemakaian: 3.420 meter bln ini"
                tooltip="Akumulasi panjang kain gulungan yang siap digunakan untuk pemotongan."
                :icon="Layers"
                icon-bg="bg-indigo-50 dark:bg-indigo-950/40"
                icon-color="text-indigo-600 dark:text-indigo-400"
            />
            <KpiCard
                title="Bahan Kritis & Hampir Habis"
                :value="summary.itemsBelowMinStock"
                unit="Item"
                type="number"
                :change="-2.0"
                :is-positive="false"
                period-text="Di bawah batas Reorder Point"
                tooltip="Jumlah jenis kain atau benang yang berada di bawah stok minimum operasional."
                :icon="AlertTriangle"
                icon-bg="bg-rose-50 dark:bg-rose-950/40"
                icon-color="text-rose-600 dark:text-rose-400"
            />
            <KpiCard
                title="Efisiensi Bahan (Scrap Rate)"
                :value="summary.scrapWastePercentage"
                type="percent"
                :change="-0.4"
                :is-positive="true"
                period-text="Limbah kain perca: 96 m (2.8%)"
                tooltip="Persentase kain yang terbuang saat proses gelar & cutting."
                :icon="Scissors"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />
        </section>

        <!-- Tabel Stok Bahan Baku (Main Inventory Table) -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div>
                    <h2 class="text-base font-semibold text-slate-900 dark:text-white">Inventaris Bahan Baku & Kain</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Pantau kuantitas stok riil, batas minimum, valuasi rupiah, dan status pengadaan</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {{ filteredInventory.length }} Material Ditemukan
                    </span>
                    <button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition cursor-pointer">
                        <Plus class="h-3.5 w-3.5" />
                        Tambah Bahan
                    </button>
                </div>
            </div>

            <div class="mt-4 overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                            <th class="pb-3 font-semibold">Nama Bahan & Kode</th>
                            <th class="pb-3 font-semibold">Kategori</th>
                            <th class="pb-3 font-semibold text-center">Stok Saat Ini</th>
                            <th class="pb-3 font-semibold text-center">Stok Minimum</th>
                            <th class="pb-3 font-semibold text-right">Nilai Total</th>
                            <th class="pb-3 font-semibold text-right">Status Stok</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
                        <tr
                            v-for="item in filteredInventory"
                            :key="item.id"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                        >
                            <td class="py-3.5 pr-3">
                                <div class="font-bold text-slate-900 dark:text-white">{{ item.name }}</div>
                                <div class="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <span class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded font-mono">{{ item.sku }}</span>
                                    <span>{{ item.colorCode }}</span>
                                </div>
                            </td>
                            <td class="py-3.5 text-slate-600 dark:text-slate-300">
                                {{ item.category }}
                            </td>
                            <td class="py-3.5 text-center">
                                <span class="font-bold text-slate-900 dark:text-white">{{ item.currentStock }}</span>
                                <span class="text-[11px] text-slate-400 ml-1">{{ item.unit }}</span>
                            </td>
                            <td class="py-3.5 text-center text-slate-500 dark:text-slate-400">
                                {{ item.minStock }} {{ item.unit }}
                            </td>
                            <td class="py-3.5 text-right font-medium text-slate-900 dark:text-white">
                                {{ formatRupiah(item.totalValue) }}
                            </td>
                            <td class="py-3.5 text-right">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                    :class="[
                                        item.status === 'aman'
                                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                            : item.status === 'menipis'
                                            ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                                            : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                                    ]"
                                >
                                    {{ item.status === 'aman' ? 'Stok Aman' : item.status === 'menipis' ? 'Menipis' : 'Habis / Kritis' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Riwayat Pembelian Bahan Baku (Recent Purchase Orders) -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 class="text-base font-semibold text-slate-900 dark:text-white">Riwayat Pengadaan Bahan Baku (PO Masuk)</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Daftar transaksi pembelian kain dari supplier terpercaya</p>
                </div>
                <Truck class="h-4 w-4 text-slate-400" />
            </div>

            <div class="mt-4 overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                            <th class="pb-3 font-semibold">Nomor PO</th>
                            <th class="pb-3 font-semibold">Tanggal Order</th>
                            <th class="pb-3 font-semibold">Nama Supplier</th>
                            <th class="pb-3 font-semibold">Item Pembelian</th>
                            <th class="pb-3 font-semibold text-right">Total Biaya</th>
                            <th class="pb-3 font-semibold text-right">Status Penerimaan</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
                        <tr
                            v-for="po in initialInventoryData.recentPurchases"
                            :key="po.poNumber"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                        >
                            <td class="py-3.5 font-bold text-slate-900 dark:text-white">{{ po.poNumber }}</td>
                            <td class="py-3.5 text-slate-500 dark:text-slate-400">{{ formatDateIndo(po.date) }}</td>
                            <td class="py-3.5 text-slate-800 dark:text-slate-200 font-medium">{{ po.supplier }}</td>
                            <td class="py-3.5 text-slate-600 dark:text-slate-400">{{ po.itemsSummary }}</td>
                            <td class="py-3.5 text-right font-bold text-slate-900 dark:text-white">{{ formatRupiah(po.totalAmount) }}</td>
                            <td class="py-3.5 text-right">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                    :class="[
                                        po.status === 'Diterima Lengkap'
                                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                            : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                                    ]"
                                >
                                    {{ po.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

    </div>
</template>
