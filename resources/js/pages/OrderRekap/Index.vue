<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';

type Row = Record<string, string | number | boolean | null>;

const props = defineProps<{
    rows: Row[];
}>();

const columns = computed(() => Object.keys(props.rows[0] ?? {}));
</script>

<template>
    <Head title="Rekap Order" />

    <main class="min-h-screen bg-slate-50 p-6 text-slate-900">
        <div class="mx-auto max-w-7xl">
            <Link href="/" class="text-sm text-blue-600 hover:underline">
                ← Kembali ke dashboard
            </Link>

            <h1 class="mt-5 text-2xl font-bold">Rekap Order</h1>
            <p class="mt-1 text-sm text-slate-500">
                Menampilkan maksimal 50 baris dari v_q_order_rekap_det.
            </p>

            <div
                v-if="rows.length === 0"
                class="mt-6 rounded-lg bg-white p-6 text-slate-500 shadow-sm"
            >
                View tidak mengembalikan data.
            </div>

            <div v-else class="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
                <table class="min-w-full border-collapse text-left text-sm">
                    <thead class="bg-slate-100">
                        <tr>
                            <th
                                v-for="column in columns"
                                :key="column"
                                class="whitespace-nowrap border-b px-4 py-3 font-semibold"
                            >
                                {{ column }}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="(row, index) in rows"
                            :key="index"
                            class="border-b last:border-b-0"
                        >
                            <td
                                v-for="column in columns"
                                :key="column"
                                class="whitespace-nowrap px-4 py-3"
                            >
                                {{ row[column] ?? '-' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</template>
