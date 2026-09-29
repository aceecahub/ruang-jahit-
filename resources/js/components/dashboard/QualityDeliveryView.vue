<script setup lang="ts">
import { computed } from 'vue';
import {
    CheckCircle2,
    AlertTriangle,
    RotateCcw,
    Truck,
    Clock,
    Package,
    ShieldCheck,
    AlertCircle,
    Calendar,
} from '@lucide/vue';
import KpiCard from './KpiCard.vue';
import { initialQualityDeliveryData } from '@/data/qualityDeliveryData';
import { formatNumber, formatDateIndo } from '@/lib/formatters';

const props = defineProps<{
    isDark?: boolean;
    searchQuery?: string;
}>();

const quality = initialQualityDeliveryData.quality;
const delivery = initialQualityDeliveryData.delivery;

// Filtered deliveries table
const filteredDeliveries = computed(() => {
    return delivery.recentDeliveries.filter((del) => {
        if (!props.searchQuery) return true;
        const q = props.searchQuery.toLowerCase();
        return (
            del.trackingNumber.toLowerCase().includes(q) ||
            del.customerName.toLowerCase().includes(q) ||
            del.orderNumber.toLowerCase().includes(q) ||
            del.courier.toLowerCase().includes(q)
        );
    });
});
</script>

<template>
    <div class="space-y-6">

        <!-- Quality & Delivery Dual KPI Matrix -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                title="Produk Diperiksa & Lolos QC"
                :value="quality.passedQcPcs"
                unit="Pcs"
                type="number"
                :change="1.8"
                :is-positive="true"
                period-text="Dari 5.620 pcs diperiksa (97.5%)"
                tooltip="Jumlah pakaian yang lolos uji spesifikasi ukuran, jahitan rapi, dan bersih."
                :icon="CheckCircle2"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />
            <KpiCard
                title="Rasio Cacat Produk (Defect Rate)"
                :value="quality.defectRate"
                type="percent"
                :change="-0.5"
                :is-positive="true"
                period-text="140 pcs gagal QC tahap 1"
                tooltip="Persentase produk yang mengalami cacat jahitan, toleransi ukuran, atau noda."
                :icon="AlertTriangle"
                icon-bg="bg-rose-50 dark:bg-rose-950/40"
                icon-color="text-rose-600 dark:text-rose-400"
            />
            <KpiCard
                title="Ketepatan Waktu Pengiriman"
                :value="delivery.onTimeRate"
                type="percent"
                :change="2.1"
                :is-positive="true"
                period-text="106 dari 114 pesanan tepat waktu"
                tooltip="Persentase pesanan yang sampai ke tangan pelanggan sesuai deadline kesepakatan."
                :icon="Truck"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />
            <KpiCard
                title="Pesanan Siap Kirim (Pending)"
                :value="delivery.readyToShipPendingOrders"
                unit="Order"
                type="number"
                :change="0"
                :is-positive="true"
                period-text="420 Pcs di staging area packing"
                tooltip="Pesanan yang sudah 100% packing dan siap diambil kurir ekspedisi."
                :icon="Package"
                icon-bg="bg-purple-50 dark:bg-purple-950/40"
                icon-color="text-purple-600 dark:text-purple-400"
            />
        </section>

        <!-- Analisis Cacat Kualitas & Pengerjaan Ulang (2 Kolom) -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-5">

            <!-- Jenis Cacat yang Sering Ditemukan (7 Kolom) -->
            <div class="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Jenis Cacat Kualitas Terbanyak (QC Breakdown)</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Identifikasi masalah untuk perbaikan SOP operator mesin jahit</p>
                        </div>
                        <span class="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full">
                            {{ quality.failedQcPcs }} Pcs Cacat
                        </span>
                    </div>

                    <div class="mt-4 space-y-3">
                        <div
                            v-for="d in quality.defectTypes"
                            :key="d.defectName"
                            class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50"
                        >
                            <div class="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                                <span>{{ d.defectName }}</span>
                                <span class="text-slate-900 dark:text-white">{{ d.count }} Pcs ({{ d.percentage }}%)</span>
                            </div>

                            <div class="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <div
                                    class="h-full bg-rose-500 rounded-full"
                                    :style="{ width: `${d.percentage}%` }"
                                ></div>
                            </div>

                            <div class="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                                <span>Kategori: <strong class="text-slate-600 dark:text-slate-300 font-medium">{{ d.severity }}</strong></span>
                                <span>Kontribusi: {{ d.percentage }}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                    Sebagian besar cacat (37.1%) dapat diselesaikan lewat rework perbaikan benang jahit tanpa merusak kain.
                </div>
            </div>

            <!-- Rekapitulasi Rework & Ekspedisi (5 Kolom) -->
            <div class="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Efektivitas Pengerjaan Ulang</h2>
                            <p class="text-xs text-slate-400 mt-0.5">Hasil audit perbaikan produk</p>
                        </div>
                        <ShieldCheck class="h-4 w-4 text-emerald-600" />
                    </div>

                    <div class="mt-4 space-y-4">
                        <div class="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                            <span class="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Pengerjaan Ulang Berhasil (Rework)</span>
                            <div class="mt-2 flex items-baseline justify-between">
                                <span class="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{{ quality.reworkedPcs }} Pcs</span>
                                <span class="text-xs font-medium text-emerald-600">60.7% Diselamatkan</span>
                            </div>
                            <p class="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-1">Produk berhasil diperbaiki dan lulus QC ulang tanpa mengurangi kualitas.</p>
                        </div>

                        <div class="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50">
                            <span class="text-xs font-semibold text-rose-800 dark:text-rose-300">Produk Rusak Total (Scrap / BS)</span>
                            <div class="mt-2 flex items-baseline justify-between">
                                <span class="text-2xl font-bold text-rose-700 dark:text-rose-300">{{ quality.scrappedPcs }} Pcs</span>
                                <span class="text-xs font-medium text-rose-600">39.3% Scrap</span>
                            </div>
                            <p class="text-[11px] text-rose-700/80 dark:text-rose-400 mt-1">Kain cacat serat atau robek permanen yang dialokasikan ke kain perca.</p>
                        </div>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>Rata-rata Keterlambatan: <strong class="text-slate-700 dark:text-slate-200 font-semibold">{{ delivery.avgDelayDays }} Hari</strong></span>
                    <span class="text-blue-600 font-semibold">Tepat Waktu: {{ delivery.onTimeRate }}%</span>
                </div>
            </div>

        </section>

        <!-- Tabel Riwayat Pengiriman & Ekspedisi Terbaru -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 class="text-base font-semibold text-slate-900 dark:text-white">Daftar Status Pengiriman & Resi</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Pemantauan armada internal dan ekspedisi kargo menuju pelanggan</p>
                </div>
                <span class="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    {{ filteredDeliveries.length }} Pengiriman Aktif
                </span>
            </div>

            <div class="mt-4 overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                            <th class="pb-3 font-semibold">Nomor Resi & Order</th>
                            <th class="pb-3 font-semibold">Pelanggan</th>
                            <th class="pb-3 font-semibold">Deskripsi Barang</th>
                            <th class="pb-3 font-semibold">Kurir / Armada</th>
                            <th class="pb-3 font-semibold text-center">Tgl Kirim</th>
                            <th class="pb-3 font-semibold text-right">Status Kirim</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
                        <tr
                            v-for="del in filteredDeliveries"
                            :key="del.trackingNumber"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                        >
                            <td class="py-3.5 pr-3">
                                <div class="font-bold text-slate-900 dark:text-white font-mono">{{ del.trackingNumber }}</div>
                                <div class="text-[11px] text-slate-400">{{ del.orderNumber }}</div>
                            </td>
                            <td class="py-3.5 font-medium text-slate-800 dark:text-slate-200">
                                {{ del.customerName }}
                            </td>
                            <td class="py-3.5 text-slate-600 dark:text-slate-300">
                                {{ del.itemDesc }} ({{ del.pcs }} pcs)
                            </td>
                            <td class="py-3.5 text-slate-700 dark:text-slate-300">
                                {{ del.courier }}
                            </td>
                            <td class="py-3.5 text-center text-slate-500 dark:text-slate-400">
                                {{ formatDateIndo(del.shippedDate) }}
                            </td>
                            <td class="py-3.5 text-right">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                    :class="[
                                        del.deliveryStatus === 'Tiba Tepat Waktu'
                                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                            : del.deliveryStatus === 'Terlambat Dikirim'
                                            ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                                            : 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                                    ]"
                                >
                                    {{ del.deliveryStatus }}
                                    <span v-if="del.delayDays > 0" class="text-[10px] ml-0.5">(+{{ del.delayDays }}h)</span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

    </div>
</template>
