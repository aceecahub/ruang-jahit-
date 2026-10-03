<script setup lang="ts">
<<<<<<< HEAD
import { computed, ref } from "vue";
import {
    TrendingUp,
    TrendingDown,
    HelpCircle,
    ChevronDown,
    ChevronUp,
} from "@lucide/vue";
import { formatRupiah, formatNumber } from "@/lib/formatters";
=======
import { computed, ref } from 'vue';
import { TrendingUp, TrendingDown, HelpCircle, ChevronDown, ChevronUp } from '@lucide/vue';
import { formatRupiah, formatNumber } from '@/lib/formatters';
>>>>>>> 0048810 (responsif ui filter)

interface Props {
    title: string;
    value: number;
    type?: "currency" | "number" | "percent";
    unit?: string;
    change?: number;
    isPositive?: boolean;
    periodText?: string;
    tooltip?: string;
    icon?: any;
    iconBg?: string;
    iconColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: "number",
    isPositive: true,
    periodText: "vs. periode lalu",
});

// 1. STATE UNTUK DROPDOWN
const isExpanded = ref(false);

function toggleExpand() {
    isExpanded.value = !isExpanded.value;
}

// 2. KONDISI BATAS ANGKA (THRESHOLD) 100.000
const isLargeNumber = computed(() => {
    return Number(props.value ?? 0) >= 100000;
});

<<<<<<< HEAD
// 3. FORMAT ASLI FULL
=======
// 3. FORMAT ASLI FULL (Ini kode asli Anda, saya biarkan utuh)
>>>>>>> 0048810 (responsif ui filter)
const formattedValue = computed(() => {
    const value = Number(props.value ?? 0);

    if (!Number.isFinite(value)) {
<<<<<<< HEAD
        return "0";
    }

    if (props.type === "currency") {
        return formatRupiah(value);
    }

    if (props.type === "percent") {
        return `${value.toFixed(1)}%`;
    }

    return formatNumber(value);
});

// 4. FORMAT SINGKATAN
const compactValue = computed(() => {
    const val = Number(props.value ?? 0);

    if (props.type === "percent") return formattedValue.value;
    if (!isLargeNumber.value) return formattedValue.value;

    let compacted = "";

    // Menggunakan \u00A0 agar spasi antara angka dan huruf (Rb/Jt/M) tidak mepet
    if (val >= 1e12) {
        compacted =
            (val / 1e12).toLocaleString("id-ID", { maximumFractionDigits: 2 }) +
            " \u00A0T";
    } else if (val >= 1e9) {
        compacted =
            (val / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 2 }) +
            " \u00A0M";
    } else if (val >= 1e6) {
        compacted =
            (val / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 2 }) +
            " \u00A0Jt";
    } else if (val >= 1e3) {
        compacted =
            (val / 1e3).toLocaleString("id-ID", { maximumFractionDigits: 0 }) +
            " \u00A0Rb";
    } else {
        compacted = val.toLocaleString("id-ID");
    }

    if (props.type === "currency") {
        // Menggunakan \u00A0 agar spasi "Rp" dengan angka juga lega
        return `Rp \u00A0${compacted}`;
    }

    return compacted;
=======
        return '0';
    }

    if (props.type === 'currency') {
        return formatRupiah(value);
    }

    if (props.type === 'percent') {
        return `${value.toFixed(1)}%`;
    }

    return formatNumber(value);
>>>>>>> 37ac52e (dynamic data card orderan)
});

// 4. FORMAT SINGKATAN (Ini tambahannya, dengan spasi yang lebih lega)
const compactValue = computed(() => {
    const val = Number(props.value ?? 0);

    if (props.type === 'percent') return formattedValue.value;
    if (!isLargeNumber.value) return formattedValue.value;

    let compacted = '';

    // Menggunakan \u00A0 agar spasi antara angka dan huruf (Rb/Jt/M) tidak mepet
    if (val >= 1e12) {
        compacted = (val / 1e12).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' \u00A0T';
    } else if (val >= 1e9) {
        compacted = (val / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' \u00A0M';
    } else if (val >= 1e6) {
        compacted = (val / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' \u00A0Jt';
    } else if (val >= 1e3) {
        compacted = (val / 1e3).toLocaleString('id-ID', { maximumFractionDigits: 0 }) + ' \u00A0Rb';
    } else {
        compacted = val.toLocaleString('id-ID');
    }

    if (props.type === 'currency') {
        // Menggunakan \u00A0 agar spasi "Rp" dengan angka juga lega
        return `Rp \u00A0${compacted}`;
    }

    return compacted;
});
</script>

<template>
<<<<<<< HEAD
    <!-- Padding responsif: p-4 di mobile, p-5 di desktop -->
    <div
        class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm shadow-slate-200/40 dark:shadow-none transition hover:border-slate-200 dark:hover:border-slate-700 flex flex-col justify-between"
    >
        <!-- HEADER KARTU -->
        <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 min-w-0">
                <span
                    class="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 truncate"
                    >{{ title }}</span
                >
                <span
                    v-if="tooltip"
                    :title="tooltip"
                    class="cursor-help text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
                >
=======
    <!-- Padding responsif: p-3.5 di mobile, p-5 di desktop -->
    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm shadow-slate-200/40 dark:shadow-none transition hover:border-slate-200 dark:hover:border-slate-700 flex flex-col justify-between">

        <!-- HEADER KARTU -->
        <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{{ title }}</span>
                <span v-if="tooltip" :title="tooltip" class="cursor-help text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400">
>>>>>>> 0048810 (responsif ui filter)
                    <HelpCircle class="h-3.5 w-3.5" />
                </span>
            </div>
            <div
                v-if="icon"
                class="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg"
<<<<<<< HEAD
                :class="[
                    iconBg || 'bg-blue-50 dark:bg-blue-950/40',
                    iconColor || 'text-blue-600 dark:text-blue-400',
                ]"
=======
                :class="[iconBg || 'bg-blue-50 dark:bg-blue-950/40', iconColor || 'text-blue-600 dark:text-blue-400']"
>>>>>>> 0048810 (responsif ui filter)
            >
                <component :is="icon" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
        </div>

<<<<<<< HEAD
        <!-- MAIN ANGKA (TAMPILAN DESKTOP) -->
        <div class="mt-3 hidden sm:flex items-baseline gap-2.5">
            <span
                class="text-2xl font-bold text-slate-900 dark:text-white truncate"
            >
                {{ formattedValue }}
                <!-- Selalu tampil Full di Desktop -->
            </span>
            <span v-if="unit" class="text-xs font-medium text-slate-500">
=======
        <!-- MAIN ANGKA -->
        <div class="mt-3 flex items-baseline gap-1.5 sm:gap-2.5">
            <span class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                <!-- Tampilkan singkatan jika besar, jika tidak tampilkan asli -->
                {{ isLargeNumber ? compactValue : formattedValue }}
            </span>
            <span v-if="unit" class="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500">
>>>>>>> 0048810 (responsif ui filter)
                {{ unit }}
            </span>
            <span
                v-if="change !== undefined"
                class="hidden sm:inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                :class="[
                    isPositive
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
                ]"
            >
                <TrendingUp v-if="isPositive" class="h-3 w-3" />
                <TrendingDown v-else class="h-3 w-3" />
                {{ change > 0 ? "+" : "" }}{{ change }}%
            </span>
        </div>

<<<<<<< HEAD
        <!-- MAIN ANGKA (TAMPILAN MOBILE) -->
        <div class="mt-3 flex sm:hidden items-baseline gap-1.5">
            <span
                class="text-xl font-bold text-slate-900 dark:text-white truncate"
            >
                {{ isLargeNumber ? compactValue : formattedValue }}
                <!-- Tampil Singkat jika Besar di Mobile -->
            </span>
            <span v-if="unit" class="text-[10px] font-medium text-slate-400">
                {{ unit }}
            </span>
        </div>

        <!-- FOOTER (TAMPILAN DESKTOP: HANYA TEKS, NO DROPDOWN) -->
        <div
            class="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50 hidden sm:block"
        >
            <p class="text-xs text-slate-500 truncate">
                {{ periodText }}
            </p>
        </div>

        <!-- FOOTER & DROPDOWN (TAMPILAN MOBILE) -->
        <div
            class="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50 sm:hidden"
            :class="{
                'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-1.5 px-1.5 rounded-lg transition active:scale-[0.98]':
                    isLargeNumber,
            }"
            @click="isLargeNumber ? toggleExpand() : null"
        >
            <div class="flex items-center justify-between gap-2 select-none">
                <p class="text-[10px] text-slate-400 truncate">
                    {{ periodText }}
                </p>
=======
        <!-- FOOTER & DROPDOWN -->
        <div
            class="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50"
            :class="{
                'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-1.5 px-1.5 rounded-lg transition active:scale-[0.98]': isLargeNumber
            }"
            @click="isLargeNumber ? toggleExpand() : null"
        >
            <!-- Area yang diklik -->
            <div class="flex items-center justify-between gap-2 select-none">
                <p class="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 truncate">
                    {{ periodText }}
                </p>

                <!-- Ikon Panah (Hanya muncul jika angka > 100.000) -->
>>>>>>> 0048810 (responsif ui filter)
                <component
                    v-if="isLargeNumber"
                    :is="isExpanded ? ChevronUp : ChevronDown"
                    class="h-3.5 w-3.5 text-slate-400 shrink-0"
                />
            </div>
<<<<<<< HEAD
=======

            <!-- Detail Angka Asli (Muncul ke Bawah) -->
>>>>>>> 0048810 (responsif ui filter)
            <div
                v-if="isLargeNumber && isExpanded"
                class="mt-2 pb-1 pt-1 border-t border-dashed border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200"
            >
<<<<<<< HEAD
                <p class="text-[9px] font-medium text-slate-500 mb-0.5">
                    Detail Nilai Asli:
                </p>
                <p class="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {{ formattedValue }}
                    <span
                        v-if="unit && type !== 'currency'"
                        class="font-normal text-[10px] text-slate-500"
                        >{{ unit }}</span
                    >
                </p>
            </div>
        </div>
=======
                <p class="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                    Detail Nilai Asli:
                </p>
                <p class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                    {{ formattedValue }} <span v-if="unit && type !== 'currency'" class="font-normal text-[10px] text-slate-500">{{ unit }}</span>
                </p>
            </div>
        </div>

>>>>>>> 0048810 (responsif ui filter)
    </div>
</template>
