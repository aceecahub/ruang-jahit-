<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Head } from '@inertiajs/vue3';
import { dashboard } from '@/routes';
import { useAppearance } from '@/composables/useAppearance';
import { toast } from 'vue-sonner';
import {
    LayoutGrid,
    TrendingUp,
    Scissors,
    Banknote,
    Boxes,
    Users,
    UserCheck,
    Truck,
    Calendar,
    Plus,
    RotateCcw,
    X,
} from '@lucide/vue';

// Filter Bar and Subviews
import FilterBar, { type FilterState } from '@/components/dashboard/FilterBar.vue';
import OverviewView from '@/components/dashboard/OverviewView.vue';
import SalesView from '@/components/dashboard/SalesView.vue';
import ProductionView from '@/components/dashboard/ProductionView.vue';
import FinanceView from '@/components/dashboard/FinanceView.vue';
import InventoryView from '@/components/dashboard/InventoryView.vue';
import CustomerView from '@/components/dashboard/CustomerView.vue';
import EmployeeView from '@/components/dashboard/EmployeeView.vue';
import QualityDeliveryView from '@/components/dashboard/QualityDeliveryView.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard Owner',
                href: dashboard(),
            },
        ],
    },
});

// Optional Props from Laravel Controller (Integration Ready)
const props = defineProps<{
    initialTab?: string;
    customKpis?: any;
    customOrders?: any;
}>();

// Theme tracking
const { resolvedAppearance } = useAppearance();
const isDark = computed(() => resolvedAppearance.value === 'dark');

// Navigation Tabs
export type TabKey =
    | 'overview'
    | 'sales'
    | 'production'
    | 'finance'
    | 'inventory'
    | 'customers'
    | 'employees'
    | 'quality';

const tabs = [
    { key: 'overview', label: 'Ringkasan Bisnis', icon: LayoutGrid },
    { key: 'sales', label: 'Penjualan', icon: TrendingUp },
    { key: 'production', label: 'Produksi', icon: Scissors },
    { key: 'finance', label: 'Keuangan', icon: Banknote },
    { key: 'inventory', label: 'Inventaris & Bahan', icon: Boxes },
    { key: 'customers', label: 'Pelanggan', icon: Users },
    { key: 'employees', label: 'Produktivitas Karyawan', icon: UserCheck },
    { key: 'quality', label: 'Kualitas & Pengiriman', icon: Truck },
];

const activeTab = ref<TabKey>('overview');

// Filter state
const filters = ref<FilterState>({
    period: 'monthly',
    category: 'Semua Kategori',
    status: 'Semua Status',
    searchQuery: '',
});

// Modal state for "+ Order Baru"
const isNewOrderModalOpen = ref(false);

// Initialize active tab from URL query param if present
onMounted(() => {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as TabKey;
        if (tabParam && tabs.some((t) => t.key === tabParam)) {
            activeTab.value = tabParam;
        } else if (props.initialTab && tabs.some((t) => t.key === props.initialTab)) {
            activeTab.value = props.initialTab as TabKey;
        }
    }
});

function switchTab(tabKey: string) {
    if (tabs.some((t) => t.key === tabKey)) {
        activeTab.value = tabKey as TabKey;
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', tabKey);
            window.history.replaceState(null, '', url.toString());
        }
    }
}

function handleExport() {
    toast.success('Laporan berhasil diekspor!', {
        description: `Data analitik ${tabs.find((t) => t.key === activeTab.value)?.label} telah diunduh (format CSV/Excel).`,
    });
}

function handleSaveNewOrder() {
    isNewOrderModalOpen.value = false;
    toast.success('Pesanan jahit baru berhasil disimpan!', {
        description: 'Order telah masuk ke dalam antrean tunggu konfirmasi & alokasi bahan.',
    });
}
</script>

<template>
    <Head :title="`Dashboard Owner - ${tabs.find(t => t.key === activeTab)?.label}`" />

    <div class="min-h-full bg-[#f4f6fa] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">

        <!-- Top Header: Owner Command Center Bar -->
        <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2.5">
                    <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Owner</h1>
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 px-2.5 py-0.5 text-[11px] font-semibold">
                        Konveksi & Ruang Jahit
                    </span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sistem kendali operasional, finansial & produksi real-time</p>
            </div>

            <!-- Date Filter & Quick Actions -->
            <div class="flex flex-wrap items-center gap-2.5">
                <div class="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs">
                    <Calendar class="h-3.5 w-3.5 text-slate-400" />
                    <span>Periode: September 2026</span>
                </div>

                <button
                    type="button"
                    @click="isNewOrderModalOpen = true"
                    class="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-xs transition active:scale-[0.98] cursor-pointer"
                >
                    <Plus class="h-3.5 w-3.5" />
                    Order Baru
                </button>
            </div>
        </header>

        <!-- Horizontal Tab Pill Navigation (8 Sub-modules) -->
        <nav class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-1.5 rounded-2xl shadow-xs">
            <button
                v-for="t in tabs"
                :key="t.key"
                type="button"
                @click="switchTab(t.key)"
                class="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer"
                :class="[
                    activeTab === t.key
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                ]"
            >
                <component :is="t.icon" class="h-3.5 w-3.5" />
                <span>{{ t.label }}</span>
            </button>
        </nav>

        <!-- Interactive Filter Bar -->
        <FilterBar
            v-model="filters"
            :show-category-filter="['overview', 'sales', 'production', 'inventory'].includes(activeTab)"
            :show-status-filter="['overview', 'production', 'inventory'].includes(activeTab)"
            @export="handleExport"
        />

        <!-- Active View Component -->
        <main class="transition-opacity duration-150">
            <OverviewView
                v-if="activeTab === 'overview'"
                :is-dark="isDark"
                :period="filters.period"
                @navigate="switchTab"
            />

            <SalesView
                v-else-if="activeTab === 'sales'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
                :category-filter="filters.category"
            />

            <ProductionView
                v-else-if="activeTab === 'production'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
                :status-filter="filters.status"
                :category-filter="filters.category"
            />

            <FinanceView
                v-else-if="activeTab === 'finance'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
            />

            <InventoryView
                v-else-if="activeTab === 'inventory'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
                :category-filter="filters.category"
                :status-filter="filters.status"
            />

            <CustomerView
                v-else-if="activeTab === 'customers'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
            />

            <EmployeeView
                v-else-if="activeTab === 'employees'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
            />

            <QualityDeliveryView
                v-else-if="activeTab === 'quality'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
            />
        </main>

        <!-- Modal Tambah Pesanan Baru (Simulasi Frontend) -->
        <div
            v-if="isNewOrderModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
        >
            <div class="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 shadow-xl space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Buat Pesanan Jahit Baru</h3>
                    <button
                        type="button"
                        @click="isNewOrderModalOpen = false"
                        class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <div class="space-y-3 text-xs">
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Pelanggan / Instansi</label>
                        <input
                            type="text"
                            placeholder="Contoh: PT Samudera Logistik"
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Jenis Pakaian / Item</label>
                        <input
                            type="text"
                            placeholder="Contoh: Kemeja Drill Kombinasi"
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Jumlah (Pcs)</label>
                            <input
                                type="number"
                                placeholder="150"
                                class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tenggat Waktu</label>
                            <input
                                type="date"
                                class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                        type="button"
                        @click="isNewOrderModalOpen = false"
                        class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        @click="handleSaveNewOrder"
                        class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                    >
                        Simpan Pesanan
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>
