<script setup lang="ts">
import { computed } from "vue";
import {
    Scissors,
    Layers,
    Clock,
    AlertTriangle,
    CheckCircle2,
} from "@lucide/vue";
import KpiCard from "./KpiCard.vue";
import { initialProductionData } from "@/data/productionData";
import { formatNumber, formatDateIndo } from "@/lib/formatters";

const props = defineProps<{
    isDark?: boolean;
    searchQuery?: string;
    statusFilter?: string;
    categoryFilter?: string;
}>();

const summary = initialProductionData.summary;

// Filtered orders table
const filteredOrders = computed(() => {
    return initialProductionData.orders.filter((ord) => {
        // Search filter
        if (props.searchQuery) {
            const q = props.searchQuery.toLowerCase();
            const match =
                ord.orderNumber.toLowerCase().includes(q) ||
                ord.customerName.toLowerCase().includes(q) ||
                ord.productName.toLowerCase().includes(q);
            if (!match) return false;
        }

        // Status filter
        if (props.statusFilter && props.statusFilter !== "Semua Status") {
            if (
                props.statusFilter === "Menunggu" &&
                !ord.status.includes("Antrean")
            )
                return false;
            if (
                props.statusFilter === "Dalam Produksi" &&
                !ord.status.includes("Sedang") &&
                !ord.status.includes("Obras")
            )
                return false;
            if (
                props.statusFilter === "Selesai" &&
                !ord.status.includes("QC") &&
                !ord.status.includes("Siap")
            )
                return false;
            if (
                props.statusFilter === "Terlambat" &&
                ord.status !== "Terlambat"
            )
                return false;
        }

        // Category filter
        if (props.categoryFilter && props.categoryFilter !== "Semua Kategori") {
            if (
                !ord.category
                    .toLowerCase()
                    .includes(props.categoryFilter.toLowerCase())
            )
                return false;
        }

        return true;
    });
});
</script>

<template>
    <div class="space-y-6">
        <!-- Production KPI Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                title="Total Hasil Produksi"
                :value="summary.totalActualPcs"
                unit="Pcs"
                type="number"
                :change="4.8"
                :is-positive="true"
                period-text="Target: 6.000 Pcs (91.3%)"
                tooltip="Akumulasi kuantitas fisik pakaian yang selesai diproduksi."
                :icon="CheckCircle2"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />
            <KpiCard
                title="Pesanan Sedang Dikerjakan"
                :value="summary.inProgressOrders"
                unit="Order"
                type="number"
                :change="summary.inProgressPcs"
                :is-positive="true"
                period-text="1.920 Pcs di lantai produksi"
                tooltip="Order aktif di jalur potong, jahit, obras, finishing & QC."
                :icon="Scissors"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />
            <KpiCard
                title="Rata-rata Waktu Siklus (Lead Time)"
                :value="summary.avgLeadTimeDays"
                unit="Hari"
                type="number"
                :change="-0.5"
                :is-positive="true"
                period-text="Target SOP: 5.0 Hari"
                tooltip="Rata-rata durasi dari kain digunting hingga pakaian selesai lolos packing."
                :icon="Clock"
                icon-bg="bg-indigo-50 dark:bg-indigo-950/40"
                icon-color="text-indigo-600 dark:text-indigo-400"
            />
            <KpiCard
                title="Produk Cacat & Pengerjaan Ulang"
                :value="summary.defectivePcs"
                unit="Pcs"
                type="number"
                :change="-0.4"
                :is-positive="true"
                period-text="85 Pcs berhasil di-rework (1.5%)"
                tooltip="Produk yang tidak lolos standar QC tahap awal dan membutuhkan revisi jahit."
                :icon="AlertTriangle"
                icon-bg="bg-amber-50 dark:bg-amber-950/40"
                icon-color="text-amber-600 dark:text-amber-400"
            />
        </section>

        <!-- Tahapan Alur Produksi Real-Time (6 Tahapan Lengkap: Cutting, Sewing, Obras, Finishing, QC, Shipping) -->
        <section
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none"
        >
            <div
                class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2"
            >
                <div>
                    <h2
                        class="text-base font-semibold text-slate-900 dark:text-white"
                    >
                        Alur Kerja Produksi per Stasiun (Pipeline)
                    </h2>
                    <p class="text-xs text-slate-400 mt-0.5">
                        Pemantauan 6 tahap: Potong, Jahit, Obras, Finishing, Uji
                        QC, dan Pengiriman
                    </p>
                </div>
                <div
                    class="flex items-center gap-2 text-xs font-semibold text-slate-500"
                >
                    <span
                        class="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg"
                    >
                        <Layers class="h-3.5 w-3.5 text-blue-600" />
                        6 Stasiun Aktif
                    </span>
                </div>
            </div>

            <!-- 6 Stages Grid -->
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5"
            >
                <div
                    v-for="(stg, i) in initialProductionData.stages"
                    :key="stg.stageId"
                    class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50 flex flex-col justify-between"
                >
                    <div>
                        <div class="flex items-center justify-between">
                            <span
                                class="flex h-6 w-6 items-center justify-center rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                            >
                                0{{ i + 1 }}
                            </span>
                            <span
                                class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                :class="[
                                    stg.status === 'bottleneck'
                                        ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60'
                                        : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40',
                                ]"
                            >
                                {{ stg.statusLabel }}
                            </span>
                        </div>

                        <h3
                            class="mt-3 text-sm font-bold text-slate-900 dark:text-white"
                        >
                            {{ stg.name }}
                        </h3>
                        <p class="text-[11px] text-slate-400 mt-0.5">
                            {{ stg.alias }}
                        </p>

                        <div class="mt-4 flex items-baseline justify-between">
                            <div>
                                <span
                                    class="text-xl font-bold text-slate-900 dark:text-white"
                                    >{{ formatNumber(stg.activePcs) }} Pcs</span
                                >
                                <span class="text-[11px] text-slate-400 block"
                                    >{{ stg.activeOrders }} Pesanan
                                    Berjalan</span
                                >
                            </div>
                            <div class="text-right">
                                <span
                                    class="text-xs font-semibold text-slate-600 dark:text-slate-300"
                                    >{{ stg.actualDailyPcs }}/{{
                                        stg.targetDailyPcs
                                    }}</span
                                >
                                <span class="text-[10px] text-slate-400 block"
                                    >Kapasitas Harian</span
                                >
                            </div>
                        </div>

                        <!-- Progress Bar -->
                        <div class="mt-3 space-y-1">
                            <div
                                class="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
                            >
                                <div
                                    class="h-full rounded-full transition-all duration-300"
                                    :class="
                                        stg.status === 'bottleneck'
                                            ? 'bg-amber-500'
                                            : 'bg-blue-600'
                                    "
                                    :style="{
                                        width: `${Math.min(100, (stg.actualDailyPcs / stg.targetDailyPcs) * 100)}%`,
                                    }"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400"
                    >
                        <span
                            >Lead time:
                            <strong
                                class="text-slate-700 dark:text-slate-200 font-medium"
                                >{{ stg.leadTimeDays }} hari</strong
                            ></span
                        >
                        <span
                            class="text-blue-600 dark:text-blue-400 font-medium"
                            >{{
                                (
                                    (stg.actualDailyPcs / stg.targetDailyPcs) *
                                    100
                                ).toFixed(0)
                            }}% Kuota</span
                        >
                    </div>
                </div>
            </div>
        </section>

        <!-- Tabel Pesanan Detail Produksi -->
        <section
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none"
        >
            <div
                class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800"
            >
                <div>
                    <h2
                        class="text-base font-semibold text-slate-900 dark:text-white"
                    >
                        Daftar Progres Pesanan Produksi
                    </h2>
                    <p class="text-xs text-slate-400 mt-0.5">
                        Pantau nomor pesanan, kuantitas target, progres fisik,
                        dan tenggat waktu
                    </p>
                </div>
                <span
                    class="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                >
                    {{ filteredOrders.length }} Order Aktif
                </span>
            </div>

            <div class="mt-4 overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr
                            class="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider"
                        >
                            <th class="pb-3 font-semibold">
                                Nomor & Pelanggan
                            </th>
                            <th class="pb-3 font-semibold">Nama Produk</th>
                            <th class="pb-3 font-semibold text-center">
                                Target
                            </th>
                            <th class="pb-3 font-semibold text-center">
                                Selesai
                            </th>
                            <th class="pb-3 font-semibold">
                                Progres Pengerjaan
                            </th>
                            <th class="pb-3 font-semibold text-center">
                                Tenggat
                            </th>
                            <th class="pb-3 font-semibold text-right">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        class="divide-y divide-slate-50 dark:divide-slate-800/60"
                    >
                        <tr
                            v-for="ord in filteredOrders"
                            :key="ord.orderNumber"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                        >
                            <td class="py-3.5 pr-3">
                                <span
                                    class="font-bold text-slate-900 dark:text-white"
                                    >{{ ord.orderNumber }}</span
                                >
                                <p class="text-[11px] text-slate-400">
                                    {{ ord.customerName }}
                                </p>
                            </td>
                            <td class="py-3.5">
                                <span
                                    class="font-medium text-slate-800 dark:text-slate-200"
                                    >{{ ord.productName }}</span
                                >
                                <span class="text-[10px] text-slate-400 block"
                                    >Kategori: {{ ord.category }}</span
                                >
                            </td>
                            <td
                                class="py-3.5 text-center font-bold text-slate-800 dark:text-slate-200"
                            >
                                {{ ord.targetPcs }} pcs
                            </td>
                            <td
                                class="py-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400"
                            >
                                {{ ord.completedPcs }} pcs
                            </td>
                            <td class="py-3.5 w-44">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
                                    >
                                        <div
                                            class="h-full rounded-full transition-all"
                                            :class="
                                                ord.progressPercentage === 100
                                                    ? 'bg-emerald-500'
                                                    : 'bg-blue-600'
                                            "
                                            :style="{
                                                width: `${ord.progressPercentage}%`,
                                            }"
                                        ></div>
                                    </div>
                                    <span
                                        class="text-[11px] font-bold text-slate-700 dark:text-slate-300 w-8 text-right"
                                    >
                                        {{ ord.progressPercentage }}%
                                    </span>
                                </div>
                            </td>
                            <td
                                class="py-3.5 text-center text-slate-600 dark:text-slate-300"
                            >
                                {{ formatDateIndo(ord.deadline) }}
                            </td>
                            <td class="py-3.5 text-right">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                    :class="[
                                        ord.status === 'Terlambat'
                                            ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                                            : ord.status === 'Siap Dikirim'
                                              ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                              : 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
                                    ]"
                                >
                                    {{ ord.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>
