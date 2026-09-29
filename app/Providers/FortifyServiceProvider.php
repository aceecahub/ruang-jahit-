<?php

namespace App\Providers;

use App\Models\User;
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

            $user = User::query()
                ->where('Username', $username)
                ->where('Delete', 0)
                ->first();

            if ($user === null) {
                return null;
            }

            return hash_equals(
                (string) $user->getAuthPassword(),
                $password
            ) ? $user : null;
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
            $key = Str::transliterate(
                Str::lower((string) $request->input(Fortify::username())).'|'.$request->ip()
            );

            return Limit::perMinute(5)->by($key);
        });
    }
}
