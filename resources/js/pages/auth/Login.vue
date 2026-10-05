<script setup lang="ts">
import { ref } from 'vue';
import { Form, Head, Link } from '@inertiajs/vue3';

import InputError from '@/components/InputError.vue';
import { Spinner } from '@/components/ui/spinner';
// Mengimpor semua ikon yang dibutuhkan, termasuk Eye dan EyeOff
import { CheckCircle2, Lock, Scissors, User, TrendingUp, Eye, EyeOff } from '@lucide/vue';

defineProps<{
    status?: string;
}>();

const usernameInput = ref('');
// Variabel untuk mengontrol visibilitas password
const showPassword = ref(false);
</script>

<template>
    <Head title="Login" />

    <div
        class="flex min-h-svh items-center justify-center bg-slate-50 p-4 font-sans text-slate-900 sm:p-6 lg:p-8"
    >
        <div
            class="my-auto flex w-full max-w-[1040px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >
            <!-- Panel Kiri: Form login -->
            <div
                class="flex w-full flex-col justify-between px-6 py-10 sm:px-12 lg:w-[45%] lg:px-16 lg:py-12"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm"
                    >
                        <Scissors class="h-5 w-5" />
                    </div>

                    <span class="text-xl font-bold tracking-tight text-slate-900">
                        Ruang Jahit
                    </span>
                </div>

                <div class="my-12 flex w-full flex-col justify-center">
                    <h1 class="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
                        Panel Owner
                    </h1>

                    <p class="mb-8 text-sm text-slate-500 leading-relaxed">
                        Masuk untuk memantau ringkasan pesanan, laporan produksi, dan data operasional Ruang Jahit.
                    </p>

                    <div
                        v-if="status"
                        class="mb-4 text-sm font-medium text-green-600"
                    >
                        {{ status }}
                    </div>

                    <Form
                        action="/login"
                        method="post"
                        :reset-on-success="['password']"
                        v-slot="{ errors, processing }"
                        class="flex flex-col gap-5"
                    >
                        <!-- Input Username -->
                        <div>
                            <div
                                class="relative flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 shadow-sm transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-600"
                            >
                                <User class="h-5 w-5 text-slate-400" />

                                <div class="flex flex-1 flex-col">
                                    <label
                                        for="username"
                                        class="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                                    >
                                        Username
                                    </label>

                                    <input
                                        id="username"
                                        v-model="usernameInput"
                                        type="text"
                                        name="Username"
                                        required
                                        autofocus
                                        autocomplete="username"
                                        class="w-full border-none bg-transparent p-0 pt-0.5 text-sm font-medium text-slate-900 outline-none focus:ring-0"
                                        placeholder="Masukkan username Anda"
                                    />
                                </div>

                                <CheckCircle2
                                    v-if="usernameInput && !errors.Username"
                                    class="h-5 w-5 text-emerald-500"
                                />
                            </div>

                            <InputError
                                :message="errors.Username"
                                class="mt-1.5"
                            />
                        </div>

                        <!-- Input Password dengan Fitur Tampilkan/Sembunyikan -->
                        <div>
                            <div
                                class="relative flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 shadow-sm transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-600"
                            >
                                <Lock class="h-5 w-5 text-slate-400" />

                                <div class="relative flex flex-1 flex-col">
                                    <div class="flex items-center justify-between">
                                        <label
                                            for="password"
                                            class="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                                        >
                                            Password
                                        </label>

                                    </div>

                                    <!-- Type dinamis antara text dan password -->
                                    <input
                                        id="password"
                                        :type="showPassword ? 'text' : 'password'"
                                        name="password"
                                        required
                                        autocomplete="current-password"
                                        class="w-full border-none bg-transparent p-0 pr-8 pt-0.5 text-sm font-medium text-slate-900 outline-none focus:ring-0"
                                        placeholder="••••••••"
                                    />

                                    <!-- Tombol Mata (Toggle) -->
                                    <button
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        class="absolute bottom-0 right-0 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                                        title="Tampilkan password"
                                    >
                                        <Eye v-if="!showPassword" class="h-7 w-7" />
                                        <EyeOff v-else class="h-7 w-7" />
                                    </button>
                                </div>
                            </div>

                            <InputError
                                :message="errors.password"
                                class="mt-1.5"
                            />
                        </div>

                        <!-- Tombol Submit -->
                        <button
                            type="submit"
                            :disabled="processing"
                            class="mt-4 flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.99] disabled:opacity-70"
                        >
                            <Spinner
                                v-if="processing"
                                class="mr-2 h-5 w-5"
                            />

                            Masuk ke Dashboard
                        </button>
                    </Form>
                </div>

                <p class="mt-auto text-xs text-slate-400">
                    &copy; 2026 Ruang Jahit. Dasbor Internal.
                </p>
            </div>

            <!-- Panel Kanan: Ilustrasi Dashboard Abstrak (Biru Profesional) -->
            <div
                class="relative hidden min-h-[600px] w-[55%] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 to-blue-900 lg:flex"
            >
                <!-- Latar Belakang Pola Grid Transparan -->
                <div
                    class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]"
                ></div>

                <!-- Efek Cahaya (Glow) di Sudut -->
                <div class="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-blue-400/30 blur-[100px]"></div>
                <div class="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-cyan-400/20 blur-[100px]"></div>

                <!-- Mockup Kartu Grafik Data bergaya Glassmorphism -->
                <div class="relative z-10 w-3/4 max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                    <div class="mb-8 flex items-center justify-between">
                        <div>
                            <div class="mb-2 h-4 w-24 rounded bg-white/80"></div>
                            <div class="h-3 w-16 rounded bg-white/40"></div>
                        </div>
                        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white">
                            <TrendingUp class="h-5 w-5" />
                        </div>
                    </div>

                    <!-- Batang Grafik -->
                    <div class="flex h-32 items-end gap-3">
                        <div class="w-full rounded-t-sm bg-white/20 h-[40%] transition-all hover:bg-white/40"></div>
                        <div class="relative w-full rounded-t-sm bg-white h-[70%]">
                            <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white"></div>
                        </div>
                        <div class="w-full rounded-t-sm bg-white/20 h-[50%] transition-all hover:bg-white/40"></div>
                        <div class="w-full rounded-t-sm bg-white/20 h-[30%] transition-all hover:bg-white/40"></div>
                        <div class="relative w-full rounded-t-sm bg-white/80 h-[90%]">
                            <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white"></div>
                        </div>
                        <div class="w-full rounded-t-sm bg-white/20 h-[60%] transition-all hover:bg-white/40"></div>
                    </div>
                </div>

                <!-- Teks pelengkap di atas visual -->
                <div class="relative z-10 mt-10 text-center">
                    <h3 class="text-lg font-semibold tracking-wide text-white">Sistem Manajemen Bisnis</h3>
                    <p class="mt-2 text-sm text-blue-200">Keamanan terenkripsi &middot; Akses terbatas</p>
                </div>
            </div>
        </div>
    </div>
</template>
