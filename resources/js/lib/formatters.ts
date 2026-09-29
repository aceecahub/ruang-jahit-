/**
 * Formatters for Convection & Tailoring Business Dashboard
 */

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatNumber(val: number): string {
    return new Intl.NumberFormat('id-ID').format(val);
}

export function formatPercent(val: number): string {
    return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
}

export function formatDateIndo(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}
