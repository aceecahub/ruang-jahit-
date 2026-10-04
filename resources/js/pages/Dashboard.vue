<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Head } from "@inertiajs/vue3";
import { dashboard } from "@/routes";
import { useAppearance } from "@/composables/useAppearance";
import { useDashboardTab } from "@/composables/useDashboardTab";
import { toast } from "vue-sonner";

import { Calendar, Plus, X } from "@lucide/vue";

// Filter Bar and Subviews
import FilterBar, {
    type FilterState,
} from "@/components/dashboard/FilterBar.vue";

import OverviewView from "@/components/dashboard/OverviewView.vue";
import SalesView from "@/components/dashboard/SalesView.vue";
import OrdersView from "@/components/dashboard/OrdersView.vue";
import ProductionView from "@/components/dashboard/ProductionView.vue";
import FinanceView from "@/components/dashboard/FinanceView.vue";
import InventoryView from "@/components/dashboard/InventoryView.vue";
import CustomerView from "@/components/dashboard/CustomerView.vue";
import EmployeeView from "@/components/dashboard/EmployeeView.vue";
import QualityDeliveryView from "@/components/dashboard/QualityDeliveryView.vue";

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: "Dashboard Owner",
                href: dashboard(),
            },
        ],
    },
});

// Props dari Laravel Controller
const props = defineProps<{
    initialTab?: string;
    customKpis?: any;
    customOrders?: any;

    orderanMasuk: number;
    totalKuantitas: number;
    totalHpp: number;
    totalJual: number;

    distribusiModel?: Array<{
        nm_model: string;
        total_qty: number;
        persentase: number;
    }>;

    trendKuantitas?: Array<{
        tanggal: string;
        total_qty: number;
    }>;

    orderList?: Array<{
        nomor_baris: number;
        id_order: number;
        no_order: string;
        tgl_order: string;
        no_po: string;
        kd_cus: string;
        nm_cus: string;
        jenis_order: number;
        nama_jenis: string;
        status: number;
        nama_status: string;
        total_qty: number;
        total_hpp: number;
        total_jual: number;
        tgl_estimasi: string;
    }>;

    orderPagination?: {
        total_data: number;
        halaman: number;
        per_halaman: number;
        total_halaman: number;
    };
}>();

// Theme tracking
const { resolvedAppearance } = useAppearance();

const isDark = computed(() => resolvedAppearance.value === "dark");

// Navigation Tabs
const { activeTab, tabs, switchTab, initTabFromUrl } = useDashboardTab();

// Dynamic title berdasarkan tab aktif
const currentTabTitle = computed(() => {
    const found = tabs.find((tab) => tab.key === activeTab.value);

    return found ? found.title : "Dashboard Owner";
});

// Filter state
const filters = ref<FilterState>({
    period: "monthly",
    category: "Semua Kategori",
    status: "Semua Status",
    searchQuery: "",
});

// Modal state untuk "+ Order Baru"
const isNewOrderModalOpen = ref(false);

// Initialize tab
onMounted(() => {
    initTabFromUrl();

    if (props.initialTab) {
        switchTab(props.initialTab);
    }
});

// Export handler
function handleExport() {
    toast.success("Laporan berhasil diekspor!", {
        description: `Data analitik ${currentTabTitle.value} telah diunduh (format CSV/Excel).`,
    });
}

// Save new order handler
function handleSaveNewOrder() {
    isNewOrderModalOpen.value = false;

    toast.success("Pesanan jahit baru berhasil disimpan!", {
        description:
            "Order telah masuk ke dalam antrean tunggu konfirmasi & alokasi bahan.",
    });
}
</script>

<template>
    <Head :title="`Dashboard - ${currentTabTitle}`" />

    <div
        class="min-h-full bg-[#f4f6fa] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6"
    >
        <!-- ========================================================= -->
        <!-- TOP HEADER -->
        <!-- ========================================================= -->

        <header
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
            <div>
                <div class="flex items-center gap-2.5">
                    <h1
                        class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
                    >
                        {{ currentTabTitle }}
                    </h1>
                </div>

                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Sistem kendali operasional, finansial & produksi real-time
                </p>
            </div>

            <!-- Date Filter & Quick Actions -->
            <div class="flex flex-wrap items-center gap-2.5">
                <!-- Periode -->
                <div
                    v-if="activeTab !== 'orders' && activeTab !== 'production'"
                    class="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs"
                >
                    <Calendar class="h-3.5 w-3.5 text-slate-400" />

                    <span> Periode: September 2026 </span>
                </div>

                <!-- Order Baru -->
                <!-- <button
                    type="button"
                    @click="isNewOrderModalOpen = true"
                    class="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-xs transition active:scale-[0.98] cursor-pointer"
                >
                    <Plus class="h-3.5 w-3.5" />

                    Order Baru
                </button> -->
            </div>
        </header>

        <!-- ========================================================= -->
        <!-- FILTER BAR -->
        <!-- ========================================================= -->

        <FilterBar
            v-if="activeTab !== 'orders' && activeTab !== 'production'"
            v-model="filters"
            :show-category-filter="
                ['overview', 'sales', 'inventory'].includes(activeTab)
            "
            :show-status-filter="['overview', 'inventory'].includes(activeTab)"
            @export="handleExport"
        />

        <!-- ========================================================= -->
        <!-- ACTIVE VIEW -->
        <!-- ========================================================= -->

        <main class="transition-opacity duration-150">
            <!-- OVERVIEW -->
            <OverviewView
                v-if="activeTab === 'overview'"
                :is-dark="isDark"
                :period="filters.period"
                @navigate="switchTab"
            />

            <!-- SALES -->
            <SalesView
                v-else-if="activeTab === 'sales'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
                :category-filter="filters.category"
            />

            <!-- ORDERS / PRODUCTION -->
            <OrdersView
                v-else-if="activeTab === 'orders' || activeTab === 'production'"
                :is-dark="isDark"
                :orderan-data="props.orderanMasuk"
                :total-kuantitas="props.totalKuantitas"
                :total-hpp="props.totalHpp"
                :total-jual="props.totalJual"
                :distribusi-model="props.distribusiModel"
                :trend-kuantitas="props.trendKuantitas"
                :order-list="props.orderList"
                :order-pagination="props.orderPagination"
            />

            <!-- FINANCE -->
            <FinanceView
                v-else-if="activeTab === 'finance'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
            />

            <!-- INVENTORY -->
            <InventoryView
                v-else-if="activeTab === 'inventory'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
                :category-filter="filters.category"
                :status-filter="filters.status"
            />

            <!-- CUSTOMERS -->
            <CustomerView
                v-else-if="activeTab === 'customers'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
            />

            <!-- EMPLOYEES -->
            <EmployeeView
                v-else-if="activeTab === 'employees'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
            />

            <!-- QUALITY & DELIVERY -->
            <QualityDeliveryView
                v-else-if="activeTab === 'quality'"
                :is-dark="isDark"
                :search-query="filters.searchQuery"
            />
        </main>

        <!-- ========================================================= -->
        <!-- MODAL TAMBAH ORDER BARU -->
        <!-- ========================================================= -->

        <div
            v-if="isNewOrderModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
        >
            <div
                class="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 shadow-xl space-y-4"
            >
                <!-- Modal Header -->
                <div
                    class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800"
                >
                    <h3
                        class="text-base font-bold text-slate-900 dark:text-white"
                    >
                        Buat Pesanan Jahit Baru
                    </h3>

                    <button
                        type="button"
                        @click="isNewOrderModalOpen = false"
                        class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <!-- Modal Form -->
                <div class="space-y-3 text-xs">
                    <!-- Customer -->
                    <div>
                        <label
                            class="block font-semibold text-slate-700 dark:text-slate-300 mb-1"
                        >
                            Nama Pelanggan / Instansi
                        </label>

                        <input
                            type="text"
                            placeholder="Contoh: PT Samudera Logistik"
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <!-- Item -->
                    <div>
                        <label
                            class="block font-semibold text-slate-700 dark:text-slate-300 mb-1"
                        >
                            Jenis Pakaian / Item
                        </label>

                        <input
                            type="text"
                            placeholder="Contoh: Kemeja Drill Kombinasi"
                            class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <!-- Quantity & Deadline -->
                    <div class="grid grid-cols-2 gap-3">
                        <!-- Quantity -->
                        <div>
                            <label
                                class="block font-semibold text-slate-700 dark:text-slate-300 mb-1"
                            >
                                Jumlah (Pcs)
                            </label>

                            <input
                                type="number"
                                placeholder="150"
                                class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <!-- Deadline -->
                        <div>
                            <label
                                class="block font-semibold text-slate-700 dark:text-slate-300 mb-1"
                            >
                                Tenggat Waktu
                            </label>

                            <input
                                type="date"
                                class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div
                    class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800"
                >
                    <!-- Cancel -->
                    <button
                        type="button"
                        @click="isNewOrderModalOpen = false"
                        class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                        Batal
                    </button>

                    <!-- Save -->
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
