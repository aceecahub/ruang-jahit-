<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    Printer,
    Download,
    X,
    FileText,
    Receipt,
    Scissors,
    Calendar,
    User,
    CheckCircle2,
    Clock,
    Sparkles,
} from '@lucide/vue';
import { formatRupiah, formatNumber, formatDateIndo } from '@/lib/formatters';
import { toast } from 'vue-sonner';

export interface FakturOrderItem {
    id_order?: number;
    no_order: string;
    tgl_order: string;
    no_po?: string;
    kd_cus?: string;
    nm_cus: string;
    jenis_order?: number;
    nama_jenis?: string;
    status?: number;
    nama_status?: string;
    total_qty: number;
    total_hpp?: number;
    total_jual: number;
    tgl_estimasi?: string;
}

export interface FakturModelItem {
    id_order?: number;
    tgl_order?: string;
    nm_model: string;
    size?: string;
    qty: number;
    hpp?: number;
    harga_jual?: number;
}

const props = withDefaults(
    defineProps<{
        modelValue?: boolean;
        open?: boolean;
        order: FakturOrderItem | null;
        models?: FakturModelItem[];
    }>(),
    {
        modelValue: false,
        open: false,
        models: () => [],
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'update:open', value: boolean): void;
    (e: 'close'): void;
}>();

const isVisible = computed(() => props.modelValue || props.open);

function close() {
    emit('update:modelValue', false);
    emit('update:open', false);
    emit('close');
}

// Mode: 'faktur' (A4 formal invoice) vs 'struk' (80mm thermal receipt)
const formatMode = ref<'faktur' | 'struk'>('faktur');

// Line items with fallback to summary if model breakdown is empty
const lineItems = computed(() => {
    const orderTotalJual = Number(props.order?.total_jual || 0);
    const orderTotalQty = Number(props.order?.total_qty || 0);

    if (props.models && props.models.length > 0) {
        const hasExplicitPrice = props.models.some(
            (m) => Number(m.harga_jual || 0) > 0
        );

        return props.models.map((item, idx) => {
            const qty = Number(item.qty || 0);
            let subtotal = Number(item.harga_jual || 0);

            // Jika harga_jual di model tidak ada / 0, distribusikan dari total_jual pesanan
            if (!hasExplicitPrice && orderTotalQty > 0 && orderTotalJual > 0) {
                subtotal = Math.round((qty / orderTotalQty) * orderTotalJual);
            }

            const unitPrice = qty > 0 ? Math.round(subtotal / qty) : subtotal;

            return {
                no: idx + 1,
                name: item.nm_model || 'Model Pakaian',
                size: item.size || null,
                qty: qty,
                unitPrice: unitPrice,
                subtotal: subtotal,
            };
        });
    }

    if (props.order) {
        const qty = Number(props.order.total_qty || 1);
        const total = Number(props.order.total_jual || 0);
        return [
            {
                no: 1,
                name: props.order.nama_jenis || 'Pesanan Jahit / Pakaian',
                qty: qty,
                unitPrice: qty > 0 ? Math.round(total / qty) : total,
                subtotal: total,
            },
        ];
    }

    return [];
});

const totalQuantity = computed(() => {
    if (lineItems.value.length > 0) {
        return lineItems.value.reduce((sum, item) => sum + item.qty, 0);
    }
    return Number(props.order?.total_qty || 0);
});

const totalAmount = computed(() => {
    const orderTotalJual = Number(props.order?.total_jual || 0);
    if (lineItems.value.length > 0) {
        const sum = lineItems.value.reduce((sum, item) => sum + item.subtotal, 0);
        if (sum > 0) return sum;
    }
    return orderTotalJual;
});

// Info Toko
const companyInfo = {
    name: 'RUANG JAHIT',
    tagline: 'Konveksi, Tailoring & Bordir Komputer',
    address: 'Pusat Produksi Konveksi & Jahit, Bandung',
    phone: '0812-3456-7890',
    email: 'order@ruangjahit.com',
};

// Generates dedicated self-contained CSS for printing & PDF export
function getPrintStyles(mode: 'faktur' | 'struk'): string {
    return `
        /* ==========================================================================
           RESET & PRINT COLOR ADJUST
           ========================================================================== */
        *, *::before, *::after {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }

        html, body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        .print-root {
            width: 100% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
            padding: 10px 0 !important;
        }

        /* ==========================================================================
           1. STYLING FAKTUR RESMI (A4)
           ========================================================================== */
        @page {
            size: ${mode === 'faktur' ? 'A4 portrait' : 'auto'};
            margin: ${mode === 'faktur' ? '10mm 12mm' : '4mm auto'};
        }

        .faktur-paper {
            width: 100% !important;
            max-width: 760px !important;
            margin: 0 auto !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            padding: 24px 28px !important;
            border-radius: 10px !important;
            border: 1px solid #e2e8f0 !important;
            box-sizing: border-box !important;
        }

        .faktur-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            padding-bottom: 18px !important;
            border-bottom: 2px solid #e2e8f0 !important;
            gap: 16px !important;
        }

        .faktur-brand {
            display: flex !important;
            align-items: flex-start !important;
            gap: 12px !important;
        }

        .faktur-logo {
            width: 38px !important;
            height: 38px !important;
            border-radius: 8px !important;
            background-color: #2563eb !important;
            color: #ffffff !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
        }

        .faktur-logo svg {
            width: 22px !important;
            height: 22px !important;
            stroke: #ffffff !important;
        }

        .faktur-company-name {
            font-size: 20px !important;
            font-weight: 900 !important;
            letter-spacing: -0.025em !important;
            color: #0f172a !important;
            margin: 0 0 2px 0 !important;
            line-height: 1.2 !important;
        }

        .faktur-company-tagline {
            font-size: 11px !important;
            font-weight: 600 !important;
            color: #64748b !important;
            margin: 0 !important;
        }

        .faktur-company-contact {
            font-size: 10.5px !important;
            color: #94a3b8 !important;
            margin: 4px 0 0 0 !important;
        }

        .faktur-meta {
            text-align: right !important;
        }

        .faktur-badge {
            display: inline-block !important;
            padding: 4px 10px !important;
            border-radius: 6px !important;
            font-size: 10.5px !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            background-color: #eff6ff !important;
            color: #1d4ed8 !important;
            border: 1px solid #bfdbfe !important;
            margin-bottom: 6px !important;
        }

        .faktur-no-order {
            font-size: 13px !important;
            font-weight: 700 !important;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
            color: #0f172a !important;
        }

        .faktur-date {
            font-size: 11px !important;
            color: #64748b !important;
            margin-top: 2px !important;
        }

        .faktur-info-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
            padding: 14px 16px !important;
            border-radius: 10px !important;
            background-color: #f8fafc !important;
            border: 1px solid #f1f5f9 !important;
            margin: 16px 0 !important;
            font-size: 11.5px !important;
        }

        .faktur-info-title {
            font-size: 10px !important;
            font-weight: 700 !important;
            letter-spacing: 0.05em !important;
            text-transform: uppercase !important;
            color: #94a3b8 !important;
            margin-bottom: 6px !important;
        }

        .faktur-customer-name {
            font-size: 14px !important;
            font-weight: 700 !important;
            color: #0f172a !important;
            margin-bottom: 4px !important;
        }

        .faktur-info-row {
            color: #475569 !important;
            margin-bottom: 3px !important;
            font-size: 11px !important;
        }

        .faktur-info-right {
            padding-left: 16px !important;
            border-left: 1px solid #e2e8f0 !important;
        }

        .faktur-status-pill {
            display: inline-block !important;
            padding: 2px 8px !important;
            border-radius: 9999px !important;
            font-size: 10px !important;
            font-weight: 700 !important;
            background-color: #e2e8f0 !important;
            color: #1e293b !important;
            margin-left: 4px !important;
        }

        .faktur-table-box {
            border-radius: 10px !important;
            border: 1px solid #e2e8f0 !important;
            overflow: hidden !important;
            margin-bottom: 16px !important;
        }

        .faktur-table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 11.5px !important;
        }

        .faktur-table thead {
            background-color: #f1f5f9 !important;
            color: #334155 !important;
            font-size: 10px !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            border-bottom: 1px solid #e2e8f0 !important;
        }

        .faktur-table th {
            padding: 9px 12px !important;
            font-weight: 700 !important;
            text-align: left !important;
        }

        .faktur-table td {
            padding: 9px 12px !important;
            border-bottom: 1px solid #f1f5f9 !important;
        }

        .faktur-item-name {
            font-weight: 600 !important;
            color: #0f172a !important;
        }

        .faktur-item-desc {
            font-size: 9.5px !important;
            color: #94a3b8 !important;
            margin-top: 1px !important;
        }

        .faktur-table tfoot {
            background-color: #f8fafc !important;
            border-top: 2px solid #e2e8f0 !important;
            font-weight: 700 !important;
        }

        .faktur-tfoot-label {
            text-transform: uppercase !important;
            font-size: 10px !important;
            color: #475569 !important;
        }

        .faktur-tfoot-amount {
            text-align: right !important;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
            font-size: 13.5px !important;
            font-weight: 900 !important;
            color: #1d4ed8 !important;
        }

        .faktur-terms {
            padding: 10px 14px !important;
            border-radius: 8px !important;
            background-color: #f8fafc !important;
            border: 1px solid #f1f5f9 !important;
            font-size: 10.5px !important;
            color: #64748b !important;
            line-height: 1.45 !important;
            margin-bottom: 20px !important;
        }

        .faktur-terms-title {
            font-weight: 700 !important;
            text-transform: uppercase !important;
            font-size: 9.5px !important;
            color: #334155 !important;
            margin-bottom: 3px !important;
        }

        .faktur-signatures {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-end !important;
            padding-top: 6px !important;
            font-size: 11px !important;
            page-break-inside: avoid !important;
        }

        .faktur-sig-box {
            width: 190px !important;
            text-align: center !important;
        }

        .faktur-sig-title {
            font-size: 10.5px !important;
            color: #64748b !important;
            margin-bottom: 6px !important;
        }

        .faktur-sig-space {
            height: 52px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .faktur-stamp {
            display: inline-block !important;
            padding: 3px 8px !important;
            border-radius: 4px !important;
            font-size: 9.5px !important;
            font-weight: 800 !important;
            color: #2563eb !important;
            background-color: #eff6ff !important;
            border: 1px solid #bfdbfe !important;
            letter-spacing: 0.05em !important;
        }

        .faktur-sig-underline {
            border-bottom: 1px solid #94a3b8 !important;
            font-weight: 600 !important;
            color: #0f172a !important;
            padding-bottom: 4px !important;
        }

        .faktur-sig-desc {
            font-size: 9.5px !important;
            color: #94a3b8 !important;
            margin-top: 3px !important;
        }

        /* ==========================================================================
           2. STYLING STRUK PEMBELIAN (THERMAL 80MM)
           ========================================================================== */
        .struk-paper {
            width: 320px !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            background-color: #ffffff !important;
            color: #111827 !important;
            font-family: 'Courier New', Courier, monospace !important;
            font-size: 11px !important;
            line-height: 1.4 !important;
            padding: 18px 16px !important;
            border: 1.5px dashed #64748b !important;
            border-radius: 4px !important;
            box-sizing: border-box !important;
        }

        .struk-header {
            text-align: center !important;
            margin-bottom: 8px !important;
        }

        .struk-store-name {
            font-size: 15px !important;
            font-weight: 900 !important;
            letter-spacing: 2px !important;
            margin: 0 0 3px 0 !important;
            color: #000000 !important;
        }

        .struk-store-sub, .struk-store-addr, .struk-store-phone {
            font-size: 9.5px !important;
            color: #374151 !important;
            margin: 1px 0 !important;
        }

        .struk-dashed-line {
            border-bottom: 1.5px dashed #1f2937 !important;
            margin: 9px 0 !important;
            width: 100% !important;
            height: 0 !important;
        }

        .struk-line {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            font-size: 10.5px !important;
            margin: 3px 0 !important;
        }

        .struk-label {
            color: #4b5563 !important;
        }

        .struk-val {
            color: #111827 !important;
            text-align: right !important;
            font-weight: 600 !important;
        }

        .struk-truncate {
            max-width: 160px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }

        .struk-items {
            margin: 6px 0 !important;
        }

        .struk-item-block {
            margin-bottom: 7px !important;
        }

        .struk-item-title {
            font-weight: 700 !important;
            font-size: 11px !important;
            color: #000000 !important;
            margin-bottom: 2px !important;
        }

        .struk-item-detail {
            font-size: 10px !important;
            color: #374151 !important;
        }

        .struk-totals {
            margin: 6px 0 !important;
        }

        .struk-grand-total {
            font-size: 12.5px !important;
            font-weight: 900 !important;
            color: #000000 !important;
            padding-top: 6px !important;
            margin-top: 6px !important;
            border-top: 1px dashed #6b7280 !important;
        }

        .struk-footer {
            text-align: center !important;
            font-size: 9px !important;
            color: #4b5563 !important;
            margin-top: 10px !important;
            line-height: 1.4 !important;
        }

        .struk-footer-sub {
            margin-top: 7px !important;
            font-size: 8px !important;
            color: #9ca3af !important;
            letter-spacing: 1px !important;
        }

        /* ==========================================================================
           PRINT MEDIA OVERRIDES
           ========================================================================== */
        @media print {
            body {
                background: #ffffff !important;
            }

            .faktur-paper {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                max-width: 100% !important;
            }

            .struk-paper {
                box-shadow: none !important;
                border: 1px dashed #475569 !important;
                margin: 0 auto !important;
            }
        }
    `;
}

// Function to print via dedicated invisible iframe
function executePrint(isPdfIntent: boolean = false) {
    if (!props.order) {
        toast.error('Tidak ada order yang dipilih untuk dicetak.');
        return;
    }

    const printElement = document.getElementById(
        formatMode.value === 'faktur'
            ? 'faktur-print-content'
            : 'struk-print-content'
    );

    if (!printElement) {
        toast.error('Gagal memuat template cetak.');
        return;
    }

    // Clean up old iframe if present
    const oldIframe = document.getElementById('faktur-print-iframe');
    if (oldIframe) {
        oldIframe.remove();
    }

    // Create a new fresh iframe with 100% viewport dimensions for proper CSS/layout calculation
    const iframe = document.createElement('iframe');
    iframe.id = 'faktur-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-99999';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
        toast.error('Gagal mengakses sistem cetak browser.');
        return;
    }

    const title = `${formatMode.value === 'faktur' ? 'Faktur' : 'Struk'}-${props.order.no_order}`;

    // Collect all stylesheets from main document
    const headStyles = Array.from(
        document.querySelectorAll('link[rel="stylesheet"], style')
    )
        .map((el) => el.outerHTML)
        .join('\n');

    // Self-contained embedded CSS rules
    const dedicatedCss = getPrintStyles(formatMode.value);

    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <title>${title}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${headStyles}
            <style>
                ${dedicatedCss}
            </style>
        </head>
        <body class="${formatMode.value === 'faktur' ? 'body-faktur' : 'body-struk'}">
            <div class="print-root">
                ${printElement.outerHTML}
            </div>
        </body>
        </html>
    `);
    doc.close();

    if (isPdfIntent) {
        toast.info('Menyiapkan Ekspor PDF...', {
            description:
                'Pada dialog cetak browser, ubah Tujuan (Destination) menjadi "Simpan sebagai PDF" / "Save as PDF". Pastikan mencentang "Grafik latar belakang" agar warna tercetak sempurna.',
        });
    }

    // Allow browser rendering engine to layout and parse embedded fonts & CSS
    setTimeout(() => {
        try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        } catch (e) {
            console.error('Print iframe error:', e);
            window.print();
        }
    }, 350);
}
</script>

<template>
    <!-- Modal Preview & Print Dialog -->
    <div
        v-if="isVisible && order"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-6 overflow-y-auto"
        @click.self="close"
    >
        <div
            class="relative w-full max-w-4xl h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
            <!-- TOP BAR: Controls & Format Toggle -->
            <div
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0"
            >
                <div class="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div
                            class="h-9 w-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold shrink-0"
                        >
                            <FileText class="h-5 w-5" />
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {{ formatMode === 'faktur' ? 'Faktur Pesanan' : 'Struk Pembelian' }}
                                </h3>
                                <span
                                    class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0"
                                >
                                    {{ order.no_order }}
                                </span>
                            </div>
                            <p class="text-[11px] text-slate-400 truncate hidden sm:block">
                                Pratinjau dokumen siap cetak dan ekspor PDF
                            </p>
                        </div>
                    </div>

                    <!-- Mobile Close Button -->
                    <button
                        type="button"
                        @click="close"
                        class="sm:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <!-- Right Actions: Format Switch, Print, PDF & Close -->
                <div class="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
                    <!-- Format Toggle: Faktur A4 vs Struk Thermal -->
                    <div
                        class="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold shrink-0"
                    >
                        <button
                            type="button"
                            @click="formatMode = 'faktur'"
                            class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer text-xs"
                            :class="[
                                formatMode === 'faktur'
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400',
                            ]"
                        >
                            <FileText class="h-3.5 w-3.5" />
                            <span>Faktur (A4)</span>
                        </button>
                        <button
                            type="button"
                            @click="formatMode = 'struk'"
                            class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer text-xs"
                            :class="[
                                formatMode === 'struk'
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400',
                            ]"
                        >
                            <Receipt class="h-3.5 w-3.5" />
                            <span>Struk (Thermal)</span>
                        </button>
                    </div>

                    <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <!-- Print Button -->
                        <button
                            type="button"
                            @click="executePrint(false)"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition active:scale-[0.98] cursor-pointer"
                        >
                            <Printer class="h-3.5 w-3.5" />
                            <span>Cetak</span>
                        </button>

                        <!-- PDF Button -->
                        <button
                            type="button"
                            @click="executePrint(true)"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition active:scale-[0.98] cursor-pointer"
                        >
                            <Download class="h-3.5 w-3.5" />
                            <span>Simpan PDF</span>
                        </button>

                        <!-- Desktop Close Button -->
                        <button
                            type="button"
                            @click="close"
                            class="hidden sm:inline-flex p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                            <X class="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- PREVIEW CANVAS (SCROLLABLE AREA) -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-slate-200/60 dark:bg-slate-950/60">
                
                <!-- =========================================================================================
                     1. TEMPLATE FAKTUR RESMI (A4 STANDAR)
                     ========================================================================================= -->
                <div
                    v-show="formatMode === 'faktur'"
                    id="faktur-print-content"
                    class="faktur-paper shadow-md"
                >
                    <!-- Header Kop Surat -->
                    <div class="faktur-header">
                        <div class="faktur-brand">
                            <div class="faktur-logo">
                                <Scissors class="h-5 w-5" />
                            </div>
                            <div>
                                <h1 class="faktur-company-name">
                                    {{ companyInfo.name }}
                                </h1>
                                <p class="faktur-company-tagline">
                                    {{ companyInfo.tagline }}
                                </p>
                                <p class="faktur-company-contact">
                                    {{ companyInfo.address }} • Telp: {{ companyInfo.phone }}
                                </p>
                            </div>
                        </div>

                        <!-- Invoice Badge & Meta -->
                        <div class="faktur-meta">
                            <div class="faktur-badge">
                                FAKTUR PESANAN
                            </div>
                            <div class="faktur-no-order">
                                {{ order.no_order }}
                            </div>
                            <div class="faktur-date">
                                Tanggal: {{ formatDateIndo(order.tgl_order) }}
                            </div>
                        </div>
                    </div>

                    <!-- Customer & Order Information Grid -->
                    <div class="faktur-info-grid">
                        <div class="faktur-info-col">
                            <div class="faktur-info-title">
                                DITUJUKAN KEPADA:
                            </div>
                            <div class="faktur-customer-name">
                                {{ order.nm_cus }}
                            </div>
                            <div class="faktur-info-row">
                                Kode Pelanggan: <strong>{{ order.kd_cus || '-' }}</strong>
                            </div>
                            <div v-if="order.no_po" class="faktur-info-row">
                                No. PO Referensi: <strong>{{ order.no_po }}</strong>
                            </div>
                        </div>

                        <div class="faktur-info-col faktur-info-right">
                            <div class="faktur-info-title">
                                RINCIAN PRODUKSI:
                            </div>
                            <div class="faktur-info-row">
                                Jenis Order: <strong>{{ order.nama_jenis || 'Custom Konveksi' }}</strong>
                            </div>
                            <div class="faktur-info-row">
                                Target Selesai: <strong>{{ formatDateIndo(order.tgl_estimasi || '') }}</strong>
                            </div>
                            <div class="faktur-info-row">
                                Status: 
                                <span class="faktur-status-pill">
                                    {{ order.nama_status || 'Aktif' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <div class="faktur-table-box">
                        <table class="faktur-table">
                            <thead>
                                <tr>
                                    <th style="width: 44px; text-align: center;">No</th>
                                    <th>Deskripsi / Model Pakaian</th>
                                    <th style="width: 100px; text-align: right;">Jumlah</th>
                                    <th style="width: 130px; text-align: right;">Harga Satuan</th>
                                    <th style="width: 150px; text-align: right;">Total (IDR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in lineItems" :key="item.no">
                                    <td style="text-align: center; color: #94a3b8; font-family: monospace;">{{ item.no }}</td>
                                    <td>
                                        <div class="faktur-item-name flex items-center gap-2">
                                            <span>{{ item.name }}</span>
                                            <span
                                                v-if="item.size"
                                                class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300"
                                            >
                                                Size {{ item.size }}
                                            </span>
                                        </div>
                                        <div class="faktur-item-desc">Garansi jahitan rapi & QC lolos</div>
                                    </td>
                                    <td style="text-align: right; font-weight: 700; color: #0f172a;">
                                        {{ formatNumber(item.qty) }} pcs
                                    </td>
                                    <td style="text-align: right; font-family: monospace; color: #475569;">
                                        {{ formatRupiah(item.unitPrice) }}
                                    </td>
                                    <td style="text-align: right; font-weight: 700; font-family: monospace; color: #0f172a;">
                                        {{ formatRupiah(item.subtotal) }}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2" class="faktur-tfoot-label">
                                        Akumulasi Kuantitas
                                    </td>
                                    <td style="text-align: right; font-weight: 700; color: #0f172a;">
                                        {{ formatNumber(totalQuantity) }} pcs
                                    </td>
                                    <td class="faktur-tfoot-label" style="text-align: right;">
                                        Total Tagihan:
                                    </td>
                                    <td class="faktur-tfoot-amount">
                                        {{ formatRupiah(totalAmount) }}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <!-- Notes & Terms -->
                    <div class="faktur-terms">
                        <div class="faktur-terms-title">Syarat & Ketentuan Pemesanan:</div>
                        <p>1. Faktur ini merupakan bukti pemesanan resmi yang sah dari {{ companyInfo.name }}.</p>
                        <p>2. Barang pesanan diproduksi sesuai spesifikasi ukuran, model, dan bahan yang disepakati.</p>
                        <p>3. Komplain atau revisi hasil pengerjaan dapat diajukan maksimal 3 hari setelah serah terima barang.</p>
                    </div>

                    <!-- Signatures Box -->
                    <div class="faktur-signatures">
                        <div class="faktur-sig-box">
                            <div class="faktur-sig-title">Diterima oleh Pelanggan,</div>
                            <div class="faktur-sig-space"></div>
                            <div class="faktur-sig-underline">
                                ( {{ order.nm_cus }} )
                            </div>
                            <div class="faktur-sig-desc">Tanda Tangan & Cap</div>
                        </div>

                        <div class="faktur-sig-box">
                            <div class="faktur-sig-title">Hormat Kami,</div>
                            <div class="faktur-sig-space">
                                <span class="faktur-stamp">
                                    VERIFIED ORDER
                                </span>
                            </div>
                            <div class="faktur-sig-underline">
                                ( Manajemen Ruang Jahit )
                            </div>
                            <div class="faktur-sig-desc">Petugas Konveksi</div>
                        </div>
                    </div>
                </div>

                <!-- =========================================================================================
                     2. TEMPLATE STRUK PEMBELIAN (THERMAL RECEIPT 80MM)
                     ========================================================================================= -->
                <div
                    v-show="formatMode === 'struk'"
                    id="struk-print-content"
                    class="struk-paper shadow-md"
                >
                    <!-- Header Struk -->
                    <div class="struk-header">
                        <h2 class="struk-store-name">{{ companyInfo.name }}</h2>
                        <div class="struk-store-sub">{{ companyInfo.tagline }}</div>
                        <div class="struk-store-addr">{{ companyInfo.address }}</div>
                        <div class="struk-store-phone">TELP: {{ companyInfo.phone }}</div>
                    </div>

                    <div class="struk-dashed-line"></div>

                    <!-- Meta Order Struk -->
                    <div class="struk-meta">
                        <div class="struk-line">
                            <span class="struk-label">NO ORDER:</span>
                            <span class="struk-val">{{ order.no_order }}</span>
                        </div>
                        <div v-if="order.no_po" class="struk-line">
                            <span class="struk-label">NO PO:</span>
                            <span class="struk-val">{{ order.no_po }}</span>
                        </div>
                        <div class="struk-line">
                            <span class="struk-label">TANGGAL:</span>
                            <span class="struk-val">{{ formatDateIndo(order.tgl_order) }}</span>
                        </div>
                        <div class="struk-line">
                            <span class="struk-label">ESTIMASI:</span>
                            <span class="struk-val">{{ formatDateIndo(order.tgl_estimasi || '') }}</span>
                        </div>
                        <div class="struk-line">
                            <span class="struk-label">PELANGGAN:</span>
                            <span class="struk-val struk-truncate">{{ order.nm_cus }}</span>
                        </div>
                    </div>

                    <div class="struk-dashed-line"></div>

                    <!-- Line Items Table -->
                    <div class="struk-items">
                        <div v-for="item in lineItems" :key="item.no" class="struk-item-block">
                            <div class="struk-item-title">{{ item.name }} {{ item.size ? `[Size: ${item.size}]` : '' }}</div>
                            <div class="struk-line struk-item-detail">
                                <span>{{ item.qty }} pcs x {{ formatRupiah(item.unitPrice) }}</span>
                                <span class="struk-val">{{ formatRupiah(item.subtotal) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="struk-dashed-line"></div>

                    <!-- Total Section -->
                    <div class="struk-totals">
                        <div class="struk-line">
                            <span>TOTAL KUANTITAS:</span>
                            <span class="struk-val">{{ formatNumber(totalQuantity) }} pcs</span>
                        </div>
                        <div class="struk-line struk-grand-total">
                            <span>TOTAL BAYAR:</span>
                            <span class="struk-val">{{ formatRupiah(totalAmount) }}</span>
                        </div>
                    </div>

                    <div class="struk-dashed-line"></div>

                    <!-- Footer Struk -->
                    <div class="struk-footer">
                        <p class="font-bold text-slate-800">TERIMA KASIH ATAS PESANAN ANDA</p>
                        <p>Simpan struk ini sebagai bukti pengambilan & garansi jahitan.</p>
                        <p class="struk-footer-sub">=== RUANG JAHIT SYSTEM ===</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* Scoped styles to ensure preview in modal looks 100% identical to print output */
.faktur-paper {
    width: 100%;
    max-width: 760px;
    background: #ffffff;
    color: #0f172a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 24px 28px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    box-sizing: border-box;
}

.faktur-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 18px;
    border-bottom: 2px solid #e2e8f0;
    gap: 16px;
}

.faktur-brand {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.faktur-logo {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background-color: #2563eb;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.faktur-company-name {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: -0.025em;
    color: #0f172a;
    margin: 0 0 2px 0;
    line-height: 1.2;
}

.faktur-company-tagline {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    margin: 0;
}

.faktur-company-contact {
    font-size: 10.5px;
    color: #94a3b8;
    margin: 4px 0 0 0;
}

.faktur-meta {
    text-align: right;
}

.faktur-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 10.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    margin-bottom: 6px;
}

.faktur-no-order {
    font-size: 13px;
    font-weight: 700;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    color: #0f172a;
}

.faktur-date {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
}

.faktur-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 14px 16px;
    border-radius: 10px;
    background-color: #f8fafc;
    border: 1px solid #f1f5f9;
    margin: 16px 0;
    font-size: 11.5px;
}

.faktur-info-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 6px;
}

.faktur-customer-name {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 4px;
}

.faktur-info-row {
    color: #475569;
    margin-bottom: 3px;
    font-size: 11px;
}

.faktur-info-right {
    padding-left: 16px;
    border-left: 1px solid #e2e8f0;
}

.faktur-status-pill {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 700;
    background-color: #e2e8f0;
    color: #1e293b;
    margin-left: 4px;
}

.faktur-table-box {
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    margin-bottom: 16px;
}

.faktur-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11.5px;
}

.faktur-table thead {
    background-color: #f1f5f9;
    color: #334155;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 1px solid #e2e8f0;
}

.faktur-table th {
    padding: 9px 12px;
    font-weight: 700;
    text-align: left;
}

.faktur-table td {
    padding: 9px 12px;
    border-bottom: 1px solid #f1f5f9;
}

.faktur-item-name {
    font-weight: 600;
    color: #0f172a;
}

.faktur-item-desc {
    font-size: 9.5px;
    color: #94a3b8;
    margin-top: 1px;
}

.faktur-table tfoot {
    background-color: #f8fafc;
    border-top: 2px solid #e2e8f0;
    font-weight: 700;
}

.faktur-tfoot-label {
    text-transform: uppercase;
    font-size: 10px;
    color: #475569;
}

.faktur-tfoot-amount {
    text-align: right;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13.5px;
    font-weight: 900;
    color: #1d4ed8;
}

.faktur-terms {
    padding: 10px 14px;
    border-radius: 8px;
    background-color: #f8fafc;
    border: 1px solid #f1f5f9;
    font-size: 10.5px;
    color: #64748b;
    line-height: 1.45;
    margin-bottom: 20px;
}

.faktur-terms-title {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9.5px;
    color: #334155;
    margin-bottom: 3px;
}

.faktur-signatures {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 6px;
    font-size: 11px;
}

.faktur-sig-box {
    width: 190px;
    text-align: center;
}

.faktur-sig-title {
    font-size: 10.5px;
    color: #64748b;
    margin-bottom: 6px;
}

.faktur-sig-space {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.faktur-stamp {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 9.5px;
    font-weight: 800;
    color: #2563eb;
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    letter-spacing: 0.05em;
}

.faktur-sig-underline {
    border-bottom: 1px solid #94a3b8;
    font-weight: 600;
    color: #0f172a;
    padding-bottom: 4px;
}

.faktur-sig-desc {
    font-size: 9.5px;
    color: #94a3b8;
    margin-top: 3px;
}

/* Struk preview styles */
.struk-paper {
    width: 320px;
    max-width: 80mm;
    margin: 0 auto;
    background-color: #ffffff;
    color: #111827;
    font-family: 'Courier New', Courier, monospace;
    font-size: 11px;
    line-height: 1.4;
    padding: 18px 16px;
    border: 1.5px dashed #64748b;
    border-radius: 4px;
    box-sizing: border-box;
}

.struk-header {
    text-align: center;
    margin-bottom: 8px;
}

.struk-store-name {
    font-size: 15px;
    font-weight: 900;
    letter-spacing: 2px;
    margin: 0 0 3px 0;
    color: #000000;
}

.struk-store-sub, .struk-store-addr, .struk-store-phone {
    font-size: 9.5px;
    color: #374151;
    margin: 1px 0;
}

.struk-dashed-line {
    border-bottom: 1.5px dashed #1f2937;
    margin: 9px 0;
    width: 100%;
    height: 0;
}

.struk-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.5px;
    margin: 3px 0;
}

.struk-label {
    color: #4b5563;
}

.struk-val {
    color: #111827;
    text-align: right;
    font-weight: 600;
}

.struk-truncate {
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.struk-items {
    margin: 6px 0;
}

.struk-item-block {
    margin-bottom: 7px;
}

.struk-item-title {
    font-weight: 700;
    font-size: 11px;
    color: #000000;
    margin-bottom: 2px;
}

.struk-item-detail {
    font-size: 10px;
    color: #374151;
}

.struk-totals {
    margin: 6px 0;
}

.struk-grand-total {
    font-size: 12.5px;
    font-weight: 900;
    color: #000000;
    padding-top: 6px;
    margin-top: 6px;
    border-top: 1px dashed #6b7280;
}

.struk-footer {
    text-align: center;
    font-size: 9px;
    color: #4b5563;
    margin-top: 10px;
    line-height: 1.4;
}

.struk-footer-sub {
    margin-top: 7px;
    font-size: 8px;
    color: #9ca3af;
    letter-spacing: 1px;
}
</style>
