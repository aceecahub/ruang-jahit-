import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    LayoutGrid,
    TrendingUp,
    ClipboardList,
    Banknote,
    Boxes,
    Users,
    UserCheck,
    Truck,
} from '@lucide/vue';

export type DashboardTabKey =
    | 'overview'
    | 'sales'
    | 'orders'
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
    { key: 'orders', title: 'Orderan', icon: ClipboardList, href: '/dashboard?tab=orders' },
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
            let tabParam = params.get('tab') as DashboardTabKey;
            // Backwards compatibility for 'production' -> 'orders'
            if ((tabParam as any) === 'production') {
                tabParam = 'orders';
            }
            if (tabParam && DASHBOARD_TABS.some((t) => t.key === tabParam)) {
                activeTabState.value = tabParam;
            }
        }
    }

    function switchTab(tabKey: string) {
        let validKey = tabKey as DashboardTabKey;
        if ((validKey as any) === 'production') {
            validKey = 'orders';
        }
        if (DASHBOARD_TABS.some((t) => t.key === validKey)) {
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
