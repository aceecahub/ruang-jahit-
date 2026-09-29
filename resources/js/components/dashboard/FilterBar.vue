<script setup lang="ts">
import { ref } from 'vue';
import { Calendar, ChevronDown, Download, Filter, Search, RotateCcw } from '@lucide/vue';

export interface FilterState {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    category: string;
    status: string;
    searchQuery: string;
}

const props = withDefaults(defineProps<{
    modelValue: FilterState;
    categories?: string[];
    statuses?: string[];
    showCategoryFilter?: boolean;
    showStatusFilter?: boolean;
}>(), {
    categories: () => ['Semua Kategori', 'Kemeja', 'Kaos Polo', 'Wearpack', 'Jersey', 'Gamis', 'Jaket'],
    statuses: () => ['Semua Status', 'Menunggu', 'Dalam Produksi', 'Selesai', 'Siap Kirim', 'Terlambat'],
    showCategoryFilter: true,
    showStatusFilter: true,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: FilterState): void;
    (e: 'export'): void;
}>();

const periods = [
    { key: 'daily', label: 'Harian' },
    { key: 'weekly', label: 'Mingguan' },
    { key: 'monthly', label: 'Bulanan' },
    { key: 'yearly', label: 'Tahunan' },
];

function setPeriod(p: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    emit('update:modelValue', { ...props.modelValue, period: p });
}

function setCategory(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    emit('update:modelValue', { ...props.modelValue, category: val });
}

function setStatus(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    emit('update:modelValue', { ...props.modelValue, status: val });
}

function onSearch(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    emit('update:modelValue', { ...props.modelValue, searchQuery: val });
}

function resetFilters() {
    emit('update:modelValue', {
        period: 'monthly',
        category: 'Semua Kategori',
        status: 'Semua Status',
        searchQuery: '',
    });
}
</script>

<template>
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-3 sm:p-4 rounded-2xl shadow-sm shadow-slate-200/30 dark:shadow-none">
        
        <!-- Period Toggles (Harian, Mingguan, Bulanan, Tahunan) -->
        <div class="flex flex-wrap items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
                v-for="p in periods"
                :key="p.key"
                type="button"
                @click="setPeriod(p.key as any)"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer"
                :class="[
                    modelValue.period === p.key
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                ]"
            >
                {{ p.label }}
            </button>
        </div>

        <!-- Filter Dropdowns & Search -->
        <div class="flex flex-wrap items-center gap-2.5">
            <!-- Search input -->
            <div class="relative flex-1 sm:w-56">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                    type="text"
                    :value="modelValue.searchQuery"
                    @input="onSearch"
                    placeholder="Cari pesanan / produk..."
                    class="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
            </div>

            <!-- Category Filter -->
            <div v-if="showCategoryFilter" class="relative">
                <select
                    :value="modelValue.category"
                    @change="setCategory"
                    class="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                >
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>

            <!-- Status Filter -->
            <div v-if="showStatusFilter" class="relative">
                <select
                    :value="modelValue.status"
                    @change="setStatus"
                    class="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                >
                    <option v-for="st in statuses" :key="st" :value="st">{{ st }}</option>
                </select>
                <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>

            <!-- Reset Button -->
            <button
                type="button"
                @click="resetFilters"
                title="Reset filter"
                class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
                <RotateCcw class="h-3.5 w-3.5" />
            </button>

            <!-- Export Button -->
            <button
                type="button"
                @click="emit('export')"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
            >
                <Download class="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                Export
            </button>
        </div>

    </div>
</template>
