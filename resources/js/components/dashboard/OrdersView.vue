<script setup lang="ts">
import { router } from "@inertiajs/vue3";
import { ref, computed, watch, nextTick } from "vue";

import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Search,
    Download,
    Eye,
    ShoppingBag,
    Boxes,
    Banknote,
    Layers,
    Users,
    ArrowUpDown,
    Clock,
    Printer,
    FileText,
    SlidersHorizontal,
    ChevronDown,
} from "@lucide/vue";

import KpiCard from "./KpiCard.vue";

import {
    ORDER_STATUS_MAP,
    isOrderOverdue,
    isOrderApproaching,
} from "@/data/orderData";

import { formatNumber, formatRupiah, formatDateIndo } from "@/lib/formatters";

import { toast } from "vue-sonner";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar, Doughnut, Line } from "vue-chartjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
);

/* ============================================================
   PROPS
   ============================================================ */

type OrderListItem = {
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
};

<<<<<<< HEAD
=======
type OrderDetailModel = {
    id_order: number;
    tgl_order: string;
    nm_model: string;
    qty: number;
    hpp: number;
    harga_jual: number;
};

>>>>>>> 77390b0 (filter resposif list data)
type OrderPagination = {
    total_data: number;
    halaman: number;
    per_halaman: number;
    total_halaman: number;
};

const props = defineProps<{
    isDark?: boolean;

    orderanData?: number | string;

    totalKuantitas?: number | string;

    totalHpp?: number | string;

    totalJual?: number | string;

    distribusiModel?: Array<{
        nm_model: string;
        total_qty: number;
        persentase: number;
    }>;

    trendKuantitas?: Array<{
        tanggal: string;
        total_qty: number;
    }>;

    orderList?: OrderListItem[];

<<<<<<< HEAD
=======
    orderDetailModels?: OrderDetailModel[];

>>>>>>> 77390b0 (filter resposif list data)
    orderPagination?: OrderPagination;
}>();

/* ============================================================
   HELPER TANGGAL
   ============================================================ */

function formatDateToYmd(date: Date): string {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const TODAY_DATE = formatDateToYmd(new Date());

function parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day);
}

function addDays(date: Date, amount: number): Date {
    const result = new Date(date);

    result.setDate(result.getDate() + amount);

    return result;
}

function getDayDifference(start: Date, end: Date): number {
    const startTime = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
    ).getTime();

    const endTime = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
    ).getTime();

    return Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24));
}

function formatShortDate(dateString: string): string {
    const date = parseDate(dateString);

    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
    }).format(date);
}

function formatMonth(dateString: string): string {
    const date = parseDate(dateString);

    return new Intl.DateTimeFormat("id-ID", {
        month: "short",
    }).format(date);
}

/* ============================================================
   FILTER PERIODE
   ============================================================ */

type PeriodPreset =
    | "today"
    | "this_week"
    | "this_month"
    | "this_year"
    | "custom";

const activePreset = ref<PeriodPreset>("this_month");

const todayDateObject = parseDate(TODAY_DATE);

const defaultYear = todayDateObject.getFullYear();

const defaultMonth = String(todayDateObject.getMonth() + 1).padStart(2, "0");

const defaultLastDay = new Date(
    defaultYear,
    todayDateObject.getMonth() + 1,
    0,
).getDate();

const startDate = ref<string>(`${defaultYear}-${defaultMonth}-01`);

const endDate = ref<string>(`${defaultYear}-${defaultMonth}-${defaultLastDay}`);

const customStartInput = ref<string>(`${defaultYear}-${defaultMonth}-01`);

const customEndInput = ref<string>(TODAY_DATE);

const periodOffset = ref(0);

/* Tampilan filter mobile. */
const mobileFilterOpen = ref(false);
const mobileCustomSelected = ref(false);
const mobilePresetList = ref<HTMLDivElement | null>(null);

const mobilePeriodPresets: { key: PeriodPreset; label: string }[] = [
    { key: "today", label: "Hari Ini" },
    { key: "this_week", label: "Minggu Ini" },
    { key: "this_month", label: "Bulan Ini" },
    { key: "this_year", label: "Tahun Ini" },
    { key: "custom", label: "Rentang Khusus" },
];

const mobileSelectedPreset = computed<PeriodPreset>(() =>
    mobileCustomSelected.value ? "custom" : activePreset.value,
);

const mobilePeriodLabel = computed(() => {
    const labels: Record<PeriodPreset, string> = {
        today: "Hari Ini",
        this_week: "Minggu Ini",
        this_month: "Bulan Ini",
        this_year: "Tahun Ini",
        custom: "Rentang Khusus",
    };

    return labels[activePreset.value];
});

async function revealMobilePreset() {
    await nextTick();

    const list = mobilePresetList.value;
    const selected = list?.querySelector<HTMLButtonElement>(
        '[aria-pressed="true"]',
    );

    if (!list || !selected) return;

    const left = selected.offsetLeft;
    const right = left + selected.offsetWidth;

    if (left < list.scrollLeft) {
        list.scrollLeft = left;
    } else if (right > list.scrollLeft + list.clientWidth) {
        list.scrollLeft = right - list.clientWidth;
    }
}

function toggleMobileFilter() {
    mobileFilterOpen.value = !mobileFilterOpen.value;

    if (mobileFilterOpen.value) {
        void revealMobilePreset();
    }
}

function selectMobilePreset(preset: PeriodPreset) {
    mobileCustomSelected.value = preset === "custom";

    if (preset !== "custom") {
        applyPreset(preset);
    }

    void revealMobilePreset();
}

function applyMobileCustomRange() {
    const valid = Boolean(
        customStartInput.value &&
        customEndInput.value &&
        customStartInput.value <= customEndInput.value,
    );

    applyCustomRange();

    if (valid) {
        mobileCustomSelected.value = false;
        mobileFilterOpen.value = false;
    }
}

function resetMobilePeriod() {
    mobileCustomSelected.value = false;

    resetPeriod();
    void revealMobilePreset();
}

/* ============================================================
   TABLE FILTER STATE
   ============================================================ */

const tableSearch = ref("");

const statusFilter = ref("ALL");

const typeFilter = ref("ALL");

const sortBy = ref<
    "tgl_order" | "no_order" | "total_jual" | "total_qty" | "tgl_estimasi"
>("tgl_order");

const sortOrder = ref<"asc" | "desc">("desc");

const perPage = ref(10);

const currentPage = ref(1);

/* ============================================================
   FETCH BACKEND
   ============================================================ */

function fetchOrderan() {
    const filterMap: Record<PeriodPreset, string> = {
        today: "day",
        this_week: "week",
        this_month: "month",
        this_year: "year",
        custom: "custom",
    };

    router.get(
        "/dashboard",
        {
            filter: filterMap[activePreset.value],

            tanggal_awal: startDate.value,

            tanggal_akhir: endDate.value,

            cari: tableSearch.value.trim() || null,

            status: statusFilter.value === "ALL" ? null : statusFilter.value,

            jenis_order: typeFilter.value === "ALL" ? null : typeFilter.value,

            halaman: currentPage.value,

            per_halaman: perPage.value,

            urut_kolom: sortBy.value,

            urut_arah: sortOrder.value.toUpperCase(),
        },
        {
            preserveState: true,

            preserveScroll: true,

            replace: true,
        },
    );
}

/* ============================================================
   APPLY PRESET
   ============================================================ */

function applyPreset(preset: PeriodPreset) {
    activePreset.value = preset;

    periodOffset.value = 0;

    const base = parseDate(TODAY_DATE);

    if (preset === "today") {
        startDate.value = TODAY_DATE;

        endDate.value = TODAY_DATE;

        currentPage.value = 1;

        fetchOrderan();

        return;
    }

    if (preset === "this_week") {
        const day = base.getDay();

        const diffToMonday = day === 0 ? -6 : 1 - day;

        const monday = new Date(base);

        monday.setDate(base.getDate() + diffToMonday);

        const sunday = addDays(monday, 6);

        startDate.value = formatDateToYmd(monday);

        endDate.value = formatDateToYmd(sunday);

        currentPage.value = 1;

        fetchOrderan();

        return;
    }

    if (preset === "this_month") {
        const year = base.getFullYear();

        const month = String(base.getMonth() + 1).padStart(2, "0");

        const lastDay = new Date(year, base.getMonth() + 1, 0).getDate();

        startDate.value = `${year}-${month}-01`;

        endDate.value = `${year}-${month}-${lastDay}`;

        currentPage.value = 1;

        fetchOrderan();

        return;
    }

    if (preset === "this_year") {
        const year = base.getFullYear();

        startDate.value = `${year}-01-01`;

        endDate.value = `${year}-12-31`;

        currentPage.value = 1;

        fetchOrderan();

        return;
    }

    if (preset === "custom") {
        startDate.value = customStartInput.value;

        endDate.value = customEndInput.value;

        currentPage.value = 1;

        fetchOrderan();
    }
}

/* ============================================================
   CUSTOM RANGE
   ============================================================ */

function applyCustomRange() {
    if (!customStartInput.value || !customEndInput.value) {
        toast.error("Tanggal mulai dan tanggal akhir wajib diisi.");

        return;
    }

    if (customStartInput.value > customEndInput.value) {
        toast.error(
            "Tanggal mulai tidak boleh lebih besar dari tanggal akhir.",
        );

        return;
    }

    activePreset.value = "custom";

    periodOffset.value = 0;

    startDate.value = customStartInput.value;

    endDate.value = customEndInput.value;

    currentPage.value = 1;

    fetchOrderan();

    toast.success("Rentang tanggal khusus berhasil diterapkan.");
}

/* ============================================================
   RESET PERIODE
   ============================================================ */

function resetPeriod() {
    activePreset.value = "this_month";

    periodOffset.value = 0;

    const today = parseDate(TODAY_DATE);

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();

    startDate.value = `${year}-${month}-01`;

    endDate.value = `${year}-${month}-${lastDay}`;

    customStartInput.value = `${year}-${month}-01`;

    customEndInput.value = TODAY_DATE;

    currentPage.value = 1;

    tableSearch.value = "";

    statusFilter.value = "ALL";

    typeFilter.value = "ALL";

    sortBy.value = "tgl_order";

    sortOrder.value = "desc";

    perPage.value = 10;

    fetchOrderan();

    toast.info("Filter periode dikembalikan ke Bulan Ini.");
}

/* ============================================================
   NAVIGASI PERIODE
   ============================================================ */

function navigatePeriod(direction: -1 | 1) {
    if (activePreset.value === "custom") {
        return;
    }

    periodOffset.value += direction;

    const base = parseDate(TODAY_DATE);

    if (activePreset.value === "today") {
        const target = new Date(base);

        target.setDate(target.getDate() + periodOffset.value);

        const date = formatDateToYmd(target);

        startDate.value = date;

        endDate.value = date;
    }

    if (activePreset.value === "this_week") {
        const day = base.getDay();

        const diffToMonday = day === 0 ? -6 : 1 - day;

        const monday = new Date(base);

        monday.setDate(base.getDate() + diffToMonday + periodOffset.value * 7);

        const sunday = addDays(monday, 6);

        startDate.value = formatDateToYmd(monday);

        endDate.value = formatDateToYmd(sunday);
    }

    if (activePreset.value === "this_month") {
        const targetDate = new Date(
            base.getFullYear(),
            base.getMonth() + periodOffset.value,
            1,
        );

        const year = targetDate.getFullYear();

        const month = String(targetDate.getMonth() + 1).padStart(2, "0");

        const lastDay = new Date(year, targetDate.getMonth() + 1, 0).getDate();

        startDate.value = `${year}-${month}-01`;

        endDate.value = `${year}-${month}-${lastDay}`;
    }

    if (activePreset.value === "this_year") {
        const year = base.getFullYear() + periodOffset.value;

        startDate.value = `${year}-01-01`;

        endDate.value = `${year}-12-31`;
    }

    currentPage.value = 1;

    fetchOrderan();
}

/* ============================================================
   BACKEND TABLE DATA
   ============================================================ */

const paginatedOrders = computed(() => {
    return props.orderList ?? [];
});

const totalPages = computed(() => {
    return props.orderPagination?.total_halaman ?? 1;
});

const totalData = computed(() => {
    return props.orderPagination?.total_data ?? 0;
});

const displayedFrom = computed(() => {
    if (totalData.value === 0) {
        return 0;
    }

    return (currentPage.value - 1) * perPage.value + 1;
});

const displayedTo = computed(() => {
    if (totalData.value === 0) {
        return 0;
    }

    return Math.min(currentPage.value * perPage.value, totalData.value);
});

/* ============================================================
   SORTING
   ============================================================ */

function toggleSort(
    column:
        | "tgl_order"
        | "no_order"
        | "total_jual"
        | "total_qty"
        | "tgl_estimasi",
) {
    if (sortBy.value === column) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
        sortBy.value = column;

        sortOrder.value = "desc";
    }

    currentPage.value = 1;

    fetchOrderan();
}

/* ============================================================
   TABLE FILTER WATCH
   ============================================================ */

watch([statusFilter, typeFilter, perPage], () => {
    currentPage.value = 1;

    fetchOrderan();
});

/* ============================================================
   SEARCH DEBOUNCE
   ============================================================ */

let searchTimer: ReturnType<typeof setTimeout> | null = null;

watch(tableSearch, () => {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => {
        currentPage.value = 1;

        fetchOrderan();
    }, 400);
});

/* ============================================================
   PAGINATION
   ============================================================ */

function goToPage(page: number) {
    if (page < 1 || page > totalPages.value || page === currentPage.value) {
        return;
    }

    currentPage.value = page;

    fetchOrderan();
}

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value += 1;

        fetchOrderan();
    }
}

function previousPage() {
    if (currentPage.value > 1) {
        currentPage.value -= 1;

        fetchOrderan();
    }
}

/* ============================================================
   TYPE OPTIONS
   ============================================================ */

const orderTypeOptions = computed(() => {
    const map = new Map<number, string>();

    for (const order of props.orderList ?? []) {
        if (order.jenis_order !== null && order.jenis_order !== undefined) {
            map.set(
                Number(order.jenis_order),
                order.nama_jenis || `Jenis ${order.jenis_order}`,
            );
        }
    }

    return Array.from(map.entries()).map(([value, label]) => ({
        value,
        label,
    }));
});

/* ============================================================
   CSV EXPORT
   ============================================================ */

function escapeCsv(value: unknown): string {
    const stringValue =
        value === null || value === undefined ? "" : String(value);

    return `"${stringValue.replace(/"/g, '""')}"`;
}

function triggerCsvExport() {
    if (totalData.value === 0) {
        toast.warning("Tidak ada orderan pada periode ini untuk diekspor.");

        return;
    }

    /*
     * Export mengikuti data yang sedang
     * tersedia di halaman saat ini.
     *
     * Untuk export seluruh hasil filter,
     * gunakan branch @bagian = 'export'
     * di stored procedure melalui endpoint
     * export terpisah.
     */

    const headers = [
        "No Order",
        "Tanggal Order",
        "No PO",
        "Kode Customer",
        "Nama Customer",
        "Jenis Order",
        "Status",
        "Total Qty",
        "Total HPP",
        "Total Jual",
        "Tanggal Estimasi",
    ];

    const rows = paginatedOrders.value.map((order) => [
        order.no_order,
        order.tgl_order,
        order.no_po,
        order.kd_cus,
        order.nm_cus,
        order.nama_jenis,
        order.nama_status,
        order.total_qty,
        order.total_hpp,
        order.total_jual,
        order.tgl_estimasi,
    ]);

    const csvContent = [
        headers.map(escapeCsv).join(","),
        ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `Orderan_${startDate.value}_sd_${endDate.value}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success("File CSV berhasil diunduh.");
}

/* ============================================================
   CHART BUCKET
   ============================================================ */

type ChartBucket = {
    start: string;
    end: string;
    label: string;
};

/* ============================================================
   DAILY BUCKET
   ============================================================ */

function createDailyBuckets(start: Date, end: Date): ChartBucket[] {
    const buckets: ChartBucket[] = [];

    let current = new Date(start);

    while (current <= end) {
        const date = formatDateToYmd(current);

        buckets.push({
            start: date,
            end: date,
            label: formatShortDate(date),
        });

        current = addDays(current, 1);
    }

    return buckets;
}

/* ============================================================
   WEEKLY BUCKET
   ============================================================ */

function createWeeklyBuckets(start: Date, end: Date): ChartBucket[] {
    const buckets: ChartBucket[] = [];

    let current = new Date(start);

    while (current <= end) {
        const bucketStart = new Date(current);

        let bucketEnd = addDays(bucketStart, 6);

        if (bucketEnd > end) {
            bucketEnd = new Date(end);
        }

        const startString = formatDateToYmd(bucketStart);

        const endString = formatDateToYmd(bucketEnd);

        const startDay = bucketStart.getDate();

        const endDay = bucketEnd.getDate();

        const month = formatMonth(startString);

        buckets.push({
            start: startString,

            end: endString,

            label:
                startDay === endDay
                    ? `${startDay} ${month}`
                    : `${startDay}-${endDay} ${month}`,
        });

        current = addDays(bucketEnd, 1);
    }

    return buckets;
}

/* ============================================================
   MONTHLY BUCKET
   ============================================================ */

function createMonthlyBuckets(start: Date, end: Date): ChartBucket[] {
    const buckets: ChartBucket[] = [];
    const isMultiYear = start.getFullYear() !== end.getFullYear();

    let current = new Date(start.getFullYear(), start.getMonth(), 1);

    while (current <= end) {
        const monthStart = new Date(
            current.getFullYear(),
            current.getMonth(),
            1,
        );

        const monthEnd = new Date(
            current.getFullYear(),
            current.getMonth() + 1,
            0,
        );

        const actualStart = monthStart < start ? new Date(start) : monthStart;

        const actualEnd = monthEnd > end ? new Date(end) : monthEnd;

        const startString = formatDateToYmd(actualStart);

        const endString = formatDateToYmd(actualEnd);

        const monthLabel = new Intl.DateTimeFormat("id-ID", {
            month: "short",
        }).format(monthStart);

        const label = isMultiYear
            ? `${monthLabel} '${String(monthStart.getFullYear()).slice(-2)}`
            : monthLabel;

        buckets.push({
            start: startString,

            end: endString,

            label: label,
        });

        current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    return buckets;
}

/* ============================================================
   TREND BUCKET
   ============================================================ */

const orderTrendBuckets = computed<ChartBucket[]>(() => {
    const start = parseDate(startDate.value);

    const end = parseDate(endDate.value);

    const totalDays = getDayDifference(start, end) + 1;

    if (activePreset.value === "today" || activePreset.value === "this_week") {
        return createDailyBuckets(start, end);
    }

    if (activePreset.value === "this_month") {
        return createWeeklyBuckets(start, end);
    }

    if (activePreset.value === "this_year") {
        return createMonthlyBuckets(start, end);
    }

    // Rentang Khusus (custom preset):
    // <= 31 hari: per hari (daily)
    // < 88 hari (kurang dari 3 bulan): per minggu (weekly)
    // >= 88 hari (3 bulan atau lebih): per bulan (monthly) agar grafik tidak renyek & tidak terlalu padat
    if (totalDays <= 31) {
        return createDailyBuckets(start, end);
    }

    if (totalDays < 88) {
        return createWeeklyBuckets(start, end);
    }

    return createMonthlyBuckets(start, end);
});

const trendAggregationLabel = computed(() => {
    const start = parseDate(startDate.value);
    const end = parseDate(endDate.value);
    const totalDays = getDayDifference(start, end) + 1;

    if (activePreset.value === "today" || activePreset.value === "this_week") {
        return "Per Hari";
    }

    if (activePreset.value === "this_month") {
        return "Per Minggu";
    }

    if (activePreset.value === "this_year") {
        return "Per Bulan";
    }

    if (totalDays <= 31) {
        return "Per Hari";
    }

    if (totalDays < 88) {
        return "Per Minggu";
    }

    return "Per Bulan";
});

/* ============================================================
   QUANTITY PER BUCKET
   ============================================================ */

function getQuantityForBucket(bucketStart: string, bucketEnd: string): number {
    return (props.trendKuantitas ?? []).reduce((total, item) => {
        const tanggal = String(item.tanggal).slice(0, 10);

        if (tanggal >= bucketStart && tanggal <= bucketEnd) {
            return total + Number(item.total_qty || 0);
        }

        return total;
    }, 0);
}

/* ============================================================
   TREND CHART
   ============================================================ */

const orderTrendChartData = computed(() => {
    const buckets = orderTrendBuckets.value;

    return {
        labels: buckets.map((bucket) => bucket.label),

        datasets: [
            {
                label: "Kuantitas Orderan",

                data: buckets.map((bucket) =>
                    getQuantityForBucket(bucket.start, bucket.end),
                ),

                borderColor: "#2563eb",

                backgroundColor: props.isDark
                    ? "rgba(37, 99, 235, 0.15)"
                    : "rgba(37, 99, 235, 0.08)",

                borderWidth: 2.5,

                fill: true,

                tension: 0.3,

                pointBackgroundColor: "#2563eb",

                pointBorderColor: "#2563eb",

                pointRadius: 3,

                pointHoverRadius: 5,
            },
        ],
    };
});

/* ============================================================
   TREND CHART OPTIONS
   ============================================================ */

const quantityChartOptions = computed(() => ({
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
        mode: "index" as const,

        intersect: false,
    },

    plugins: {
        legend: {
            position: "top" as const,

            align: "end" as const,

            labels: {
                color: props.isDark ? "#cbd5e1" : "#64748b",

                boxWidth: 8,

                boxHeight: 8,

                padding: 10,

                font: {
                    size: 11,
                },
            },
        },

        tooltip: {
            backgroundColor: props.isDark ? "#0f172a" : "#ffffff",

            titleColor: props.isDark ? "#f8fafc" : "#0f172a",

            bodyColor: props.isDark ? "#cbd5e1" : "#475569",

            borderColor: props.isDark ? "#334155" : "#e2e8f0",

            borderWidth: 1,

            callbacks: {
                title: (items: any[]) => {
                    if (!items || !items.length) return "";
                    const idx = items[0].dataIndex;
                    const bucket = orderTrendBuckets.value[idx];
                    if (!bucket) return items[0].label;
                    if (bucket.start === bucket.end) {
                        return formatDateIndo(bucket.start);
                    }
                    return `${formatDateIndo(bucket.start)} – ${formatDateIndo(bucket.end)}`;
                },

                label: (ctx: any) => {
                    const value = Number(ctx.parsed.y ?? 0);

                    return ` Kuantitas: ${formatNumber(value)} pcs`;
                },
            },
        },
    },

    scales: {
        y: {
            beginAtZero: true,

            grid: {
                color: props.isDark
                    ? "rgba(51, 65, 85, 0.4)"
                    : "rgba(241, 245, 249, 1)",
            },

            ticks: {
                color: props.isDark ? "#64748b" : "#94a3b8",

                precision: 0,

                callback: (value: any) => `${formatNumber(Number(value))} pcs`,

                font: {
                    size: 10,
                },
            },

            border: {
                display: false,
            },
        },

        x: {
            grid: {
                display: false,
            },

            ticks: {
                color: props.isDark ? "#94a3b8" : "#64748b",

                maxRotation: orderTrendBuckets.value.length > 8 ? 45 : 0,

                minRotation: 0,

                autoSkip: false,

                font: {
                    size: 10,
                },
            },

            border: {
                display: false,
            },
        },
    },
}));

/* ============================================================
   MODEL DISTRIBUTION
   ============================================================ */

const orderModelDistributionData = computed(() => ({
    labels: (props.distribusiModel ?? []).map((item) => item.nm_model),

    datasets: [
        {
            data: (props.distribusiModel ?? []).map((item) =>
                Number(item.total_qty),
            ),

            backgroundColor: [
                "#2563eb",
                "#10b981",
                "#f59e0b",
                "#8b5cf6",
                "#ec4899",
                "#06b6d4",
                "#f97316",
                "#14b8a6",
                "#a855f7",
                "#64748b",
            ],

            borderWidth: 2,

            borderColor: props.isDark ? "#0f172a" : "#ffffff",
        },
    ],
}));

/* ============================================================
   DONUT OPTIONS
   ============================================================ */

const donutChartOptions = computed(() => ({
    responsive: true,

    maintainAspectRatio: false,

    cutout: "70%",

    plugins: {
        legend: {
            position: "bottom" as const,

            labels: {
                color: props.isDark ? "#cbd5e1" : "#64748b",

                boxWidth: 8,

                padding: 10,

                font: {
                    size: 10,
                },
            },
        },
    },
}));

/* ============================================================
   JENIS ORDER
   ============================================================ */

const orderTypeChartData = computed(() => {
    const orderMap = new Map<
        string,
        {
            nama_jenis: string;
            total_order: number;
            total_qty: number;
        }
    >();

    for (const order of props.orderList ?? []) {
        const key = String(order.jenis_order);

        if (!orderMap.has(key)) {
            orderMap.set(key, {
                nama_jenis: order.nama_jenis || `Jenis ${key}`,
                total_order: 0,
                total_qty: 0,
            });
        }

        const current = orderMap.get(key)!;

        current.total_order += 1;
        current.total_qty += Number(order.total_qty || 0);
    }

    const items = Array.from(orderMap.values());

    return {
        labels: items.map((item) => item.nama_jenis),

        datasets: [
            {
                label: "Jumlah Order",

                data: items.map((item) => item.total_order),

                backgroundColor: [
                    "#f59e0b", // amber
                    "#8b5cf6", // violet
                    "#ec4899", // pink
                    "#f97316", // orange
                    "#64748b", // slate
                ],

                borderRadius: 6,

                borderSkipped: false,

                maxBarThickness: 42,
            },
        ],
    };
});

/* ============================================================
   JENIS ORDER OPTIONS
   ============================================================ */

const orderTypeChartOptions = computed(() => ({
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
        legend: {
            display: false,
        },

        tooltip: {
            backgroundColor: props.isDark ? "#0f172a" : "#ffffff",

            titleColor: props.isDark ? "#f8fafc" : "#0f172a",

            bodyColor: props.isDark ? "#cbd5e1" : "#475569",

            borderColor: props.isDark ? "#334155" : "#e2e8f0",

            borderWidth: 1,

            callbacks: {
                label: (ctx: any) => {
                    return ` ${formatNumber(Number(ctx.parsed.y ?? 0))} order`;
                },
            },
        },
    },

    scales: {
        y: {
            beginAtZero: true,

            ticks: {
                precision: 0,

                color: props.isDark ? "#64748b" : "#94a3b8",

                font: {
                    size: 10,
                },

                callback: (value: any) => {
                    return formatNumber(Number(value));
                },
            },

            grid: {
                color: props.isDark
                    ? "rgba(51, 65, 85, 0.4)"
                    : "rgba(241, 245, 249, 1)",
            },

            border: {
                display: false,
            },
        },

        x: {
            ticks: {
                color: props.isDark ? "#94a3b8" : "#64748b",

                font: {
                    size: 10,

                    weight: "600",
                },
            },

            grid: {
                display: false,
            },

            border: {
                display: false,
            },
        },
    },
}));
/* ============================================================
   DETAIL ORDER
   ============================================================ */

const isDetailOpen = ref(false);
<<<<<<< HEAD

=======
const isFakturModalOpen = ref(false);
const mobileTableFilterOpen = ref(false);
>>>>>>> 77390b0 (filter resposif list data)
const selectedOrder = ref<OrderListItem | null>(null);

const selectedOrderModels = ref<OrderDetailModel[]>([]);

function openOrderDetail(order: OrderListItem) {
    selectedOrder.value = order;

    // Kosongkan detail sebelumnya agar model dari order sebelumnya
    // tidak ikut tampil ketika order baru dibuka.
    selectedOrderModels.value = [];

    isDetailOpen.value = true;
<<<<<<< HEAD
=======

    const filterMap: Record<PeriodPreset, string> = {
        today: "day",
        this_week: "week",
        this_month: "month",
        this_year: "year",
        custom: "custom",
    };

    router.get(
        "/dashboard",
        {
            filter: filterMap[activePreset.value],

            tanggal_awal: startDate.value,

            tanggal_akhir: endDate.value,

            cari: tableSearch.value.trim() || null,

            status: statusFilter.value === "ALL" ? null : statusFilter.value,

            jenis_order: typeFilter.value === "ALL" ? null : typeFilter.value,

            halaman: currentPage.value,

            per_halaman: perPage.value,

            urut_kolom: sortBy.value,

            urut_arah: sortOrder.value.toUpperCase(),

            id_order: order.id_order,
        },
        {
            preserveState: true,

            preserveScroll: true,

            replace: true,

            onSuccess: (page) => {
                const pageProps = page.props as typeof page.props & {
                    orderDetailModels?: OrderDetailModel[];
                };

                selectedOrderModels.value = pageProps.orderDetailModels ?? [];
            },

            onError: () => {
                selectedOrderModels.value = [];

                toast.error("Gagal mengambil detail model order.");
            },
        },
    );
>>>>>>> 77390b0 (filter resposif list data)
}

/* ============================================================
   INITIAL DATA
   ============================================================ */

/*
 * Dashboard pertama kali dibuka oleh Laravel.
 *
 * Tidak perlu fetch manual di sini karena props
 * sudah diberikan oleh Inertia.
 */
</script>

<template>
    <div class="space-y-6">
        <!-- =========================================================
             FILTER PERIODE
             ========================================================= -->

        <section
            class="hidden md:block rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 shadow-sm shadow-slate-200/40 dark:shadow-none space-y-4"
        >
            <div
                class="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
                <!-- PRESET -->

                <div
                    class="flex flex-wrap items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-xl"
                >
                    <button
                        v-for="preset in [
                            {
                                key: 'today',
                                label: 'Hari Ini',
                            },
                            {
                                key: 'this_week',
                                label: 'Minggu Ini',
                            },
                            {
                                key: 'this_month',
                                label: 'Bulan Ini',
                            },
                            {
                                key: 'this_year',
                                label: 'Tahun Ini',
                            },
                            {
                                key: 'custom',
                                label: 'Rentang Khusus',
                            },
                        ]"
                        :key="preset.key"
                        type="button"
                        @click="applyPreset(preset.key as PeriodPreset)"
                        class="px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer"
                        :class="
                            activePreset === preset.key
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        "
                    >
                        {{ preset.label }}
                    </button>
                </div>

                <!-- NAVIGATION -->

                <div class="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        @click="navigatePeriod(-1)"
                        :disabled="activePreset === 'custom'"
                        title="Periode Sebelumnya"
                        class="p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs transition"
                    >
                        <ChevronLeft class="h-4 w-4" />
                    </button>

                    <div
                        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 text-xs font-bold text-blue-700 dark:text-blue-300"
                    >
                        <Calendar class="h-3.5 w-3.5" />

                        <span>
                            Periode:
                            {{ formatDateIndo(startDate) }}
                            –
                            {{ formatDateIndo(endDate) }}
                        </span>
                    </div>

                    <button
                        type="button"
                        @click="navigatePeriod(1)"
                        :disabled="activePreset === 'custom'"
                        title="Periode Berikutnya"
                        class="p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs transition"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        @click="resetPeriod"
                        title="Kembali ke Bulan Ini"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-xs transition"
                    >
                        <RotateCcw class="h-3.5 w-3.5" />

                        Reset
                    </button>
                </div>
            </div>

            <!-- CUSTOM RANGE -->

            <div
                v-if="activePreset === 'custom'"
                class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 animate-in fade-in duration-200"
            >
                <div class="flex items-center gap-2 text-xs">
                    <span class="text-slate-500 font-medium">
                        Tanggal Mulai:
                    </span>

                    <input
                        type="date"
                        v-model="customStartInput"
                        class="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div class="flex items-center gap-2 text-xs">
                    <span class="text-slate-500 font-medium">
                        Tanggal Akhir:
                    </span>

                    <input
                        type="date"
                        v-model="customEndInput"
                        class="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="button"
                    @click="applyCustomRange"
                    class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                    Terapkan Rentang
                </button>
            </div>
        </section>

        <!-- Filter mobile. -->
<<<<<<< HEAD
<section
    class="min-w-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm shadow-slate-200/40 md:hidden dark:border-slate-800/80 dark:bg-slate-900 dark:shadow-none"
    aria-label="Filter periode order"
>
    <div class="flex min-w-0 items-center justify-between gap-3">
        <div class="min-w-0 flex-1" aria-live="polite">
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
                {{ mobilePeriodLabel }}
            </p>
            <p class="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">
                {{ formatDateIndo(startDate) }} – {{ formatDateIndo(endDate) }}
            </p>
        </div>

        <button
            type="button"
            @click="toggleMobileFilter"
            :aria-expanded="mobileFilterOpen"
            aria-controls="order-mobile-period-panel"
            class="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-blue-200/60 bg-blue-50/80 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
        >
            <SlidersHorizontal class="h-3.5 w-3.5" aria-hidden="true" />
            Filter
            <ChevronDown
                class="h-3.5 w-3.5 transition-transform motion-reduce:transition-none"
                :class="{ 'rotate-180': mobileFilterOpen }"
                aria-hidden="true"
            />
        </button>
    </div>

    <div
        v-show="mobileFilterOpen"
        id="order-mobile-period-panel"
        class="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800"
    >
        <div
            ref="mobilePresetList"
            role="group"
            aria-label="Pilihan periode"
            class="relative flex min-w-0 flex-nowrap gap-1.5 overflow-x-auto pb-1"
        >
            <button
                v-for="preset in mobilePeriodPresets"
                :key="preset.key"
                type="button"
                @click="selectMobilePreset(preset.key)"
                :aria-pressed="mobileSelectedPreset === preset.key"
                class="min-h-11 shrink-0 cursor-pointer whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                :class="
                    mobileSelectedPreset === preset.key
                        ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                "
            >
                {{ preset.label }}
            </button>
        </div>

        <div
            v-if="mobileSelectedPreset === 'custom'"
            class="mt-2 grid min-w-0 grid-cols-2 gap-2"
        >
            <label class="min-w-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                Mulai
                <input
                    type="date"
                    v-model="customStartInput"
                    class="mt-1 block h-10 w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
            </label>

            <label class="min-w-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                Sampai
                <input
                    type="date"
                    v-model="customEndInput"
                    class="mt-1 block h-10 w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
            </label>
        </div>

        <div class="mt-1 flex items-center justify-between gap-2">
            <div
                v-if="mobileSelectedPreset !== 'custom'"
                class="flex items-center gap-1.5"
            >
                <button
                    type="button"
                    @click="navigatePeriod(-1)"
                    :disabled="activePreset === 'custom'"
                    aria-label="Periode sebelumnya"
                    class="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <ChevronLeft class="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                    type="button"
                    @click="navigatePeriod(1)"
                    :disabled="activePreset === 'custom'"
                    aria-label="Periode berikutnya"
                    class="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <ChevronRight class="h-4 w-4" aria-hidden="true" />
                </button>
            </div>

            <button
                type="button"
                @click="resetMobilePeriod"
                class="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-1 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
                <RotateCcw class="h-3.5 w-3.5" aria-hidden="true" />
                Reset
            </button>

            <button
                v-if="mobileSelectedPreset === 'custom'"
                type="button"
                @click="applyMobileCustomRange"
                class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
                Terapkan
            </button>
        </div>
    </div>
</section>
=======
        <section
            class="min-w-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm shadow-slate-200/40 md:hidden dark:border-slate-800/80 dark:bg-slate-900 dark:shadow-none"
            aria-label="Filter periode order"
        >
            <div class="flex min-w-0 items-center justify-between gap-3">
                <div class="min-w-0 flex-1" aria-live="polite">
                    <p
                        class="text-xs font-medium text-slate-500 dark:text-slate-400"
                    >
                        {{ mobilePeriodLabel }}
                    </p>
                    <p
                        class="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100"
                    >
                        {{ formatDateIndo(startDate) }} –
                        {{ formatDateIndo(endDate) }}
                    </p>
                </div>

                <button
                    type="button"
                    @click="toggleMobileFilter"
                    :aria-expanded="mobileFilterOpen"
                    aria-controls="order-mobile-period-panel"
                    class="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-blue-200/60 bg-blue-50/80 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
                >
                    <SlidersHorizontal class="h-3.5 w-3.5" aria-hidden="true" />
                    Filter
                    <ChevronDown
                        class="h-3.5 w-3.5 transition-transform motion-reduce:transition-none"
                        :class="{ 'rotate-180': mobileFilterOpen }"
                        aria-hidden="true"
                    />
                </button>
            </div>

            <div
                v-show="mobileFilterOpen"
                id="order-mobile-period-panel"
                class="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800"
            >
                <div
                    ref="mobilePresetList"
                    role="group"
                    aria-label="Pilihan periode"
                    class="relative flex min-w-0 flex-nowrap gap-1.5 overflow-x-auto pb-1"
                >
                    <button
                        v-for="preset in mobilePeriodPresets"
                        :key="preset.key"
                        type="button"
                        @click="selectMobilePreset(preset.key)"
                        :aria-pressed="mobileSelectedPreset === preset.key"
                        class="min-h-11 shrink-0 cursor-pointer whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                        :class="
                            mobileSelectedPreset === preset.key
                                ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        "
                    >
                        {{ preset.label }}
                    </button>
                </div>

                <div
                    v-if="mobileSelectedPreset === 'custom'"
                    class="mt-2 grid min-w-0 grid-cols-2 gap-2"
                >
                    <label
                        class="min-w-0 text-xs font-medium text-slate-500 dark:text-slate-400"
                    >
                        Mulai
                        <input
                            type="date"
                            v-model="customStartInput"
                            class="mt-1 block h-11 w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-slate-50 px-1.5 text-base text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </label>

                    <label
                        class="min-w-0 text-xs font-medium text-slate-500 dark:text-slate-400"
                    >
                        Sampai
                        <input
                            type="date"
                            v-model="customEndInput"
                            class="mt-1 block h-11 w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-slate-50 px-1.5 text-base text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </label>
                </div>

                <div class="mt-1 flex items-center justify-between gap-2">
                    <div
                        v-if="mobileSelectedPreset !== 'custom'"
                        class="flex items-center gap-1.5"
                    >
                        <button
                            type="button"
                            @click="navigatePeriod(-1)"
                            :disabled="activePreset === 'custom'"
                            aria-label="Periode sebelumnya"
                            class="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <ChevronLeft class="h-4 w-4" aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            @click="navigatePeriod(1)"
                            :disabled="activePreset === 'custom'"
                            aria-label="Periode berikutnya"
                            class="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <ChevronRight class="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>

                    <button
                        type="button"
                        @click="resetMobilePeriod"
                        class="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-1 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                    >
                        <RotateCcw class="h-3.5 w-3.5" aria-hidden="true" />
                        Reset
                    </button>

                    <button
                        v-if="mobileSelectedPreset === 'custom'"
                        type="button"
                        @click="applyMobileCustomRange"
                        class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </section>
>>>>>>> 77390b0 (filter resposif list data)

        <!-- =========================================================
             KPI
             ========================================================= -->

        <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <KpiCard
                title="Job Order"
                :value="Number(props.orderanData ?? 0)"
                unit="Order"
                type="number"
                period-text="Berdasarkan tgl_order periode"
                tooltip="Jumlah total orderan masuk pada periode yang dipilih."
                :icon="ShoppingBag"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />

            <KpiCard
                title="Kuantitas Order"
                :value="Number(props.totalKuantitas ?? 0)"
                unit="Pcs"
                type="number"
                period-text="Akumulasi total_qty pakaian"
                tooltip="Jumlah total fisik pakaian yang dipesan pelanggan."
                :icon="Boxes"
                icon-bg="bg-purple-50 dark:bg-purple-950/40"
                icon-color="text-purple-600 dark:text-purple-400"
            />

            <KpiCard
                title="Total HPP"
                :value="Number(props.totalHpp ?? 0)"
                type="currency"
                period-text="Akumulasi total_hpp"
                tooltip="Total modal produksi berdasarkan HPP."
                :icon="Layers"
                icon-bg="bg-slate-100 dark:bg-slate-800"
                icon-color="text-slate-600 dark:text-slate-300"
            />

            <KpiCard
                title="Total Penjualan"
                :value="Number(props.totalJual ?? 0)"
                type="currency"
                period-text="Akumulasi total_jual"
                tooltip="Total nilai penjualan dari seluruh orderan terfilter."
                :icon="Banknote"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />
        </section>

        <!-- =========================================================
             CHARTS
             ========================================================= -->

        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
            <!-- TREND -->
            <div
                class="md:col-span-2 lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none"
            >
                <div>
                    <div
                        class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800"
                    >
                        <div>
                            <h2
                                class="text-base font-semibold text-slate-900 dark:text-white"
                            >
                                Tren Kuantitas Orderan Masuk
                            </h2>

                            <p class="text-xs text-slate-400 mt-0.5">
                                Total jumlah barang berdasarkan periode yang
                                dipilih
                            </p>
                        </div>

                        <div class="flex items-center gap-2">
                            <span
                                class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full"
                            >
                                {{ trendAggregationLabel }}
                            </span>

                            <span
                                class="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full"
                            >
                                {{
                                    formatNumber(
                                        Number(props.totalKuantitas ?? 0),
                                    )
                                }}
                                Pcs
                            </span>
                        </div>
                    </div>

                    <div class="h-[260px] w-full mt-4">
                        <Line
                            :data="orderTrendChartData"
                            :options="quantityChartOptions"
                        />
                    </div>
                </div>
            </div>

            <!-- JENIS ORDER -->
            <div
                class="md:col-span-1 lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none"
            >
                <div>
                    <div
                        class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800"
                    >
                        <div>
                            <h3
                                class="text-sm font-bold text-slate-900 dark:text-white"
                            >
                                Jenis Order
                            </h3>

                            <p class="text-xs text-slate-400 mt-0.5">
                                Maklon dan Supply
                            </p>
                        </div>
                    </div>

                    <div
                        v-if="orderTypeChartData.labels?.length"
                        class="w-full h-[230px] mt-4"
                    >
                        <Bar
                            :data="orderTypeChartData"
                            :options="orderTypeChartOptions"
                        />
                    </div>

                    <div
                        v-else
                        class="w-full h-[230px] flex flex-col items-center justify-center text-slate-400"
                    >
                        <div class="text-sm font-semibold">Tidak ada data</div>

                        <div class="text-xs mt-1">
                            Belum ada order pada periode ini
                        </div>
                    </div>
                </div>
            </div>

            <!-- DISTRIBUSI MODEL -->
            <div
                class="md:col-span-1 lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none"
            >
                <div>
                    <div
                        class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800"
                    >
                        <h3
                            class="text-sm font-bold text-slate-900 dark:text-white"
                        >
                            Distribusi Model Order
                        </h3>

                        <span class="text-xs text-slate-400"> Model </span>
                    </div>

                    <div
                        v-if="props.distribusiModel?.length"
                        class="w-full aspect-square max-h-[230px] mt-3 mx-auto flex items-center justify-center"
                    >
                        <Doughnut
                            :data="orderModelDistributionData"
                            :options="donutChartOptions"
                        />
                    </div>

                    <div
                        v-else
                        class="w-full aspect-square max-h-[230px] mt-3 mx-auto flex flex-col items-center justify-center text-slate-400"
                    >
                        <div class="text-sm font-semibold">Tidak ada data</div>

                        <div class="text-xs mt-1">
                            Belum ada order pada periode ini
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- =========================================================
             TABEL ORDERAN
             ========================================================= -->

        <section
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none space-y-4"
        >
           <!-- TOOLBAR -->
            <div
                class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800"
            >
                <!-- Area Judul & Tombol Toggle Mobile -->
                <div class="flex items-start justify-between w-full lg:w-auto gap-4">
                    <div>
                        <h2
                            class="text-base font-semibold text-slate-900 dark:text-white"
                        >
                            Daftar Orderan Masuk
                        </h2>

                        <p class="text-xs text-slate-400 mt-0.5">
                            Menampilkan orderan berdasarkan tgl_order periode terpilih
                        </p>
                    </div>

                    <!-- Tombol Filter Mobile (Sembunyi otomatis di Desktop) -->
                    <button
                        type="button"
                        @click="mobileTableFilterOpen = !mobileTableFilterOpen"
                        class="lg:hidden shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                    >
                        <Search class="h-3.5 w-3.5" />
                        Cari
                        <ChevronDown
                            class="h-3.5 w-3.5 transition-transform"
                            :class="{ 'rotate-180': mobileTableFilterOpen }"
                        />
                    </button>
                </div>

                <!-- Filter Controls (Sembunyi di Mobile jika ditutup, Selalu tampil di Desktop) -->
                <div
                    class="w-full lg:w-auto sm:flex-wrap sm:items-center gap-2 transition-all"
                    :class="mobileTableFilterOpen ? 'grid sm:flex' : 'hidden lg:flex'"
                >
                    <!-- SEARCH -->
                    <div class="relative w-full sm:w-64">
                        <Search
                            class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400"
                        />
                        <input
                            type="text"
                            v-model="tableSearch"
                            placeholder="Cari no order / PO / pelanggan..."
                            class="w-full pl-8 pr-3 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <!-- FILTER STATUS & JENIS -->
                    <div class="grid grid-cols-2 sm:flex sm:items-center gap-2">
                        <select
                            v-model="statusFilter"
                            class="w-full sm:w-auto px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                        >
                            <option value="ALL">Semua Status</option>
                            <option
                                v-for="(value, key) in ORDER_STATUS_MAP"
                                :key="key"
                                :value="key"
                            >
                                {{ value.label }}
                            </option>
                        </select>

                        <select
                            v-model="typeFilter"
                            class="w-full sm:w-auto px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                        >
                            <option value="ALL">Semua Jenis</option>
                            <option
                                v-for="type in orderTypeOptions"
                                :key="type.value"
                                :value="String(type.value)"
                            >
                                {{ type.label }}
                            </option>
                        </select>
                    </div>

                    <!-- EXPORT -->
                    <button
                        type="button"
                        @click="triggerCsvExport"
                        class="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-xs transition"
                    >
                        <Download class="h-3.5 w-3.5 text-slate-500" />
                        Ekspor CSV
                    </button>
                </div>
            </div>

            <!-- =====================================================
                 DESKTOP
                 ===================================================== -->

            <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr
                            class="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider"
                        >
                            <th
                                class="pb-3 font-semibold cursor-pointer select-none"
                                @click="toggleSort('tgl_order')"
                            >
                                <div class="flex items-center gap-1">
                                    <span> Tgl & No Order </span>

                                    <ArrowUpDown class="h-3 w-3" />
                                </div>
                            </th>

                            <th class="pb-3 font-semibold">No PO</th>

                            <th class="pb-3 font-semibold">Pelanggan</th>

                            <th class="pb-3 font-semibold">Jenis Order</th>

                            <th class="pb-3 font-semibold text-center">
                                Status
                            </th>

                            <th
                                class="pb-3 font-semibold text-center cursor-pointer select-none"
                                @click="toggleSort('total_qty')"
                            >
                                <div
                                    class="flex items-center justify-center gap-1"
                                >
                                    <span> Kuantitas </span>

                                    <ArrowUpDown class="h-3 w-3" />
                                </div>
                            </th>

                            <th class="pb-3 font-semibold text-right">HPP</th>

                            <th
                                class="pb-3 font-semibold text-right cursor-pointer select-none"
                                @click="toggleSort('total_jual')"
                            >
                                <div
                                    class="flex items-center justify-end gap-1"
                                >
                                    <span> Penjualan </span>

                                    <ArrowUpDown class="h-3 w-3" />
                                </div>
                            </th>

                            <th
                                class="pb-3 font-semibold text-center cursor-pointer select-none"
                                @click="toggleSort('tgl_estimasi')"
                            >
                                <div
                                    class="flex items-center justify-center gap-1"
                                >
                                    <span> Estimasi Selesai </span>

                                    <ArrowUpDown class="h-3 w-3" />
                                </div>
                            </th>

                            <th class="pb-3 font-semibold text-right">Aksi</th>
                        </tr>
                    </thead>

                    <tbody
                        class="divide-y divide-slate-50 dark:divide-slate-800/60"
                    >
                        <tr
                            v-for="order in paginatedOrders"
                            :key="order.id_order"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
                            @click="openOrderDetail(order)"
                        >
                            <td class="py-3.5 pr-3">
                                <span
                                    class="font-bold text-slate-900 dark:text-white block"
                                >
                                    {{ order.no_order }}
                                </span>

                                <span class="text-[11px] text-slate-400">
                                    {{ formatDateIndo(order.tgl_order) }}
                                </span>
                            </td>

                            <td
                                class="py-3.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]"
                            >
                                {{ order.no_po || "-" }}
                            </td>

                            <td class="py-3.5 pr-3">
                                <div
                                    class="font-semibold text-slate-900 dark:text-white"
                                >
                                    {{ order.nm_cus }}
                                </div>

                                <span class="text-[10px] text-slate-400">
                                    {{ order.kd_cus }}
                                </span>
                            </td>

                            <td
                                class="py-3.5 text-slate-700 dark:text-slate-300"
                            >
                                {{
                                    order.nama_jenis ||
                                    `Jenis ${order.jenis_order}`
                                }}
                            </td>

                            <td class="py-3.5 text-center">
                                <span
                                    class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                    :class="
                                        ORDER_STATUS_MAP[String(order.status)]
                                            ?.badgeClass ||
                                        'bg-slate-100 text-slate-600'
                                    "
                                >
                                    {{
                                        order.nama_status ||
                                        ORDER_STATUS_MAP[String(order.status)]
                                            ?.label ||
                                        `Status ${order.status}`
                                    }}
                                </span>
                            </td>

                            <td
                                class="py-3.5 text-center font-bold text-slate-900 dark:text-white"
                            >
                                {{ formatNumber(order.total_qty) }}
                                pcs
                            </td>

                            <td
                                class="py-3.5 text-right text-slate-500 dark:text-slate-400"
                            >
                                {{ formatRupiah(order.total_hpp) }}
                            </td>

                            <td
                                class="py-3.5 text-right font-bold text-blue-600 dark:text-blue-400"
                            >
                                {{ formatRupiah(order.total_jual) }}
                            </td>

                            <td class="py-3.5 text-center">
                                <span
                                    class="block font-medium text-slate-800 dark:text-slate-200"
                                >
                                    {{ formatDateIndo(order.tgl_estimasi) }}
                                </span>

                                <span
                                    v-if="isOrderOverdue(order, TODAY_DATE)"
                                    class="inline-block mt-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.2 rounded"
                                >
                                    Terlambat
                                </span>

                                <span
                                    v-else-if="
                                        isOrderApproaching(order, TODAY_DATE)
                                    "
                                    class="inline-block mt-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded"
                                >
                                    &lt; 3 Hari
                                </span>
                            </td>

                            <td class="py-3.5 text-right">
                                <button
                                    type="button"
                                    @click.stop="openOrderDetail(order)"
                                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
                                >
                                    <Eye class="h-3.5 w-3.5" />

                                    Detail
                                </button>
                            </td>
                        </tr>

                        <tr v-if="paginatedOrders.length === 0">
                            <td
                                colspan="10"
                                class="py-10 text-center text-slate-400 text-xs"
                            >
                                Tidak ada orderan yang memenuhi kriteria
                                pencarian / filter pada periode ini.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- =====================================================
                 MOBILE
                 ===================================================== -->

            <div class="block md:hidden space-y-3">
                <div
                    v-for="order in paginatedOrders"
                    :key="order.id_order"
                    @click="openOrderDetail(order)"
                    class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition active:scale-[0.99] cursor-pointer space-y-3"
                >
                    <!-- HEADER -->

                    <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span
                                    class="font-bold text-sm text-slate-900 dark:text-white tracking-tight"
                                >
                                    {{ order.no_order }}
                                </span>

                                <span
                                    v-if="order.no_po"
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono font-medium"
                                >
                                    {{ order.no_po }}
                                </span>
                            </div>

                            <div
                                class="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5"
                            >
                                <Calendar class="h-3 w-3" />

                                <span>
                                    Order:
                                    {{ formatDateIndo(order.tgl_order) }}
                                </span>
                            </div>
                        </div>

                        <span
                            class="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            :class="
                                ORDER_STATUS_MAP[String(order.status)]
                                    ?.badgeClass ||
                                'bg-slate-100 text-slate-600'
                            "
                        >
                            {{
                                order.nama_status ||
                                ORDER_STATUS_MAP[String(order.status)]?.label ||
                                `Status ${order.status}`
                            }}
                        </span>
                    </div>

                    <!-- CUSTOMER -->

                    <div
                        class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-1.5"
                    >
                        <div class="flex items-center justify-between text-xs">
                            <div class="min-w-0 flex items-center gap-1.5">
                                <Users
                                    class="h-3.5 w-3.5 text-slate-400 shrink-0"
                                />

                                <span
                                    class="font-semibold text-slate-900 dark:text-white truncate"
                                >
                                    {{ order.nm_cus }}
                                </span>
                            </div>

                            <span
                                class="text-[10px] text-slate-400 font-mono shrink-0 ml-1"
                            >
                                ({{ order.kd_cus }})
                            </span>
                        </div>

                        <div
                            class="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50"
                        >
                            <span class="text-slate-400"> Jenis Order: </span>

                            <span
                                class="font-medium text-slate-800 dark:text-slate-200"
                            >
                                {{
                                    order.nama_jenis ||
                                    `Jenis ${order.jenis_order}`
                                }}
                            </span>
                        </div>
                    </div>

                    <!-- MATRIX -->

                    <div class="grid grid-cols-3 gap-2 pt-0.5 text-center">
                        <div
                            class="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                        >
                            <span
                                class="text-[10px] text-slate-400 block font-medium"
                            >
                                Kuantitas
                            </span>

                            <span
                                class="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block"
                            >
                                {{ formatNumber(order.total_qty) }}
                                pcs
                            </span>
                        </div>

                        <div
                            class="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                        >
                            <span
                                class="text-[10px] text-slate-400 block font-medium"
                            >
                                Penjualan
                            </span>

                            <span
                                class="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 block truncate"
                            >
                                {{ formatRupiah(order.total_jual) }}
                            </span>
                        </div>

                        <div
                            class="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                        >
                            <span
                                class="text-[10px] text-slate-400 block font-medium"
                            >
                                Est. Laba
                            </span>

                            <span
                                class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block truncate"
                            >
                                {{
                                    formatRupiah(
                                        Number(order.total_jual) -
                                            Number(order.total_hpp),
                                    )
                                }}
                            </span>
                        </div>
                    </div>

                    <!-- FOOTER -->

                    <div
                        class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs"
                    >
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <Clock
                                class="h-3.5 w-3.5 text-slate-400 shrink-0"
                            />

                            <span
                                class="text-[11px] text-slate-500 dark:text-slate-400"
                            >
                                Target:

                                <strong
                                    class="text-slate-700 dark:text-slate-200 font-semibold"
                                >
                                    {{ formatDateIndo(order.tgl_estimasi) }}
                                </strong>
                            </span>

                            <span
                                v-if="isOrderOverdue(order, TODAY_DATE)"
                                class="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded"
                            >
                                Terlambat
                            </span>

                            <span
                                v-else-if="
                                    isOrderApproaching(order, TODAY_DATE)
                                "
                                class="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded"
                            >
                                &lt; 3 Hari
                            </span>
                        </div>

                        <button
                            type="button"
                            @click.stop="openOrderDetail(order)"
                            class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition cursor-pointer"
                        >
                            <Eye class="h-3.5 w-3.5" />

                            Detail
                        </button>
                    </div>
                </div>

                <div
                    v-if="paginatedOrders.length === 0"
                    class="py-12 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700"
                >
                    Tidak ada orderan yang memenuhi kriteria pencarian / filter
                    pada periode ini.
                </div>
            </div>

            <!-- =====================================================
                 PAGINATION
                 ===================================================== -->

            <div
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500"
            >
                <div
                    class="flex items-center justify-between sm:justify-start gap-2"
                >
                    <span class="text-[11px] sm:text-xs">
                        Menampilkan

                        {{ displayedFrom }}

                        -

                        {{ displayedTo }}

                        dari

                        {{ totalData }}

                        orderan
                    </span>

                    <select
                        v-model.number="perPage"
                        class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                        <option :value="10">10 / hal</option>

                        <option :value="25">25 / hal</option>

                        <option :value="50">50 / hal</option>

                        <option :value="100">100 / hal</option>
                    </select>
                </div>

                <div
                    class="flex items-center justify-between sm:justify-end gap-1.5"
                >
                    <button
                        type="button"
                        @click="previousPage"
                        :disabled="currentPage === 1"
                        class="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer text-center text-xs"
                    >
                        Sebelumnya
                    </button>

                    <span class="px-2 font-medium text-xs whitespace-nowrap">
                        Hal
                        {{ currentPage }}
                        /
                        {{ totalPages }}
                    </span>

                    <button
                        type="button"
                        @click="nextPage"
                        :disabled="currentPage >= totalPages"
                        class="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer text-center text-xs"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>
        </section>

        <!-- =========================================================
             DETAIL DRAWER
             ========================================================= -->

        <Sheet :open="isDetailOpen" @update:open="isDetailOpen = $event">
            <SheetContent
                side="right"
                class="w-full sm:max-w-lg p-0 overflow-y-auto"
            >
                <div v-if="selectedOrder" class="p-6 space-y-6">
                    <!-- HEADER -->

                    <SheetHeader
                        class="pb-3 border-b border-slate-100 dark:border-slate-800"
                    >
                        <div class="flex items-center justify-between">
                            <span
                                class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md"
                            >
                                Detail Orderan
                            </span>

                            <span
                                class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                :class="
                                    ORDER_STATUS_MAP[
                                        String(selectedOrder.status)
                                    ]?.badgeClass ||
                                    'bg-slate-100 text-slate-600'
                                "
                            >
                                {{
                                    selectedOrder.nama_status ||
                                    ORDER_STATUS_MAP[
                                        String(selectedOrder.status)
                                    ]?.label ||
                                    `Status ${selectedOrder.status}`
                                }}
                            </span>
                        </div>

                        <SheetTitle
                            class="text-lg font-bold text-slate-900 dark:text-white mt-1"
                        >
                            {{ selectedOrder.no_order }}
                        </SheetTitle>

                        <SheetDescription class="text-xs text-slate-400">
                            Informasi order berdasarkan data orderan.
                        </SheetDescription>
                    </SheetHeader>

                    <!-- INFORMASI ORDER -->

                    <div
<<<<<<< HEAD
                        class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2.5 text-xs"
=======
                        class="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-hidden"
                    >
                        <div class="grid grid-cols-2">
                            <!-- ================================================== -->
                            <!-- KOLOM KIRI - INFORMASI ORDER -->
                            <!-- ================================================== -->
                            <div class="p-4">
                                <h4
                                    class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600 mb-3"
                                >
                                    Informasi Order
                                </h4>

                                <div
                                    class="space-y-2 text-xs text-slate-600 dark:text-slate-300"
                                >
                                    <div>
                                        <div
                                            class="text-[10px] text-slate-400 mb-0.5"
                                        >
                                            No Order
                                        </div>

                                        <strong
                                            class="block text-slate-900 dark:text-white break-all"
                                        >
                                            {{ selectedOrder.no_order }}
                                        </strong>
                                    </div>

                                    <div>
                                        <div
                                            class="text-[10px] text-slate-400 mb-0.5"
                                        >
                                            No PO
                                        </div>

                                        <strong
                                            class="block text-slate-900 dark:text-white break-all"
                                        >
                                            {{ selectedOrder.no_po || "-" }}
                                        </strong>
                                    </div>

                                    <div>
                                        <div
                                            class="text-[10px] text-slate-400 mb-0.5"
                                        >
                                            Jenis
                                        </div>

                                        <strong
                                            class="block text-slate-900 dark:text-white"
                                        >
                                            {{
                                                selectedOrder.nama_jenis ||
                                                `Jenis ${selectedOrder.jenis_order}`
                                            }}
                                        </strong>
                                    </div>

                                    <div>
                                        <div
                                            class="text-[10px] text-slate-400 mb-0.5"
                                        >
                                            Tanggal Order
                                        </div>

                                        <strong
                                            class="block text-slate-900 dark:text-white"
                                        >
                                            {{
                                                formatDateIndo(
                                                    selectedOrder.tgl_order,
                                                )
                                            }}
                                        </strong>
                                    </div>

                                    <div>
                                        <div
                                            class="text-[10px] text-slate-400 mb-0.5"
                                        >
                                            Estimasi
                                        </div>

                                        <strong
                                            class="block text-slate-900 dark:text-white"
                                        >
                                            {{
                                                formatDateIndo(
                                                    selectedOrder.tgl_estimasi,
                                                )
                                            }}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <!-- ================================================== -->
                            <!-- KOLOM KANAN - CUSTOMER + STATUS -->
                            <!-- ================================================== -->
                            <div
                                class="border-l border-slate-200 dark:border-slate-700"
                            >
                                <!-- CUSTOMER -->
                                <div class="p-4">
                                    <h4
                                        class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600 mb-3"
                                    >
                                        Informasi Pelanggan
                                    </h4>

                                    <div
                                        class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300"
                                    >
                                        <div>
                                            <div
                                                class="text-[10px] text-slate-400 mb-0.5"
                                            >
                                                Kode Pelanggan
                                            </div>

                                            <strong
                                                class="block text-slate-900 dark:text-white break-all"
                                            >
                                                {{
                                                    selectedOrder.kd_cus || "-"
                                                }}
                                            </strong>
                                        </div>

                                        <div>
                                            <div
                                                class="text-[10px] text-slate-400 mb-0.5"
                                            >
                                                Nama Pelanggan
                                            </div>

                                            <strong
                                                class="block text-slate-900 dark:text-white break-words"
                                            >
                                                {{
                                                    selectedOrder.nm_cus || "-"
                                                }}
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <!-- PEMISAH CUSTOMER / STATUS -->
                                <div
                                    class="border-t border-slate-200 dark:border-slate-700"
                                ></div>

                                <!-- STATUS -->
                                <div class="p-4">
                                    <h4
                                        class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600 mb-3"
                                    >
                                        Status Order
                                    </h4>

                                    <div class="space-y-2.5 text-xs">
                                        <div>
                                            <div
                                                class="text-[10px] text-slate-400 mb-0.5"
                                            >
                                                Target selesai
                                            </div>

                                            <strong
                                                class="block text-slate-900 dark:text-white"
                                            >
                                                {{
                                                    formatDateIndo(
                                                        selectedOrder.tgl_estimasi,
                                                    )
                                                }}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ====================================================== -->
                    <!-- 3. DETAIL PESANAN -->
                    <!-- ====================================================== -->
                    <div
                        class="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-hidden"
                    >
                        <!-- HEADER -->
                        <div class="px-4 pt-4 pb-2">
                            <div
                                class="flex items-center justify-between gap-2"
                            >
                                <h4
                                    class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600"
                                >
                                    Detail Pesanan
                                </h4>

                                <span
                                    v-if="selectedOrderModels.length > 0"
                                    class="text-[10px] font-semibold text-slate-400"
                                >
                                    {{ selectedOrderModels.length }} Model
                                </span>
                            </div>
                        </div>

                        <!-- TABLE -->
                        <div
                            v-if="selectedOrderModels.length > 0"
                            class="px-3 pb-3"
                        >
                            <div
                                class="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                            >
                                <table class="w-full table-fixed text-[10px]">
                                    <thead
                                        class="bg-slate-100 dark:bg-slate-800"
                                    >
                                        <tr>
                                            <!-- NO -->
                                            <th
                                                class="px-1.5 py-2 text-center font-semibold text-slate-500 dark:text-slate-400 w-[8%]"
                                            >
                                                No
                                            </th>

                                            <!-- MODEL -->
                                            <th
                                                class="px-1.5 py-2 text-left font-semibold text-slate-500 dark:text-slate-400 w-[36%]"
                                            >
                                                Model
                                            </th>

                                            <!-- PCS -->
                                            <th
                                                class="px-1 py-2 text-right font-semibold text-slate-500 dark:text-slate-400 w-[15%]"
                                            >
                                                Pcs
                                            </th>

                                            <!-- HPP -->
                                            <th
                                                class="px-1 py-2 text-right font-semibold text-slate-500 dark:text-slate-400 w-[20%]"
                                            >
                                                HPP
                                            </th>

                                            <!-- JUAL -->
                                            <th
                                                class="px-1.5 py-2 text-right font-semibold text-slate-500 dark:text-slate-400 w-[21%]"
                                            >
                                                Jual
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody
                                        class="divide-y divide-slate-200 dark:divide-slate-700"
                                    >
                                        <tr
                                            v-for="(
                                                item, index
                                            ) in selectedOrderModels"
                                            :key="`${selectedOrder?.id_order}-${item.nm_model}-${index}`"
                                            class="bg-white dark:bg-slate-900/30"
                                        >
                                            <!-- NO -->
                                            <td
                                                class="px-1.5 py-2 text-center text-slate-400"
                                            >
                                                {{ index + 1 }}
                                            </td>

                                            <!-- MODEL -->
                                            <td
                                                class="px-1.5 py-2 font-semibold text-slate-900 dark:text-white break-   leading-tight"
                                            >
                                                {{
                                                    item.nm_model ||
                                                    "Tanpa Nama Model"
                                                }}
                                            </td>

                                            <!-- PCS -->
                                            <td
                                                class="px-1 py-2 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap"
                                            >
                                                {{ formatNumber(item.qty) }}
                                            </td>

                                            <!-- HPP -->
                                            <td
                                                class="px-1 py-2 text-right text-slate-700 dark:text-slate-300 whitespace-nowrap"
                                            >
                                                {{
                                                    item.hpp !== undefined &&
                                                    item.hpp !== null
                                                        ? formatRupiah(item.hpp)
                                                        : "-"
                                                }}
                                            </td>

                                            <!-- HARGA JUAL -->
                                            <td
                                                class="px-1.5 py-2 text-right text-blue-600 dark:text-blue-400 font-semibold whitespace-nowrap"
                                            >
                                                {{
                                                    item.harga_jual !==
                                                        undefined &&
                                                    item.harga_jual !== null
                                                        ? formatRupiah(
                                                              item.harga_jual,
                                                          )
                                                        : "-"
                                                }}
                                            </td>
                                        </tr>
                                    </tbody>

                                    <!-- TOTAL -->
                                    <!-- <tfoot
                                        class="bg-slate-50 dark:bg-slate-800/50"
                                    >
                                        <tr
                                            class="font-semibold text-slate-700 dark:text-slate-200"
                                        >
                                            <td
                                                colspan="2"
                                                class="px-2 py-2 text-left"
                                            >
                                                Total
                                            </td>

                                            <td class="px-2 py-2 text-right">
                                                {{ selectedOrderTotal.qty }}
                                            </td>

                                            <td class="px-2 py-2 text-right">
                                                {{
                                                    formatRupiah(
                                                        selectedOrderTotal.hpp,
                                                    )
                                                }}
                                            </td>

                                            <td
                                                class="px-2 py-2 text-right text-emerald-600"
                                            >
                                                {{
                                                    formatRupiah(
                                                        selectedOrderTotal.harga_jual,
                                                    )
                                                }}
                                            </td>
                                        </tr>
                                    </tfoot> -->
                                </table>
                            </div>
                        </div>

                        <!-- EMPTY -->
                        <div
                            v-else
                            class="px-4 pb-5 text-center text-xs text-slate-400"
                        >
                            Tidak ada detail model untuk order ini.
                        </div>
                    </div>

                    <!-- ====================================================== -->
                    <!-- 5. TOTAL -->
                    <!-- ====================================================== -->
                    <div
                        class="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4"
>>>>>>> 77390b0 (filter resposif list data)
                    >
                        <h4
                            class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600"
                        >
<<<<<<< HEAD
                            1. Informasi Order
=======
                            Total
>>>>>>> 77390b0 (filter resposif list data)
                        </h4>

                        <div
                            class="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300"
                        >
                            <div>
                                ID Order:

                                <strong class="text-slate-900 dark:text-white">
                                    #{{ selectedOrder.id_order }}
                                </strong>
                            </div>

                            <div>
                                No Order:

                                <strong class="text-slate-900 dark:text-white">
                                    {{ selectedOrder.no_order }}
                                </strong>
                            </div>

                            <div>
                                No PO:

                                <strong class="text-slate-900 dark:text-white">
                                    {{ selectedOrder.no_po || "-" }}
                                </strong>
                            </div>

                            <div>
                                Jenis:

                                <strong class="text-slate-900 dark:text-white">
                                    {{
                                        selectedOrder.nama_jenis ||
                                        `Jenis ${selectedOrder.jenis_order}`
                                    }}
                                </strong>
                            </div>

                            <div>
                                Tanggal Order:

                                <strong class="text-slate-900 dark:text-white">
                                    {{
                                        formatDateIndo(selectedOrder.tgl_order)
                                    }}
                                </strong>
                            </div>

                            <div>
                                Estimasi:

                                <strong class="text-slate-900 dark:text-white">
                                    {{
                                        formatDateIndo(
                                            selectedOrder.tgl_estimasi,
                                        )
                                    }}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <!-- CUSTOMER -->

                    <div
                        class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2.5 text-xs"
                    >
                        <h4
                            class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600"
                        >
                            2. Informasi Pelanggan
                        </h4>

                        <div
                            class="space-y-2 text-slate-600 dark:text-slate-300"
                        >
                            <div class="flex justify-between gap-3">
                                <span> Kode Pelanggan </span>

                                <strong class="text-slate-900 dark:text-white">
                                    {{ selectedOrder.kd_cus || "-" }}
                                </strong>
                            </div>

                            <div class="flex justify-between gap-3">
                                <span> Nama Pelanggan </span>

                                <strong
                                    class="text-slate-900 dark:text-white text-right"
                                >
                                    {{ selectedOrder.nm_cus || "-" }}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <!-- STATUS -->

                    <div
                        class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2.5 text-xs"
                    >
                        <h4
                            class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600"
                        >
                            3. Status Order
                        </h4>

                        <div class="flex items-center justify-between">
                            <span class="text-slate-500"> Status: </span>

                            <span
                                class="px-2.5 py-1 rounded-full text-xs font-semibold"
                                :class="
                                    ORDER_STATUS_MAP[
                                        String(selectedOrder.status)
                                    ]?.badgeClass ||
                                    'bg-slate-100 text-slate-600'
                                "
                            >
<<<<<<< HEAD
                                {{
                                    selectedOrder.nama_status ||
                                    ORDER_STATUS_MAP[
                                        String(selectedOrder.status)
                                    ]?.label ||
                                    `Status ${selectedOrder.status}`
                                }}
                       const isDetailOpen = ref(false);     </span>
                        </div>

                        <div class="flex items-center justify-between">
                            <span class="text-slate-500">
                                Target selesai:
                            </span>

                            <strong class="text-slate-900 dark:text-white">
                                {{ formatDateIndo(selectedOrder.tgl_estimasi) }}
                            </strong>
                        </div>
                    </div>

                    <!-- KEUANGAN -->

                    <div
                        class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-3 text-xs"
                    >
                        <h4
                            class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600"
                        >
                            4. Informasi Keuangan
                        </h4>

                        <div class="space-y-2">
                            <div class="flex justify-between">
=======
>>>>>>> 77390b0 (filter resposif list data)
                                <span class="text-slate-500">
                                    Total Kuantitas
                                </span>

                                <strong class="text-slate-900 dark:text-white">
                                    {{ formatNumber(selectedOrder.total_qty) }}
                                    Pcs
                                </strong>
                            </div>

                            <div class="flex justify-between">
                                <span class="text-slate-500"> Total HPP </span>

                                <strong
                                    class="text-slate-700 dark:text-slate-300"
                                >
                                    {{ formatRupiah(selectedOrder.total_hpp) }}
                                </strong>
                            </div>

                            <div class="flex justify-between">
                                <span class="text-slate-500">
                                    Total Penjualan
                                </span>

                                <strong
                                    class="text-blue-600 dark:text-blue-400"
                                >
                                    {{ formatRupiah(selectedOrder.total_jual) }}
                                </strong>
                            </div>

                            <div
                                class="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700"
                            >
                                <span
                                    class="font-bold text-slate-800 dark:text-slate-200"
                                >
                                    Estimasi Laba Kotor
                                </span>

                                <strong
                                    class="font-extrabold text-emerald-600 dark:text-emerald-400"
                                >
                                    {{
                                        formatRupiah(
                                            Number(selectedOrder.total_jual) -
                                                Number(selectedOrder.total_hpp),
                                        )
                                    }}
                                </strong>
                            </div>

                            <div
                                class="flex justify-between text-xs text-slate-500"
                            >
                                <span> Margin Laba Kotor </span>

                                <strong
                                    class="text-emerald-600 dark:text-emerald-400"
                                >
                                    {{
                                        Number(selectedOrder.total_jual) > 0
                                            ? (
                                                  ((Number(
                                                      selectedOrder.total_jual,
                                                  ) -
                                                      Number(
                                                          selectedOrder.total_hpp,
                                                      )) /
                                                      Number(
                                                          selectedOrder.total_jual,
                                                      )) *
                                                  100
                                              ).toFixed(1)
                                            : "0.0"
                                    }}%
                                </strong>
                            </div>
                        </div>
                    </div>
<<<<<<< HEAD

                    <!-- DEADLINE -->

                    <div
                        class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-3 text-xs"
                    >
                        <h4
                            class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600"
                        >
                            5. Deadline
                        </h4>

                        <div class="flex items-center justify-between">
                            <span class="text-slate-500">
                                Estimasi selesai
                            </span>

                            <strong class="text-slate-900 dark:text-white">
                                {{ formatDateIndo(selectedOrder.tgl_estimasi) }}
                            </strong>
                        </div>

                        <div
                            v-if="isOrderOverdue(selectedOrder, TODAY_DATE)"
                            class="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold"
                        >
                            Order sudah melewati tanggal estimasi.
                        </div>

                        <div
                            v-else-if="
                                isOrderApproaching(selectedOrder, TODAY_DATE)
                            "
                            class="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                        >
                            Order mendekati tanggal estimasi.
                        </div>
                        <div
                       const isDetailOpen = ref(false);     v-else
                            class="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold"
                        >
                            Belum mendekati tanggal estimasi.
                        </div>
                    </div>
=======
>>>>>>> 77390b0 (filter resposif list data)
                </div>
            </SheetContent>
        </Sheet>
    </div>
</template>
