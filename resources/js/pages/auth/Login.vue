<script setup lang="ts">
import { ref } from 'vue';
import { Form, Head, Link } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Lock, CheckCircle2, Play, User } from '@lucide/vue';

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();

const emailInput = ref('');
const passwordInput = ref('');
</script>

<template>
    <Head title="Log in" />

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
                    <h1 class="mb-2 text-center text-3xl font-bold tracking-tight">Welcome Back</h1>
                    <p class="mb-6 text-center text-sm text-slate-500">Welcome back, please enter your details</p>
    
                    <!-- Toggle (Visual) -->
                    <div class="mb-6 flex rounded-xl bg-slate-100 p-1">
                        <div class="w-1/2 rounded-lg bg-white py-2 text-center text-sm font-semibold text-slate-900 shadow-sm">
                            Sign In
                        </div>
                        <Link
                            :href="register()"
                            class="w-1/2 rounded-lg py-2 text-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
                        >
                            Signup
                        </Link>
                    </div>
    
                    <div v-if="status" class="mb-4 text-center text-sm font-medium text-green-600">
                        {{ status }}
                    </div>
    
                    <Form
                        v-bind="store.form()"
                        :reset-on-success="['password']"
                        v-slot="{ errors, processing }"
                        class="flex flex-col gap-4"
                    >
                        <!-- Login Field -->
                        <div>
                            <div class="relative flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2.5 transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 shadow-sm">
                                <User class="h-5 w-5 text-slate-400" />
                                <div class="flex flex-1 flex-col">
                                    <label for="email" class="text-[10px] font-medium text-slate-500">Email</label>
                                    <input
                                        id="email"
                                        type="text"
                                        name="email"
                                        required
                                        v-focus
                                        autocomplete="email"
                                        class="w-full border-none bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none focus:ring-0"
                                        placeholder="email@gmail.com"
                                        v-model="emailInput"
                                    />
                                </div>
                                <CheckCircle2 v-if="emailInput && !errors.email" class="h-5 w-5 text-green-500" />
                            </div>
                            <InputError :message="errors.email" class="mt-1 ml-2" />
                        </div>
    
                        <!-- Password Field -->
                        <div>
                            <div class="relative flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2.5 transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 shadow-sm">
                                <Lock class="h-5 w-5 text-slate-400" />
                                <div class="flex flex-1 flex-col">
                                    <div class="flex justify-between items-center">
                                        <label for="password" class="text-[10px] font-medium text-slate-500">Password</label>
                                        <Link v-if="canResetPassword" :href="request()" class="text-[10px] font-medium text-blue-600 hover:underline">Forgot?</Link>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        autocomplete="current-password"
                                        class="w-full border-none bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none focus:ring-0"
                                        placeholder="••••••••"
                                        v-model="passwordInput"
                                    />
                                </div>
                            </div>
                            <InputError :message="errors.password" class="mt-1 ml-2" />
                        </div>
    
                        <!-- Hidden Remember Checkbox -->
                        <input type="checkbox" name="remember" class="hidden" checked />
    
                        <!-- Submit Button -->
                        <button
                            type="submit"
                            :disabled="processing"
                            class="mt-2 flex w-full items-center justify-center rounded-2xl bg-[#0066FF] py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                        >
                            <Spinner v-if="processing" class="mr-2 h-5 w-5" />
                            Continue
                        </button>
                    </Form>
    
                    <!-- Divider -->
                    <div class="my-6 flex items-center">
                        <div class="flex-1 border-t border-slate-200"></div>
                        <span class="px-4 text-[11px] font-medium text-slate-400">Or Continue With</span>
                        <div class="flex-1 border-t border-slate-200"></div>
                    </div>
    
                    <!-- Social Buttons -->
                    <div class="flex justify-center gap-4">
                        <button type="button" class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50 shadow-sm cursor-pointer">
                            <svg class="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        </button>
                        <button type="button" class="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:bg-slate-800 shadow-sm cursor-pointer">
                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16.365 21.432c-1.493 1.258-2.793 1.238-4.041.056-1.155-.863-2.193-1.077-3.414-.047-1.168.805-2.529 1.488-3.957.17-1.455-1.343-3.235-4.482-3.877-7.468-.66-3.076.602-5.748 2.213-7.234 1.341-1.24 3.069-1.616 4.316-1.166 1.171.42 2.155 1.096 3.41 1.096 1.266 0 2.454-.663 3.869-1.135 1.614-.54 3.14-.146 4.316.892-2.316 1.365-2.822 4.417-1.025 6.26.85 1.037 2.083 1.62 3.197 1.815-.992 2.651-2.483 4.887-5.007 6.761zm-4.32-15.023c-.201-2.023.95-3.864 2.502-4.887 1.543 1.034 2.628 2.946 2.378 5.16-1.892.42-3.393-.836-4.88-2.73z"/>
                            </svg>
                        </button>
                        <button type="button" class="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white transition hover:bg-blue-600 shadow-sm cursor-pointer">
                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </button>
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
