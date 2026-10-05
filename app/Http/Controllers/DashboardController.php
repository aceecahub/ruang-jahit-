<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function orderDashboard(Request $request)
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

        $filter = $validated['filter'] ?? 'day';

        // Tentukan periode tanggal
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
                    $tanggalAwal = $now->copy()
                        ->startOfWeek()
                        ->toDateString();

                    $tanggalAkhir = $now->copy()
                        ->endOfWeek()
                        ->toDateString();
                    break;

                case 'year':
                    $tanggalAwal = $now->copy()
                        ->startOfYear()
                        ->toDateString();

                    $tanggalAkhir = $now->copy()
                        ->endOfYear()
                        ->toDateString();
                    break;

                case 'custom':
                    return back()->withErrors([
                        'tanggal_awal' =>
                            'Tanggal mulai dan akhir wajib diisi.',
                    ]);

                case 'month':
                    $tanggalAwal = $now->copy()
                        ->startOfMonth()
                        ->toDateString();

                    $tanggalAkhir = $now->copy()
                        ->endOfMonth()
                        ->toDateString();
                    break;

                default:
                    $tanggalAwal = $now->toDateString();
                    $tanggalAkhir = $tanggalAwal;
                    break;
            }
        }

        // QUERY CARD
        $result = DB::select(
            'EXEC dbo.sp_dash_order
                @tanggal_awal = ?,
                @tanggal_akhir = ?,
                @bagian = ?',
            [$tanggalAwal, $tanggalAkhir, 'card']
        );

        $kpi = $result[0] ?? null;

        $orderanMasuk = (int) ($kpi->total_order ?? 0);
        $totalKuantitas = (int) ($kpi->total_qty ?? 0);
        $totalHpp = (float) ($kpi->total_hpp ?? 0);
        $totalJual = (float) ($kpi->total_jual ?? 0);

        // QUERY DONUT
        $distribusiResult = DB::select(
            'EXEC dbo.sp_dash_order
                @tanggal_awal = ?,
                @tanggal_akhir = ?,
                @bagian = ?',
            [$tanggalAwal, $tanggalAkhir, 'distribusi']
        );

        $distribusi = collect($distribusiResult)
            ->map(fn ($item) => [
                'nm_model' => $item->nm_model,
                'total_qty' => (float) $item->total_qty,
                'persentase' => (float) $item->persentase,
            ])
            ->values();

        // QUERY TREND
        // Jika filter hari ini ('day'), ambil rentang minggu berjalan agar grafik tren tidak kosong / hanya 1 titik data
        $trendTanggalAwal = $tanggalAwal;
        $trendTanggalAkhir = $tanggalAkhir;
        if ($filter === 'day') {
            $parsedDay = Carbon::parse($tanggalAwal);
            $trendTanggalAwal = $parsedDay->copy()->startOfWeek()->toDateString();
            $trendTanggalAkhir = $parsedDay->copy()->endOfWeek()->toDateString();
        }

        $trendResult = DB::select(
            'EXEC dbo.sp_dash_order
                @tanggal_awal = ?,
                @tanggal_akhir = ?,
                @bagian = ?',
            [$trendTanggalAwal, $trendTanggalAkhir, 'trend']
        );

        $trendKuantitas = collect($trendResult)
            ->map(fn ($item) => [
                'tanggal' => $item->tanggal instanceof \DateTimeInterface
                    ? $item->tanggal->format('Y-m-d')
                    : substr((string) $item->tanggal, 0, 10),
                'total_qty' => (float) $item->total_qty,
            ])
            ->values();

        // LIST TABEL
        $cari = $request->input('cari');
        $status = $request->input('status');
        $jenisOrder = $request->input('jenis_order');
        $halaman = (int) $request->input('halaman', 1);
        $perHalaman = (int) $request->input('per_halaman', 10);
        $urutKolom = $request->input('urut_kolom', 'tgl_order');
        $urutArah = $request->input('urut_arah', 'DESC');

        $sql = '
            EXEC dbo.sp_dash_order
                @tanggal_awal = ?,
                @tanggal_akhir = ?,
                @bagian = ?,
                @cari = ?,
                @status = ?,
                @jenis_order = ?,
                @halaman = ?,
                @per_halaman = ?,
                @urut_kolom = ?,
                @urut_arah = ?
        ';

        $pdo = DB::connection()->getPdo();
        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            $tanggalAwal,
            $tanggalAkhir,
            'list',
            $cari,
            $status !== null && $status !== '' ? (int) $status : null,
            $jenisOrder !== null && $jenisOrder !== '' ? (int) $jenisOrder : null,
            $halaman,
            $perHalaman,
            $urutKolom,
            $urutArah,
        ]);

        // RESULT SET 1: pagination
        $pagination = $stmt->fetch(\PDO::FETCH_ASSOC);

        // RESULT SET 2: data order
        $stmt->nextRowset();
        $orderList = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        // DETAIL MODEL UNTUK ORDER YANG SEDANG TAMPIL DI HALAMAN AKTIF
        // v_dash_order_distribusi menyediakan id_order, nm_model, dan qty.
        // Data ini dipakai drawer detail agar setiap order bisa menampilkan
        // rincian model seperti line item pada faktur.
        $orderIds = collect($orderList)
            ->pluck('id_order')
            ->filter(fn ($id) => $id !== null && $id !== '')
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        $ordersById = collect($orderList)->keyBy(fn ($o) => (int) $o['id_order']);

        $orderDetailModels = collect();

        if ($orderIds->isNotEmpty()) {
            $placeholders = implode(',', array_fill(0, $orderIds->count(), '?'));

            $detailRows = DB::select(
                "SELECT
                    id_order,
                    nm_model,
                    SUM(qty) AS qty,
                    SUM(qty * hpp) AS hpp,
                    SUM(qty * hrg_jual) AS harga_jual
                FROM dbo.v_dash_order_distribusi
                WHERE id_order IN ($placeholders)
                GROUP BY id_order, nm_model
                ORDER BY id_order, nm_model",
                $orderIds->all()
            );

            $orderDetailModels = collect($detailRows)
                ->map(function ($item) use ($ordersById) {
                    $idOrder = (int) $item->id_order;
                    $matchedOrder = $ordersById->get($idOrder);
                    $orderTotalQty = (float) ($matchedOrder['total_qty'] ?? 0);
                    $orderTotalHpp = (float) ($matchedOrder['total_hpp'] ?? 0);
                    $orderTotalJual = (float) ($matchedOrder['total_jual'] ?? 0);

                    $qty = (float) $item->qty;

                    // Ambil hasil perkalian langsung dari SUM(qty * hpp) dan SUM(qty * hrg_jual)
                    $hpp = isset($item->hpp) && $item->hpp !== null && (float) $item->hpp > 0
                        ? (float) $item->hpp
                        : ($orderTotalQty > 0 ? round(($qty / $orderTotalQty) * $orderTotalHpp, 2) : 0);

                    $hargaJual = isset($item->harga_jual) && $item->harga_jual !== null && (float) $item->harga_jual > 0
                        ? (float) $item->harga_jual
                        : ($orderTotalQty > 0 ? round(($qty / $orderTotalQty) * $orderTotalJual, 2) : 0);

                    return [
                        'id_order' => $idOrder,
                        'nm_model' => $item->nm_model ?: 'Tanpa Nama Model',
                        'qty' => $qty,
                        'hpp' => $hpp,
                        'harga_jual' => $hargaJual,
                    ];
                })
                ->values();
        }

        return Inertia::render('Dashboard', [
            'orderanMasuk' => $orderanMasuk,
            'totalKuantitas' => $totalKuantitas,
            'totalHpp' => $totalHpp,
            'totalJual' => $totalJual,
            'distribusiModel' => $distribusi,
            'trendKuantitas' => $trendKuantitas,
            'orderList' => $orderList,
            'orderDetailModels' => $orderDetailModels,
            'orderPagination' => $pagination,
            'filter' => $filter,
            'tanggalAwal' => $tanggalAwal,
            'tanggalAkhir' => $tanggalAkhir,
        ]);
    }
}
