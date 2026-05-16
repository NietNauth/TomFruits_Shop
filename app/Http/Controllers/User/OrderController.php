<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\OrderStoreRequest;
use App\Models\Order;
use App\Services\OrderService;
use App\Services\VNPayService;
use Exception;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;
    protected $vnpayService;

    public function __construct(OrderService $orderService, VNPayService $vnpayService)
    {
        $this->orderService = $orderService;
        $this->vnpayService = $vnpayService;
    }

    public function index(Request $request)
    {
        $userId = auth('api')->id();
        $orders = Order::with('items')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function show($id)
    {
        $userId = auth('api')->id();
        $order = Order::with(['items', 'coupon'])
            ->where('user_id', $userId)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    public function store(OrderStoreRequest $request)
    {
        $userId = auth('api')->id();
        
        try {
            $order = $this->orderService->createOrderFromCart(
                $userId,
                $request->coupon_code,
                $request->payment_method,
                $request->receiver_name,
                $request->receiver_phone,
                $request->shipping_address,
                $request->note
            );

            $responseData = [
                'success' => true,
                'message' => 'Tạo đơn hàng thành công',
                'data' => $order
            ];

            if ($request->payment_method === 'vnpay') {
                $responseData['payment_url'] = $this->vnpayService->createPaymentUrl($order);
            }

            return response()->json($responseData, 201);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function vnpayReturn(Request $request)
    {
        $isValid = $this->vnpayService->validateResponse($request->all());
        
        if (!$isValid) {
            return response()->json([
                'success' => false,
                'message' => 'Chữ ký không hợp lệ'
            ], 400);
        }

        $vnp_ResponseCode = $request->vnp_ResponseCode;
        $vnp_TxnRef = $request->vnp_TxnRef;
        $orderCode = explode('_', $vnp_TxnRef)[0];
        
        $order = Order::where('order_code', $orderCode)->firstOrFail();

        if ($vnp_ResponseCode == "00") {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'pending'
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Thanh toán thành công',
                'data' => $order
            ]);
        } else {
            $this->orderService->cancelOrder($order);
            return response()->json([
                'success' => false,
                'message' => 'Thanh toán thất bại',
                'data' => $order
            ]);
        }
    }

    public function vnpayIpn(Request $request)
    {
        // IPN logic (tương tự Return nhưng trả về định dạng VNPay mong muốn)
        $isValid = $this->vnpayService->validateResponse($request->all());
        if (!$isValid) {
            return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
        }

        $vnp_ResponseCode = $request->vnp_ResponseCode;
        $vnp_TxnRef = $request->vnp_TxnRef;
        $orderCode = explode('_', $vnp_TxnRef)[0];
        
        $order = Order::where('order_code', $orderCode)->first();
        if (!$order) {
            return response()->json(['RspCode' => '01', 'Message' => 'Order not found']);
        }

        if ($order->payment_status !== 'unpaid') {
            return response()->json(['RspCode' => '02', 'Message' => 'Order already confirmed']);
        }

        if ($vnp_ResponseCode == "00") {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'pending'
            ]);
        } else {
            $this->orderService->cancelOrder($order);
        }

        return response()->json(['RspCode' => '00', 'Message' => 'Confirm success']);
    }

    public function cancel($id)
    {
        $userId = auth('api')->id();
        $order = Order::where('user_id', $userId)->findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xác nhận.'
            ], 400);
        }

        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Không thể hủy đơn hàng đã thanh toán.'
            ], 400);
        }

        try {
            $this->orderService->cancelOrder($order);

            return response()->json([
                'success' => true,
                'message' => 'Hủy đơn hàng thành công',
                'data' => $order
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi hủy đơn hàng: ' . $e->getMessage()
            ], 400);
        }
    }
}