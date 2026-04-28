<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('user')
            ->when($request->filled('status'), function ($q) use ($request) {
                return $q->where('status', $request->status);
            })
            ->when($request->filled('user_id'), function ($q) use ($request) {
                return $q->where('user_id', $request->user_id);
            })
            ->orderBy('id', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'items.product', 'coupon'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        $order = Order::findOrFail($id);

        if ($request->status === 'completed' && $order->payment_status !== 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng phải được thanh toán trước khi hoàn thành.'
            ], 422);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái đơn hàng thành công',
            'data' => $order
        ]);
    }

    public function updatePaymentStatus(\App\Http\Requests\Admin\UpdateOrderPaymentStatusRequest $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->payment_status = $request->payment_status;
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái thanh toán thành công',
            'data' => $order
        ]);
    }

    public function invoice($id)
    {
        $order = Order::with(['user', 'items', 'coupon'])->findOrFail($id);

        // Render full JSON for invoice template to print
        return response()->json([
            'success' => true,
            'data' => [
                'company_info' => [
                    'name' => 'Food E-commerce',
                    'address' => '123 ABC Street',
                    'phone' => '19001000'
                ],
                'order' => $order,
                'print_date' => now()
            ]
        ]);
    }
}
