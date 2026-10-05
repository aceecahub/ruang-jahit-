<script setup lang="ts">
import { computed, onMounted } from "vue";
import { Head } from "@inertiajs/vue3";
import { dashboard } from "@/routes";
import { useAppearance } from "@/composables/useAppearance";
import { useDashboardTab } from "@/composables/useDashboardTab";
import OrdersView from "@/components/dashboard/OrdersView.vue";

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
const { initTabFromUrl } = useDashboardTab();

onMounted(() => {
    initTabFromUrl();
});
</script>

<template>
    <Head title="Dashboard - Orderan" />

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
                        Orderan
                    </h1>
                </div>

                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Sistem kendali operasional & pemantauan pesanan real-time
                </p>
            </div>
        </header>

        <!-- ========================================================= -->
        <!-- ORDERS VIEW -->
        <!-- ========================================================= -->
        <main class="transition-opacity duration-150">
            <OrdersView
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
        </main>
    </div>
</template>
