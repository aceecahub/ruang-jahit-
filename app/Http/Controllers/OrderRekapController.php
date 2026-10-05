<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderRekapController extends Controller
{
    public function index(): Response
    {
        $rows = DB::connection('sqlsrv')
            ->table('dbo.v_q_order_rekap_det')
            ->limit(50)
            ->get();

        return Inertia::render('OrderRekap/Index', [
            'rows' => $rows,
        ]);
    }
}
