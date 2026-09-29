<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { dashboard } from '@/routes';
import { edit } from '@/routes/profile';
import { LayoutGrid, FolderGit2, BookOpen, User } from '@lucide/vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';

const { isCurrentUrl } = useCurrentUrl();

const navItems = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Repository', href: 'https://github.com/laravel/vue-starter-kit', icon: FolderGit2, external: true },
    { title: 'Docs', href: 'https://laravel.com/docs/starter-kits#vue', icon: BookOpen, external: true },
    { title: 'Profil', href: edit(), icon: User },
];
</script>

<template>
    <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800 md:hidden flex items-center justify-around px-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]">
        <template v-for="item in navItems" :key="item.title">
            <a v-if="item.external"
               :href="item.href"
               target="_blank"
               class="flex flex-col items-center justify-center w-full h-full gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
                <component :is="item.icon" class="h-5 w-5" />
                <span class="text-[10px] font-medium">{{ item.title }}</span>
            </a>
            <Link v-else
                :href="item.href"
                class="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors"
                :class="isCurrentUrl(item.href) ? 'text-blue-600 dark:text-blue-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            >
                <component :is="item.icon" class="h-5 w-5" :class="{ 'fill-blue-100 dark:fill-blue-900/30': isCurrentUrl(item.href) }" />
                <span class="text-[10px] font-medium">{{ item.title }}</span>
            </Link>
        </template>
    </div>
</template>

