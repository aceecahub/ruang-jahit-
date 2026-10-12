<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Fortify::authenticateUsing(function (Request $request): ?User {
            $username = trim((string) $request->input('Username', ''));
            $password = (string) $request->input('password', '');

            if ($username === '' || $password === '') {
                return null;
            }

            // 1. Buat Kunci Unik (Kombinasi Username + IP)
            $throttleKey = 'login_penalty:' . Str::transliterate(Str::lower($username).'|'.$request->ip());

            // 2. CEK HUKUMAN: Apakah user sedang dalam masa penalti 60 detik?
            if (Cache::has($throttleKey.':blocked')) {
                // Hitung sisa detik dari waktu blokir dikurangi waktu sekarang
                $unblockTime = Cache::get($throttleKey.':blocked');
                $seconds = $unblockTime - now()->timestamp;

                if ($seconds > 0) {
                    throw ValidationException::withMessages([
                        'Username' => "Terlalu banyak percobaan. Silakan coba lagi dalam {$seconds} detik.",
                    ]);
                } else {
                    Cache::forget($throttleKey.':blocked'); // Hukuman selesai
                }
            }

            // 3. Cek Kredensial User
            $user = User::query()
                ->where('Username', $username)
                ->where('Delete', 0)
                ->first();

            $loginSuccess = $user !== null && hash_equals((string) $user->getAuthPassword(), $password);

            // 4. JIKA LOGIN BERHASIL
            if ($loginSuccess) {
                Cache::forget($throttleKey.':fails'); // Bersihkan riwayat kesalahan
                Cache::forget($throttleKey.':blocked');
                return $user;
            }

            // 5. JIKA LOGIN GAGAL: Tambah hitungan kesalahan
            $fails = Cache::get($throttleKey.':fails', 0) + 1;

            // Simpan riwayat kesalahan ini selama 10 menit
            Cache::put($throttleKey.':fails', $fails, now()->addMinutes(10));

            // 6. JIKA KESALAHAN MENCAPAI 5 KALI: Jatuhkan penalti 60 detik dari SEKARANG
            if ($fails >= 5) {
                // Simpan timestamp kapan blokir ini akan berakhir (Sekarang + 60 detik)
                Cache::put($throttleKey.':blocked', now()->addSeconds(60)->timestamp, now()->addSeconds(60));

                // Reset hitungan agar setelah 60 detik, dia punya jatah 5 kali lagi
                Cache::forget($throttleKey.':fails');

                throw ValidationException::withMessages([
                    'Username' => "Terlalu banyak percobaan. Silakan coba lagi dalam 60 detik.",
                ]);
            }

            return null; // Mengembalikan null akan memicu error bawaan "Kredensial tidak cocok"
        });

        Fortify::loginView(fn (Request $request) => Inertia::render('auth/Login', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/ForgotPassword', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/ResetPassword', [
            'email' => $request->input('email'),
            'token' => $request->route('token'),
        ]));

        RateLimiter::for('login', function (Request $request) {
            // Bypass/bebaskan limit bawaan agar tidak bentrok
            // Karena pembatasan sebenarnya sudah kita atur manual di authenticateUsing
            return Limit::none();
        });

        // RateLimiter::for('login', function (Request $request) {
        //     $key = Str::transliterate(
        //         Str::lower((string) $request->input(Fortify::username())).'|'.$request->ip()
        //     );

        //     return Limit::perMinute(5)->by($key);
        // });
    }
}
