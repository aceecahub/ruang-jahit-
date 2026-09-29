<script setup lang="ts">
import { ref } from 'vue';
import { Form, Head, Link } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { update } from '@/routes/password';
import { Mail, Lock, Play, ArrowLeft } from '@lucide/vue';

const props = defineProps<{
    token: string;
    email: string;
    passwordRules?: string;
}>();

const passwordInput = ref('');
const passwordConfirmationInput = ref('');
</script>

<template>
    <Head title="Reset password" />

    <div class="flex min-h-svh items-center justify-center bg-[#edf2f9] p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
        <div class="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-300/50 border border-slate-100 font-sans text-slate-900 my-auto">
            <!-- Left Panel: Form -->
            <div class="flex w-full flex-col justify-between px-6 py-8 sm:px-10 lg:w-1/2 lg:px-14 lg:py-10">
                <!-- Header / Logo -->
                <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <Play class="h-4 w-4 fill-current ml-0.5" />
                    </div>
                    <span class="text-xl font-bold tracking-tight">SmartSave</span>
                </div>
    
                <!-- Form Container -->
                <div class="mx-auto my-6 flex w-full max-w-sm flex-col justify-center">
                    <h1 class="mb-2 text-center text-3xl font-bold tracking-tight">Reset Password</h1>
                    <p class="mb-6 text-center text-sm text-slate-500">
                        Please enter your new password below
                    </p>
    
                    <Form
                        v-bind="update.form()"
                        :transform="(data) => ({ ...data, token, email })"
                        :reset-on-success="['password', 'password_confirmation']"
                        v-slot="{ errors, processing }"
                        class="flex flex-col gap-4"
                    >
                        <!-- Email Field (Readonly) -->
                        <div>
                            <div class="relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 shadow-sm">
                                <Mail class="h-5 w-5 text-slate-400" />
                                <div class="flex flex-1 flex-col">
                                    <label for="email" class="text-[10px] font-medium text-slate-500">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        :value="email"
                                        readonly
                                        class="w-full border-none bg-transparent p-0 text-sm font-semibold text-slate-600 outline-none focus:ring-0 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <InputError :message="errors.email" class="mt-1 ml-2" />
                        </div>
    
                        <!-- Password Field -->
                        <div>
                            <div class="relative flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2.5 transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 shadow-sm">
                                <Lock class="h-5 w-5 text-slate-400" />
                                <div class="flex flex-1 flex-col">
                                    <label for="password" class="text-[10px] font-medium text-slate-500">New Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        v-focus
                                        autocomplete="new-password"
                                        class="w-full border-none bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none focus:ring-0"
                                        placeholder="••••••••"
                                        v-model="passwordInput"
                                    />
                                </div>
                            </div>
                            <InputError :message="errors.password" class="mt-1 ml-2" />
                        </div>

                        <!-- Confirm Password Field -->
                        <div>
                            <div class="relative flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2.5 transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 shadow-sm">
                                <Lock class="h-5 w-5 text-slate-400" />
                                <div class="flex flex-1 flex-col">
                                    <label for="password_confirmation" class="text-[10px] font-medium text-slate-500">Confirm New Password</label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        required
                                        autocomplete="new-password"
                                        class="w-full border-none bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none focus:ring-0"
                                        placeholder="••••••••"
                                        v-model="passwordConfirmationInput"
                                    />
                                </div>
                            </div>
                            <InputError :message="errors.password_confirmation" class="mt-1 ml-2" />
                        </div>
    
                        <!-- Submit Button -->
                        <button
                            type="submit"
                            :disabled="processing"
                            class="mt-2 flex w-full items-center justify-center rounded-2xl bg-[#0066FF] py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                        >
                            <Spinner v-if="processing" class="mr-2 h-5 w-5" />
                            Reset Password
                        </button>
                    </Form>
    
                    <!-- Back to Login Link -->
                    <div class="mt-6 flex justify-center">
                        <Link
                            :href="login()"
                            class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                        >
                            <ArrowLeft class="h-4 w-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
    
                <!-- Footer -->
                <p class="mx-auto mt-4 max-w-sm text-center text-[11px] leading-relaxed text-slate-400">
                    Join the millions of smart investors who trust us to manage their finances. Log in to access your personalized dashboard, track your portfolio performance, and make informed investment decisions.
                </p>
            </div>
    
            <!-- Right Panel: Illustration -->
            <div class="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#E2F1FF] to-[#9DC3F3] lg:flex min-h-[580px]">
                <!-- Matrix / Raindrop style background lines -->
                <div class="absolute inset-0 flex justify-evenly">
                    <div class="h-full w-px bg-white/20"></div>
                    <div class="h-full w-px bg-white/20"></div>
                    <div class="h-full w-px bg-white/20"></div>
                    <div class="h-full w-px bg-white/20"></div>
                    <div class="h-full w-px bg-white/20"></div>
                    <div class="h-full w-px bg-white/20"></div>
                    <div class="h-full w-px bg-white/20"></div>
                </div>
                
                <!-- Vault/Safe 3D Graphic -->
                <div class="relative z-10 flex h-[280px] w-[280px] items-center justify-center rounded-[40px] bg-[#295F8C] shadow-2xl shadow-[#1C4569]/30">
                    <!-- Inner box -->
                    <div class="absolute inset-2 flex items-center justify-center rounded-[32px] bg-[#3B7BAE]">
                        <!-- Outer door -->
                        <div class="relative flex h-[200px] w-[200px] items-center justify-center rounded-[24px] bg-[#2A517E] shadow-inner border border-[#21436A]">
                            <!-- Safe handle (right edge) -->
                            <div class="absolute right-3 flex h-14 w-2.5 items-center justify-center rounded-sm bg-slate-200 shadow-md">
                                <div class="h-full w-[2px] bg-slate-300"></div>
                            </div>
    
                            <!-- Wheel base -->
                            <div class="absolute flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#52CAE6] shadow-lg border-[3px] border-[#3EAEC8]">
                                <!-- Wheel mechanism -->
                                <div class="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-[8px] border-[#31A5C4] bg-[#52CAE6] shadow-inner">
                                    <!-- Center nub -->
                                    <div class="relative z-10 h-[22px] w-[22px] rounded-full bg-[#2A517E] shadow-md"></div>
                                    <!-- Spokes -->
                                    <div class="absolute h-full w-[6px] bg-[#31A5C4]"></div>
                                    <div class="absolute h-[6px] w-full bg-[#31A5C4]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Ground shadow for the vault -->
                <div class="relative z-0 mt-8 h-8 w-[240px] rounded-[100%] bg-[#1C4569]/20 blur-xl"></div>
            </div>
        </div>
    </div>
</template>
