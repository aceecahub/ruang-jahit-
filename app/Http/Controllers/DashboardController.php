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
        'tanggal_awal' => ['nullable', 'date'],
        'tanggal_akhir' => [
            'nullable',
            'date',
            'after_or_equal:tanggal_awal',
        ],
    ]);

    $filter = $validated['filter'] ?? 'month';

    // Jika tanggal dikirim dari Vue, gunakan tanggal tersebut.
    if (
        !empty($validated['tanggal_awal']) &&
        !empty($validated['tanggal_akhir'])
    ) {
        $tanggalAwal = $validated['tanggal_awal'];
        $tanggalAkhir = $validated['tanggal_akhir'];
    } else {
        $now = Carbon::now();

        switch ($filter) {
            case 'day':
                $tanggalAwal = $now->toDateString();
                $tanggalAkhir = $tanggalAwal;
                break;

            case 'week':
                $tanggalAwal = $now->copy()
                    ->startOfWeek()->toDateString();
                $tanggalAkhir = $now->copy()
                    ->endOfWeek()->toDateString();
                break;

            case 'year':
                $tanggalAwal = $now->copy()
                    ->startOfYear()->toDateString();
                $tanggalAkhir = $now->copy()
                    ->endOfYear()->toDateString();
                break;

            case 'custom':
                return back()->withErrors([
                    'tanggal_awal' =>
                        'Tanggal mulai dan akhir wajib diisi.',
                ]);

            default:
                $tanggalAwal = $now->copy()
                    ->startOfMonth()->toDateString();
                $tanggalAkhir = $now->copy()
                    ->endOfMonth()->toDateString();
                break;
        }
    }

    $result = DB::select(
        'EXEC dbo.sp_dash_order
            @tanggal_awal = ?,
            @tanggal_akhir = ?',
        [$tanggalAwal, $tanggalAkhir]
    );

    // Ambil hasil COUNT dari Stored Procedure.
    $orderanMasuk = (int) ($result[0]->total_order ?? 0);
    $totalKuantitas = (int) ($result[0]->total_qty ?? 0);
    $totalHpp       = (float) ($result[0]->total_hpp ?? 0);
    $totalJual      = (float) ($result[0]->total_jual ?? 0);

    return Inertia::render('Dashboard', [
        'orderanMasuk' => $orderanMasuk,
        'totalKuantitas' => $totalKuantitas,
        'totalHpp' => $totalHpp,
        'totalJual' => $totalJual,
        'filter' => $filter,
        'tanggalAwal' => $tanggalAwal,
        'tanggalAkhir' => $tanggalAkhir,
    ]);
}
}