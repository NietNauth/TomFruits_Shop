<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatisticsService
{
    public function getRevenue($type = 'week')
    {
        $result = [];
        
        if ($type === 'week') {
            $startDate = Carbon::now()->subWeeks(3)->startOfWeek();
            
            $revenues = Order::where('status', 'completed')
                ->where('created_at', '>=', $startDate)
                ->select('*') // Get all to group by date
                ->get()
                ->groupBy(function($order) {
                    $start = Carbon::parse($order->created_at)->startOfWeek();
                    $end = Carbon::parse($order->created_at)->endOfWeek();
                    return $start->format('d/m') . ' - ' . $end->format('d/m');
                })
                ->map(function($group, $key) {
                    return [
                        'label' => $key,
                        'value' => (float) $group->sum('final_price')
                    ];
                })->values()->toArray();

            // Nếu không đủ 4 tuần, có thể bổ sung label rỗng hoặc fill default (nhưng thường nhóm theo ngày sẽ tự sắp xếp)
            // Fix chuẩn: Vẫn tạo danh sách 4 tuần để luôn trả về đúng thứ tự 4 mốc (kể cả 0)
            for ($i = 3; $i >= 0; $i--) {
                $st = Carbon::now()->subWeeks($i)->startOfWeek();
                $en = Carbon::now()->subWeeks($i)->endOfWeek();
                $label = $st->format('d/m') . ' - ' . $en->format('d/m');
                
                $found = array_filter($revenues, function($item) use ($label) { return $item['label'] === $label; });
                $result[] = $found ? reset($found) : ['label' => $label, 'value' => 0];
            }

        } elseif ($type === 'month') {
            $startDate = Carbon::now()->subMonths(5)->startOfMonth();
            
            $revenues = Order::where('status', 'completed')
                ->where('created_at', '>=', $startDate)
                ->select(DB::raw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(final_price) as total'))
                ->groupBy('year', 'month')
                ->get();
                
            for ($i = 5; $i >= 0; $i--) {
                $month = Carbon::now()->subMonths($i);
                $found = $revenues->first(function($item) use ($month) {
                    return $item->year == $month->year && $item->month == $month->month;
                });
                
                $result[] = [
                    'label' => 'Tháng ' . $month->format('m/Y'),
                    'value' => (float) ($found ? $found->total : 0)
                ];
            }
        } elseif ($type === 'year') {
            $currentYear = Carbon::now()->year;
            $startDate = Carbon::now()->subYears(4)->startOfYear();
            
            $revenues = Order::where('status', 'completed')
                ->where('created_at', '>=', $startDate)
                ->select(DB::raw('YEAR(created_at) as year, SUM(final_price) as total'))
                ->groupBy('year')
                ->get();

            for ($i = 4; $i >= 0; $i--) {
                $year = $currentYear - $i;
                $found = $revenues->firstWhere('year', $year);
                
                $result[] = [
                    'label' => 'Năm ' . $year,
                    'value' => (float) ($found ? $found->total : 0)
                ];
            }
        }

        return $result;
    }

    public function getBestSellingProducts()
    {
        return DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select(
                'products.id', 
                'products.name', 
                'categories.title as category_name',
                DB::raw('SUM(order_items.quantity) as sold_quantity'),
                DB::raw('SUM(order_items.price * order_items.quantity) as total_revenue')
            )
            ->where('orders.status', 'completed')
            ->groupBy('products.id', 'products.name', 'categories.title')
            ->orderBy('sold_quantity', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'category' => ['name' => $item->category_name],
                    'sold_quantity' => (int) $item->sold_quantity,
                    'total_revenue' => (float) $item->total_revenue,
                ];
            });
    }

    public function getOverview()
    {
        $today = Carbon::today();

        $totalOrdersToday = Order::whereDate('created_at', $today)->count();
        $revenueToday = Order::where('status', 'completed')
            ->whereDate('created_at', $today)
            ->sum('final_price');
        $totalCustomers = User::count();
        $totalProducts = Product::count();

        // Tối ưu gộp 1 Query lấy doanh thu 7 ngày gần nhất thay vì 7 Query loop
        $startDate = Carbon::today()->subDays(6);
        $ordersLast7Days = Order::where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(final_price) as total'))
            ->groupBy('date')
            ->get();

        $revenue7Days = [];
        for ($i = 6; $i >= 0; $i--) {
             $date = Carbon::today()->subDays($i);
             $dateStr = $date->format('Y-m-d');
             $found = $ordersLast7Days->firstWhere('date', $dateStr);
             
             $revenue7Days[] = [
                 'date' => $date->format('d/m'),
                 'revenue' => (float) ($found ? $found->total : 0)
             ];
        }

        // Top 5 sản phẩm (có thể lấy all time hoặc 7 ngày)
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->select('order_items.product_id as id', 'order_items.product_name as name', DB::raw('SUM(order_items.quantity) as sold'), DB::raw('SUM(order_items.price * order_items.quantity) as revenue'))
            ->where('orders.status', 'completed')
            ->groupBy('order_items.product_id', 'order_items.product_name')
            ->orderBy('sold', 'desc')
            ->limit(5)
            ->get();

        return [
            'totalOrdersToday' => $totalOrdersToday,
            'revenueToday' => (float) $revenueToday,
            'totalCustomers' => $totalCustomers,
            'totalProducts' => $totalProducts,
            'revenue7Days' => $revenue7Days,
            'topProducts' => $topProducts,
        ];
    }
}
