<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\StatisticsService;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    protected $statisticsService;

    public function __construct(StatisticsService $statisticsService)
    {
        $this->statisticsService = $statisticsService;
    }

    public function revenue(Request $request)
    {
        $type = $request->get('type', 'day');
        
        if (!in_array($type, ['week', 'month', 'year'])) {
            return response()->json([
                'success' => false,
                'message' => 'Loại thống kê không hợp lệ. Cho phép: week, month, year'
            ], 400);
        }

        $data = $this->statisticsService->getRevenue($type);

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function bestSelling()
    {
        $data = $this->statisticsService->getBestSellingProducts();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function overview()
    {
        $data = $this->statisticsService->getOverview();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
