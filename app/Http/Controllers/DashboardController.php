<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function cardUp(Request $request)
    {
        $validated = $request->validate([
            'filter' => [
                'nullable',
                'in:day,week,month,year,custom',
            ],
            'tanggal_awal' => [
                'nullable',
                'date',
            ],
            'tanggal_akhir' => [
                'nullable',
                'date',
                'after_or_equal:tanggal_awal',
            ],
        ]);

        $filter = $validated['filter'] ?? 'month';

        /*
        |--------------------------------------------------------------------------
        | Tentukan periode tanggal
        |--------------------------------------------------------------------------
        */

        if (
            !empty($validated['tanggal_awal']) &&
            !empty($validated['tanggal_akhir'])
        ) {
            $tanggalAwal = Carbon::parse(
                $validated['tanggal_awal']
            )->toDateString();

            $tanggalAkhir = Carbon::parse(
                $validated['tanggal_akhir']
            )->toDateString();
        } else {
            $now = Carbon::now();

            switch ($filter) {
                case 'day':
                    $tanggalAwal = $now->toDateString();
                    $tanggalAkhir = $tanggalAwal;
                    break;

                case 'week':
                    $tanggalAwal = $now
                        ->copy()
                        ->startOfWeek()
                        ->toDateString();

                    $tanggalAkhir = $now
                        ->copy()
                        ->endOfWeek()
                        ->toDateString();
                    break;

                case 'year':
                    $tanggalAwal = $now
                        ->copy()
                        ->startOfYear()
                        ->toDateString();

                    $tanggalAkhir = $now
                        ->copy()
                        ->endOfYear()
                        ->toDateString();
                    break;

                case 'custom':
                    return back()->withErrors([
                        'tanggal_awal' =>
                            'Tanggal mulai dan akhir wajib diisi.',
                    ]);

                case 'month':
                default:
                    $tanggalAwal = $now
                        ->copy()
                        ->startOfMonth()
                        ->toDateString();

                    $tanggalAkhir = $now
                        ->copy()
                        ->endOfMonth()
                        ->toDateString();
                    break;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | KPI CARD
        |--------------------------------------------------------------------------
        */

        $result = DB::select(
            '
            EXEC dbo.sp_dash_order
                @tanggal_awal = ?,
                @tanggal_akhir = ?,
                @bagian = ?
            ',
            [
                $tanggalAwal,
                $tanggalAkhir,
                'card',
            ]
        );

        $kpi = $result[0] ?? null;

        $orderanMasuk = (int) ($kpi->total_order ?? 0);

        $totalKuantitas = (int) ($kpi->total_qty ?? 0);

        $totalHpp = (float) ($kpi->total_hpp ?? 0);

        $totalJual = (float) ($kpi->total_jual ?? 0);

        /*
        |--------------------------------------------------------------------------
        | DISTRIBUSI MODEL UNTUK DONUT CHART
        |--------------------------------------------------------------------------
        */

        $distribusiResult = DB::select(
            '
            EXEC dbo.sp_dash_order
                @tanggal_awal = ?,
                @tanggal_akhir = ?,
                @bagian = ?
            ',
            [
                $tanggalAwal,
                $tanggalAkhir,
                'distribusi',
            ]
        );

        

        $distribusi = collect($distribusiResult)
            ->map(function ($item) {
                return [
                    'nm_model' => $item->nm_model,
                    'total_qty' => (float) $item->total_qty,
                    'persentase' => (float) $item->persentase,
                ];
            })
            ->values();


            $trendResult = DB::select(
                    '
                    EXEC dbo.sp_dash_order
                        @tanggal_awal = ?,
                        @tanggal_akhir = ?,
                        @bagian = ?
                    ',
                    [$tanggalAwal, $tanggalAkhir, 'trend']
                );

                $trendKuantitas = collect($trendResult)
                    ->map(fn ($item) => [
                        'tanggal' => $item->tanggal instanceof \DateTimeInterface
                            ? $item->tanggal->format('Y-m-d')
                            : substr((string) $item->tanggal, 0, 10),
                        'total_qty' => (float) $item->total_qty,
                    ])
                    ->values();

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Dashboard', [
            'orderanMasuk' => $orderanMasuk,
            'totalKuantitas' => $totalKuantitas,
            'totalHpp' => $totalHpp,
            'totalJual' => $totalJual,

            'distribusiModel' => $distribusi,

            'trendKuantitas' => $trendKuantitas,

            'filter' => $filter,
            'tanggalAwal' => $tanggalAwal,
            'tanggalAkhir' => $tanggalAkhir,
        ]);
    }
}