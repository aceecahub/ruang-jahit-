<script setup lang="ts">
import { ref } from 'vue';
import { Form, Head, Link } from '@inertiajs/vue3';

import InputError from '@/components/InputError.vue';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, Lock, Play, User } from '@lucide/vue';

defineProps<{
    status?: string;
}>();

const usernameInput = ref('');
</script>

<template>
    <Head title="Login" />

    <div
        class="flex min-h-svh items-center justify-center bg-[#edf2f9] p-4 font-sans text-slate-900 sm:p-6 lg:p-8"
    >
        <div
            class="my-auto flex w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-300/50"
        >
            <!-- Form login -->
            <div
                class="flex w-full flex-col justify-between px-6 py-8 sm:px-10 lg:w-1/2 lg:px-14 lg:py-10"
            >
                <div class="flex items-center gap-2">
                    <div
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white"
                    >
                        <Play class="ml-0.5 h-4 w-4 fill-current" />
                    </div>

                    <span class="text-xl font-bold tracking-tight">
                        Ruang Jahit
                    </span>
                </div>

                <div
                    class="mx-auto my-10 flex w-full max-w-sm flex-col justify-center"
                >
                    <h1
                        class="mb-2 text-center text-3xl font-bold tracking-tight"
                    >
                        Selamat Datang
                    </h1>

                    <p class="mb-8 text-center text-sm text-slate-500">
                        Masuk untuk melihat data dan laporan Ruang Jahit.
                    </p>

                    <div
                        v-if="status"
                        class="mb-4 text-center text-sm font-medium text-green-600"
                    >
                        {{ status }}
                    </div>

                    <Form
                        action="/login"
    method="post"
    :reset-on-success="['password']"
    v-slot="{ errors, processing }"
    class="flex flex-col gap-4"
                    >
                        <div>
                            <div
                                class="relative flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2.5 shadow-sm transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                            >
                                <User class="h-5 w-5 text-slate-400" />

                                <div class="flex flex-1 flex-col">
                                    <label
                                        for="username"
                                        class="text-[10px] font-medium text-slate-500"
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
                                        class="w-full border-none bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none focus:ring-0"
                                        placeholder="Masukkan username"
                                    />
                                </div>

                                <CheckCircle2
                                    v-if="usernameInput && !errors.Username"
                                    class="h-5 w-5 text-green-500"
                                />
                            </div>

                            <InputError
                                :message="errors.Username"
                                class="ml-2 mt-1"
                            />
                        </div>

                        <div>
                            <div
                                class="relative flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2.5 shadow-sm transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                            >
                                <Lock class="h-5 w-5 text-slate-400" />

                                <div class="flex flex-1 flex-col">
                                    <div class="flex items-center justify-between">
                                        <label
                                            for="password"
                                            class="text-[10px] font-medium text-slate-500"
                                        >
                                            Password
                                        </label>
                                        <Link
                                            href="/forgot-password"
                                            class="text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                                        >
                                            Lupa password?
                                        </Link>
                                    </div>

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        autocomplete="current-password"
                                        class="w-full border-none bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none focus:ring-0"
                                        placeholder="Masukkan password"
                                    />
                                </div>
                            </div>

                            <InputError
                                :message="errors.password"
                                class="ml-2 mt-1"
                            />
                        </div>

                        <button
                            type="submit"
                            :disabled="processing"
                            class="mt-2 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-[#0066FF] py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700 active:scale-[0.99] disabled:opacity-70"
                        >
                            <Spinner
                                v-if="processing"
                                class="mr-2 h-5 w-5"
                            />

                            Masuk
                        </button>
                    </Form>
                </div>

                <p class="mx-auto mt-4 max-w-sm text-center text-xs text-slate-400">
                    Gunakan akun Ruang Jahit yang sudah diberikan kepada Anda.
                </p>
            </div>

            <!-- Panel kanan -->
            <div
                class="relative hidden min-h-[580px] w-1/2 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#E2F1FF] to-[#9DC3F3] lg:flex"
            >
                <div class="absolute inset-0 flex justify-evenly">
                    <div
                        v-for="line in 7"
                        :key="line"
                        class="h-full w-px bg-white/20"
                    />
                </div>

                <div
                    class="relative z-10 flex h-[280px] w-[280px] items-center justify-center rounded-[40px] border border-white/30 bg-[#295F8C] shadow-2xl shadow-[#1C4569]/30"
                >
                    <div
                        class="flex h-[210px] w-[210px] items-center justify-center rounded-[32px] bg-[#3B7BAE]"
                    >
                        <div
                            class="flex h-[145px] w-[145px] items-center justify-center rounded-full border-[12px] border-[#31A5C4] bg-[#52CAE6] shadow-inner"
                        >
                            <div
                                class="h-12 w-12 rounded-full bg-[#2A517E] shadow-md"
                            />
                        </div>
                    </div>
                </div>

                <div
                    class="relative z-0 mt-8 h-8 w-[240px] rounded-[100%] bg-[#1C4569]/20 blur-xl"
                />
            </div>
        </div>
    </div>
</template>
