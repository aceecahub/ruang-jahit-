<script setup lang="ts">
import { computed } from 'vue';
import { TrendingUp, TrendingDown, HelpCircle } from '@lucide/vue';
import { formatRupiah, formatNumber } from '@/lib/formatters';

interface Props {
    title: string;
    value: number;
    type?: 'currency' | 'number' | 'percent';
    unit?: string;
    change?: number;
    isPositive?: boolean;
    periodText?: string;
    tooltip?: string;
    icon?: any;
    iconBg?: string;
    iconColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'number',
    isPositive: true,
    periodText: 'vs. periode lalu',
});

const formattedValue = computed(() => {
    if (props.type === 'currency') {
        return formatRupiah(props.value);
    }
    if (props.type === 'percent') {
        return `${props.value.toFixed(1)}%`;
    }
    return formatNumber(props.value);
});
</script>

<template>
    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 shadow-sm shadow-slate-200/40 dark:shadow-none transition hover:border-slate-200 dark:hover:border-slate-700 flex flex-col justify-between">
        <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{{ title }}</span>
                <span v-if="tooltip" :title="tooltip" class="cursor-help text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400">
                    <HelpCircle class="h-3.5 w-3.5" />
                </span>
            </div>
            <div
                v-if="icon"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                :class="[iconBg || 'bg-blue-50 dark:bg-blue-950/40', iconColor || 'text-blue-600 dark:text-blue-400']"
            >
                <component :is="icon" class="h-4 w-4" />
            </div>
        </div>

        <div class="mt-3 flex items-baseline gap-2.5">
            <span class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {{ formattedValue }}
            </span>
            <span v-if="unit" class="text-xs font-medium text-slate-400 dark:text-slate-500">
                {{ unit }}
            </span>
            <span
                v-if="change !== undefined"
                class="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                :class="[
                    isPositive
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                ]"
            >
                <TrendingUp v-if="isPositive" class="h-3 w-3" />
                <TrendingDown v-else class="h-3 w-3" />
                {{ change > 0 ? '+' : '' }}{{ change }}%
            </span>
        </div>

        <p class="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {{ periodText }}
        </p>
    </div>
</template>
