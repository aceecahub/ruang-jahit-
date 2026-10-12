import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { ClipboardList } from '@lucide/vue';

export type DashboardTabKey = 'orders';

export interface DashboardTabItem {
    key: DashboardTabKey;
    title: string;
    icon: any;
    href: string;
}

export const DASHBOARD_TABS: DashboardTabItem[] = [
    { key: 'orders', title: 'Orderan', icon: ClipboardList, href: '/dashboard?tab=orders' },
];

// Shared active tab state
const activeTabState = ref<DashboardTabKey>('orders');

export function useDashboardTab() {
    function initTabFromUrl() {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab') as DashboardTabKey;
            if (tabParam && DASHBOARD_TABS.some((t) => t.key === tabParam)) {
                activeTabState.value = tabParam;
            } else {
                activeTabState.value = 'orders';
            }
        }
    }

    function switchTab(tabKey: string) {
        const validKey = tabKey as DashboardTabKey;
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
