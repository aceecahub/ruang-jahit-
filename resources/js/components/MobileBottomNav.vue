<script setup lang="ts">
import { useDashboardTab } from '@/composables/useDashboardTab';

const { activeTab, tabs, switchTab } = useDashboardTab();
</script>

<template>
    <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800 md:hidden flex items-center px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full py-1 px-1">
            <button
                v-for="item in tabs"
                :key="item.key"
                type="button"
                @click="switchTab(item.key)"
                class="flex flex-col items-center justify-center shrink-0 min-w-[70px] px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                :class="[
                    activeTab === item.key
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                ]"
            >
                <component :is="item.icon" class="h-4 w-4" />
                <span class="text-[10px] mt-0.5 whitespace-nowrap">{{ item.title }}</span>
            </button>
        </div>
    </div>
</template>
