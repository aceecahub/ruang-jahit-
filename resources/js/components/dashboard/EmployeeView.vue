<script setup lang="ts">
import { computed } from 'vue';
import {
    Users,
    UserCheck,
    Scissors,
    Clock,
    AlertTriangle,
    Award,
    Layers,
} from '@lucide/vue';
import KpiCard from './KpiCard.vue';
import { initialEmployeeData } from '@/data/employeeData';
import { formatNumber } from '@/lib/formatters';

const props = defineProps<{
    isDark?: boolean;
    searchQuery?: string;
}>();

const summary = initialEmployeeData.summary;

// Filtered employees
const filteredEmployees = computed(() => {
    return initialEmployeeData.employees.filter((emp) => {
        if (!props.searchQuery) return true;
        const q = props.searchQuery.toLowerCase();
        return (
            emp.name.toLowerCase().includes(q) ||
            emp.role.toLowerCase().includes(q) ||
            emp.department.toLowerCase().includes(q) ||
            emp.nip.toLowerCase().includes(q)
        );
    });
});
</script>

<template>
    <div class="space-y-6">

        <!-- Employee KPI Matrix -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                title="Karyawan & Penjahit Aktif"
                :value="summary.totalActiveStaff"
                unit="Orang"
                type="number"
                :change="0"
                :is-positive="true"
                period-text="16 Jahit, 3 Potong, 5 QC & Ops"
                tooltip="Jumlah total tenaga kerja operasional yang aktif di workshop saat ini."
                :icon="Users"
                icon-bg="bg-blue-50 dark:bg-blue-950/40"
                icon-color="text-blue-600 dark:text-blue-400"
            />
            <KpiCard
                title="Tingkat Kehadiran (Attendance)"
                :value="summary.attendancePercentage"
                type="percent"
                :change="1.2"
                :is-positive="true"
                period-text="Tingkat presensi bulan ini"
                tooltip="Rasio kehadiran kerja staf produksi dibandingkan hari kerja efektif."
                :icon="UserCheck"
                icon-bg="bg-emerald-50 dark:bg-emerald-950/40"
                icon-color="text-emerald-600 dark:text-emerald-400"
            />
            <KpiCard
                title="Total Jam Lembur Regu"
                :value="summary.totalOvertimeHours"
                unit="Jam"
                type="number"
                :change="8.5"
                :is-positive="false"
                period-text="Dijalankan untuk kejar deadline"
                tooltip="Akumulasi lembur kerja staf jahit untuk memenuhi tenggat order urgent."
                :icon="Clock"
                icon-bg="bg-amber-50 dark:bg-amber-950/40"
                icon-color="text-amber-600 dark:text-amber-400"
            />
            <KpiCard
                title="Rata-rata Output Harian / Penjahit"
                :value="summary.avgPcsPerTailorDaily"
                unit="Pcs/Hari"
                type="number"
                :change="2.4"
                :is-positive="true"
                period-text="Standar kuota: 25 Pcs/hari"
                tooltip="Produktivitas rata-rata yang diselesaikan seorang penjahit dalam 1 hari kerja normal."
                :icon="Scissors"
                icon-bg="bg-indigo-50 dark:bg-indigo-950/40"
                icon-color="text-indigo-600 dark:text-indigo-400"
            />
        </section>

        <!-- Produktivitas Berdasarkan Bagian Kerja -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 class="text-base font-semibold text-slate-900 dark:text-white">Efisiensi Output Berdasarkan Departemen</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Perbandingan target harian vs realisasi produksi pada tiap divisi kerja</p>
                </div>
                <Layers class="h-4 w-4 text-slate-400" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-5">
                <div
                    v-for="dept in initialEmployeeData.departmentProductivity"
                    :key="dept.department"
                    class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50 flex flex-col justify-between"
                >
                    <div>
                        <span class="text-xs font-bold text-slate-900 dark:text-white block truncate">{{ dept.department }}</span>
                        <span class="text-[11px] text-slate-400 block mt-0.5">{{ dept.staffCount }} Tenaga Kerja</span>

                        <div class="mt-4 flex items-baseline justify-between">
                            <span class="text-lg font-bold text-slate-900 dark:text-white">{{ dept.avgDailyPcs }} pcs</span>
                            <span class="text-xs text-slate-400">/ {{ dept.targetDailyPcs }} pcs</span>
                        </div>

                        <!-- Progress Bar -->
                        <div class="mt-2 space-y-1">
                            <div class="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <div
                                    class="h-full rounded-full transition-all"
                                    :class="dept.efficiencyRate >= 95 ? 'bg-emerald-500' : 'bg-blue-600'"
                                    :style="{ width: `${Math.min(100, dept.efficiencyRate)}%` }"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Efisiensi: <strong class="text-slate-700 dark:text-slate-200 font-semibold">{{ dept.efficiencyRate }}%</strong></span>
                        <span class="text-amber-600 dark:text-amber-400 font-medium">{{ dept.totalOvertimeHours }} jam OT</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Tabel Produktivitas Karyawan & Penjahit -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm shadow-slate-200/40 dark:shadow-none">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 class="text-base font-semibold text-slate-900 dark:text-white">Leaderboard Produktivitas Staf & Penjahit</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Pantau target output, kehadiran, lembur, dan rasio cacat jahitan (QC defect)</p>
                </div>
                <span class="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    {{ filteredEmployees.length }} Karyawan Terdaftar
                </span>
            </div>

            <div class="mt-4 overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                            <th class="pb-3 font-semibold">Nama & NIP</th>
                            <th class="pb-3 font-semibold">Peran & Bagian</th>
                            <th class="pb-3 font-semibold text-center">Presensi</th>
                            <th class="pb-3 font-semibold text-center">Output / Target</th>
                            <th class="pb-3 font-semibold text-center">Lembur</th>
                            <th class="pb-3 font-semibold text-center">Cacat (QC)</th>
                            <th class="pb-3 font-semibold text-right">Rating Efisiensi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
                        <tr
                            v-for="emp in filteredEmployees"
                            :key="emp.id"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                        >
                            <td class="py-3.5 pr-3">
                                <div class="font-bold text-slate-900 dark:text-white">{{ emp.name }}</div>
                                <div class="text-[11px] text-slate-400 font-mono">{{ emp.nip }}</div>
                            </td>
                            <td class="py-3.5">
                                <div class="font-medium text-slate-800 dark:text-slate-200">{{ emp.role }}</div>
                                <div class="text-[10px] text-slate-400">Divisi {{ emp.department }}</div>
                            </td>
                            <td class="py-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                                {{ emp.attendanceRate }}%
                            </td>
                            <td class="py-3.5 text-center">
                                <span class="font-bold text-slate-900 dark:text-white">{{ emp.completedPcs }}</span>
                                <span class="text-slate-400 text-[11px]"> / {{ emp.targetPcs }} pcs</span>
                                <span class="block text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">({{ emp.achievementRate }}%)</span>
                            </td>
                            <td class="py-3.5 text-center text-slate-700 dark:text-slate-300 font-medium">
                                {{ emp.overtimeHours }} Jam
                            </td>
                            <td class="py-3.5 text-center">
                                <span
                                    class="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold"
                                    :class="[
                                        emp.defectRate <= 0.5
                                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                            : emp.defectRate <= 1.5
                                            ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                                            : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                                    ]"
                                >
                                    {{ emp.defectPcs }} pcs ({{ emp.defectRate }}%)
                                </span>
                            </td>
                            <td class="py-3.5 text-right font-semibold text-slate-800 dark:text-slate-200">
                                {{ emp.efficiencyRating }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

    </div>
</template>
