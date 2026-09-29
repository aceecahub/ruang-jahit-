import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    LayoutGrid,
    TrendingUp,
    Scissors,
    Banknote,
    Boxes,
    Users,
    UserCheck,
    Truck,
} from '@lucide/vue';

export type DashboardTabKey =
    | 'overview'
    | 'sales'
    | 'production'
    | 'finance'
    | 'inventory'
    | 'customers'
    | 'employees'
    | 'quality';

export interface DashboardTabItem {
    key: DashboardTabKey;
    title: string;
    icon: any;
    href: string;
}

export const DASHBOARD_TABS: DashboardTabItem[] = [
    { key: 'overview', title: 'Ringkasan Bisnis', icon: LayoutGrid, href: '/dashboard?tab=overview' },
    { key: 'sales', title: 'Penjualan', icon: TrendingUp, href: '/dashboard?tab=sales' },
    { key: 'production', title: 'Produksi', icon: Scissors, href: '/dashboard?tab=production' },
    { key: 'finance', title: 'Keuangan', icon: Banknote, href: '/dashboard?tab=finance' },
    { key: 'inventory', title: 'Inventaris & Bahan', icon: Boxes, href: '/dashboard?tab=inventory' },
    { key: 'customers', title: 'Pelanggan', icon: Users, href: '/dashboard?tab=customers' },
    { key: 'employees', title: 'Produktivitas Karyawan', icon: UserCheck, href: '/dashboard?tab=employees' },
    { key: 'quality', title: 'Kualitas & Pengiriman', icon: Truck, href: '/dashboard?tab=quality' },
];

// Shared active tab state
const activeTabState = ref<DashboardTabKey>('overview');

export function useDashboardTab() {
    function initTabFromUrl() {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab') as DashboardTabKey;
            if (tabParam && DASHBOARD_TABS.some((t) => t.key === tabParam)) {
                activeTabState.value = tabParam;
            }
        }
    }

    function switchTab(tabKey: string) {
        if (DASHBOARD_TABS.some((t) => t.key === tabKey)) {
            const validKey = tabKey as DashboardTabKey;
            activeTabState.value = validKey;

            if (typeof window !== 'undefined') {
                if (window.location.pathname === '/dashboard') {
                    // Smoothly update URL query without reloading the entire page
                    const url = new URL(window.location.href);
                    url.searchParams.set('tab', validKey);
                    window.history.replaceState(null, '', url.toString());
                } else {
                    // Navigate to dashboard with tab parameter if currently on another page
                    router.visit(`/dashboard?tab=${validKey}`);
                }
            }
        }
    }

    return {
        activeTab: computed(() => activeTabState.value),
        tabs: DASHBOARD_TABS,
        switchTab,
        initTabFromUrl,
    };
}
