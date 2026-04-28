<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Coupon;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class RealisticFoodSeeder extends Seeder
{
    public function run(): void
    {
        // Clear old data
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Order::truncate();
        OrderItem::truncate();
        Product::truncate();
        Category::truncate();
        Coupon::truncate();
        User::truncate();
        Employee::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Create Categories
        $categories = [
            [
                'title' => 'Trái Cây Nhập Khẩu',
                'img' => 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800',
                'is_active' => true
            ],
            [
                'title' => 'Trái Cây Nội Địa',
                'img' => 'https://images.unsplash.com/photo-1596040033229-a9821ebd05de?auto=format&fit=crop&q=80&w=800',
                'is_active' => true
            ],
            [
                'title' => 'Rau Củ Sạch',
                'img' => 'https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?auto=format&fit=crop&q=80&w=800',
                'is_active' => true
            ],
            [
                'title' => 'Thực Phẩm Khô',
                'img' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
                'is_active' => true
            ],
            [
                'title' => 'Giỏ Quà Cao Cấp',
                'img' => 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&q=80&w=800',
                'is_active' => true
            ],
        ];

        $cats = [];
        foreach ($categories as $cat) {
            $cats[] = Category::create($cat);
        }

        // 2. Create Products (25 items)
        $products = [
            // Cat 0: Trái Cây Nhập Khẩu
            [
                'category_id' => $cats[0]->id,
                'name' => 'Táo Envy Mỹ Size 70-80',
                'price' => 195000,
                'old_price' => 220000,
                'discount' => 11,
                'tag' => 'hot',
                'img' => 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800',
                'unit' => 'kg',
                'weight' => '1',
                'quantity' => 50,
                'is_featured' => true,
                'description' => 'Táo Envy Mỹ nổi tiếng với độ giòn cao, vị ngọt đậm đà và hương thơm đặc trưng. Vỏ táo có màu đỏ thẫm xen lẫn các sọc vàng nhỏ li ti.',
                'nutritional_info' => 'Giàu Vitamin C, chất xơ và chất chống oxy hóa giúp tăng cường hệ miễn dịch.',
            ],
            [
                'category_id' => $cats[0]->id,
                'name' => 'Nho Mẫu Đơn Nhật Bản',
                'price' => 850000,
                'old_price' => 950000,
                'discount' => 10,
                'tag' => 'new',
                'img' => 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=800',
                'unit' => 'chùm',
                'weight' => '0.5-0.7',
                'quantity' => 20,
                'is_featured' => true,
                'description' => 'Nho mẫu đơn (Shine Muscat) có trái to, màu xanh mướt, vị ngọt thanh và hương thơm như hoa cỏ.',
                'nutritional_info' => 'Chứa nhiều vitamin B6, C, K và các khoáng chất có lợi cho tim mạch.',
            ],
            [
                'category_id' => $cats[0]->id,
                'name' => 'Cam Vàng Úc Navel',
                'price' => 85000,
                'old_price' => 95000,
                'discount' => 10,
                'tag' => 'sale',
                'img' => 'https://images.unsplash.com/photo-1582910830449-76579fc2c6a0?auto=format&fit=crop&q=80&w=800',
                'unit' => 'kg',
                'weight' => '1',
                'quantity' => 100,
                'is_featured' => false,
                'description' => 'Cam Navel Úc không hạt, mọng nước, vị ngọt đậm và rất dễ bóc vỏ.',
                'nutritional_info' => 'Nguồn cung cấp Vitamin C dồi dào, giúp đẹp da và tăng sức đề kháng.',
            ],
            [
                'category_id' => $cats[0]->id,
                'name' => 'Lê Hàn Quốc Premium',
                'price' => 125000,
                'old_price' => 150000,
                'discount' => 16,
                'tag' => 'hot',
                'img' => 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&q=80&w=800',
                'unit' => 'kg',
                'weight' => '1',
                'quantity' => 45,
                'is_featured' => false,
            ],
            [
                'category_id' => $cats[0]->id,
                'name' => 'Kiwi Vàng New Zealand',
                'price' => 180000,
                'old_price' => 210000,
                'discount' => 14,
                'tag' => 'new',
                'img' => 'https://images.unsplash.com/photo-1585059895312-708b21c9906b?auto=format&fit=crop&q=80&w=800',
                'unit' => 'kg',
                'weight' => '1',
                'quantity' => 30,
                'is_featured' => false,
            ],

            // Cat 1: Trái Cây Nội Địa
            [
                'category_id' => $cats[1]->id,
                'name' => 'Xoài Cát Hòa Lộc (Loại 1)',
                'price' => 145000,
                'old_price' => 160000,
                'discount' => 9,
                'tag' => 'hot',
                'img' => 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
                'unit' => 'kg',
                'weight' => '1',
                'quantity' => 60,
                'is_featured' => true,
                'description' => 'Xoài cát Hòa Lộc nổi tiếng với thịt quả dày, ít xơ, vị ngọt lịm và hương thơm nồng nàn.',
            ],
            [
                'category_id' => $cats[1]->id,
                'name' => 'Bưởi Da Xanh Bến Tre',
                'price' => 65000,
                'old_price' => 75000,
                'discount' => 13,
                'tag' => 'sale',
                'img' => 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=800',
                'unit' => 'quả',
                'weight' => '1.2-1.5',
                'quantity' => 80,
                'is_featured' => true,
                'description' => 'Bưởi da xanh vỏ mỏng, tép bưởi hồng, mọng nước, vị ngọt thanh không đắng.',
            ],
            [
                'category_id' => $cats[1]->id,
                'name' => 'Vú Sữa Lò Rèn',
                'price' => 55000,
                'old_price' => 65000,
                'discount' => 15,
                'tag' => 'new',
                'img' => 'https://images.unsplash.com/photo-1621213032506-69666bc0f507?auto=format&fit=crop&q=80&w=800',
                'unit' => 'kg',
                'weight' => '1',
                'quantity' => 40,
                'is_featured' => false,
            ],
            [
                'category_id' => $cats[1]->id,
                'name' => 'Thanh Long Ruột Đỏ',
                'price' => 45000,
                'old_price' => 55000,
                'discount' => 18,
                'tag' => 'sale',
                'img' => 'https://images.unsplash.com/photo-1527325672343-6961aa313496?auto=format&fit=crop&q=80&w=800',
                'unit' => 'kg',
                'weight' => '1',
                'quantity' => 120,
                'is_featured' => false,
            ],
            [
                'category_id' => $cats[1]->id,
                'name' => 'Măng Cụt Lái Thiêu',
                'price' => 95000,
                'old_price' => 110000,
                'discount' => 13,
                'tag' => 'hot',
                'img' => 'https://images.unsplash.com/photo-1621532450242-70b79313271a?auto=format&fit=crop&q=80&w=800',
                'unit' => 'kg',
                'weight' => '1',
                'quantity' => 35,
                'is_featured' => false,
            ],

            // Cat 2: Rau Củ Sạch
            [
                'category_id' => $cats[2]->id,
                'name' => 'Cải Bó Xôi Đà Lạt',
                'price' => 35000,
                'old_price' => 45000,
                'discount' => 22,
                'tag' => 'hot',
                'img' => 'https://images.unsplash.com/photo-1576045057995-568f588f829a?auto=format&fit=crop&q=80&w=800',
                'unit' => 'túi',
                'weight' => '0.5',
                'quantity' => 100,
                'is_featured' => false,
                'description' => 'Cải bó xôi sạch trồng theo tiêu chuẩn VietGAP tại Đà Lạt, tươi non mỗi ngày.',
            ],
            [
                'category_id' => $cats[2]->id,
                'name' => 'Cà Chua Socola Đà Lạt',
                'price' => 55000,
                'old_price' => 65000,
                'discount' => 15,
                'tag' => 'new',
                'img' => 'https://images.unsplash.com/photo-1518977676601-b53f02bad67b?auto=format&fit=crop&q=80&w=800',
                'unit' => 'kg',
                'weight' => '1',
                'quantity' => 80,
                'is_featured' => false,
                'description' => 'Cà chua Socola có vị ngọt đậm, chứa hàm lượng dinh dưỡng cao hơn cà chua thường.',
            ],
            [
                'category_id' => $cats[2]->id,
                'name' => 'Súp Lơ Xanh (Broccoli)',
                'price' => 48000,
                'old_price' => 58000,
                'discount' => 17,
                'tag' => 'sale',
                'img' => 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&q=80&w=800',
                'unit' => 'cây',
                'weight' => '0.4-0.6',
                'quantity' => 50,
                'is_featured' => false,
            ],
            [
                'category_id' => $cats[2]->id,
                'name' => 'Ớt Chuông Đà Lạt Mix',
                'price' => 75000,
                'old_price' => 90000,
                'discount' => 16,
                'tag' => 'hot',
                'img' => 'https://images.unsplash.com/photo-1563513330617-3fef099f3d19?auto=format&fit=crop&q=80&w=800',
                'unit' => 'kg',
                'weight' => '1',
                'quantity' => 40,
                'is_featured' => false,
            ],
            [
                'category_id' => $cats[2]->id,
                'name' => 'Măng Tây Xinh',
                'price' => 120000,
                'old_price' => 140000,
                'discount' => 14,
                'tag' => 'new',
                'img' => 'https://images.unsplash.com/photo-1515471209610-dae1c9a58145?auto=format&fit=crop&q=80&w=800',
                'unit' => 'túi',
                'weight' => '0.3',
                'quantity' => 25,
                'is_featured' => false,
            ],

            // Cat 3: Thực Phẩm Khô
            [
                'category_id' => $cats[3]->id,
                'name' => 'Hạnh Nhân Rang Bơ',
                'price' => 185000,
                'old_price' => 210000,
                'discount' => 12,
                'tag' => 'hot',
                'img' => 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=800',
                'unit' => 'hũ',
                'weight' => '0.5',
                'quantity' => 100,
                'is_featured' => false,
                'description' => 'Hạnh nhân nhập khẩu Mỹ rang bơ thơm giòn, giàu dưỡng chất.',
            ],
            [
                'category_id' => $cats[3]->id,
                'name' => 'Hạt Dẻ Cười Mỹ',
                'price' => 220000,
                'old_price' => 250000,
                'discount' => 12,
                'tag' => 'new',
                'img' => 'https://images.unsplash.com/photo-1522253018251-5b7410292723?auto=format&fit=crop&q=80&w=800',
                'unit' => 'hũ',
                'weight' => '0.5',
                'quantity' => 30,
                'is_featured' => false,
            ],
            [
                'category_id' => $cats[3]->id,
                'name' => 'Trái Cây Sấy Dẻo Mix',
                'price' => 145000,
                'old_price' => 165000,
                'discount' => 12,
                'tag' => 'sale',
                'img' => 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=800',
                'unit' => 'hũ',
                'weight' => '0.4',
                'quantity' => 50,
                'is_featured' => false,
            ],
            [
                'category_id' => $cats[3]->id,
                'name' => 'Nho Khô Sultanas',
                'price' => 110000,
                'old_price' => 130000,
                'discount' => 15,
                'tag' => 'hot',
                'img' => 'https://images.unsplash.com/photo-1620706857370-e1b976fd082e?auto=format&fit=crop&q=80&w=800',
                'unit' => 'túi',
                'weight' => '0.5',
                'quantity' => 60,
                'is_featured' => false,
            ],
            [
                'category_id' => $cats[3]->id,
                'name' => 'Hạt Điều Rang Muối',
                'price' => 165000,
                'old_price' => 185000,
                'discount' => 10,
                'tag' => 'new',
                'img' => 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=800',
                'unit' => 'hũ',
                'weight' => '0.5',
                'quantity' => 45,
                'is_featured' => false,
            ],

            // Cat 4: Giỏ Quà
            [
                'category_id' => $cats[4]->id,
                'name' => 'Giỏ Quà Trái Cây Phú Quý',
                'price' => 1200000,
                'old_price' => 1350000,
                'discount' => 11,
                'tag' => 'hot',
                'img' => 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&q=80&w=800',
                'unit' => 'giỏ',
                'weight' => '5-6',
                'quantity' => 10,
                'is_featured' => true,
                'description' => 'Giỏ quà bao gồm Táo Envy, Nho Mẫu Đơn, Cam Úc và Lê Hàn Quốc. Thiết kế sang trọng cho dịp lễ tết.',
            ],
            [
                'category_id' => $cats[4]->id,
                'name' => 'Giỏ Quà Sức Khỏe',
                'price' => 850000,
                'old_price' => 950000,
                'discount' => 10,
                'tag' => 'new',
                'img' => 'https://images.unsplash.com/photo-1520281600329-873528b74737?auto=format&fit=crop&q=80&w=800',
                'unit' => 'giỏ',
                'weight' => '4',
                'quantity' => 15,
                'is_featured' => true,
            ],
            [
                'category_id' => $cats[4]->id,
                'name' => 'Hộp Quà Trái Cây Mix',
                'price' => 450000,
                'old_price' => 550000,
                'discount' => 18,
                'tag' => 'sale',
                'img' => 'https://images.unsplash.com/photo-1619561131105-095537eb0a75?auto=format&fit=crop&q=80&w=800',
                'unit' => 'hộp',
                'weight' => '2.5',
                'quantity' => 20,
                'is_featured' => false,
            ],
            [
                'category_id' => $cats[4]->id,
                'name' => 'Giỏ Quà Tịnh Tâm',
                'price' => 650000,
                'old_price' => 750000,
                'discount' => 13,
                'tag' => 'hot',
                'img' => 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800',
                'unit' => 'giỏ',
                'weight' => '3.5',
                'quantity' => 10,
                'is_featured' => false,
            ],
            [
                'category_id' => $cats[4]->id,
                'name' => 'Giỏ Quà Tết Đoàn Viên',
                'price' => 1500000,
                'old_price' => 1800000,
                'discount' => 16,
                'tag' => 'new',
                'img' => 'https://images.unsplash.com/photo-1511208687438-2c5a5abb810c?auto=format&fit=crop&q=80&w=800',
                'unit' => 'giỏ',
                'weight' => '7',
                'quantity' => 5,
                'is_featured' => true,
            ],
        ];

        $prods = [];
        foreach ($products as $prod) {
            $prods[] = Product::create($prod);
        }

        // 3. Create Users & Employees
        $dummyUser = User::create([
            'name' => 'Nguyễn Văn Khách',
            'email' => 'customer@gmail.com',
            'phone' => '0988888888',
            'password' => Hash::make('123456'),
            'avatar' => 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
            'is_active' => true
        ]);

        Employee::create([
            'name' => 'Admin Tom Fruits',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123456'),
            'role' => 'admin',
            'phone' => '0123456789',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
            'is_active' => true
        ]);

        Employee::create([
            'name' => 'Trần Thị Nhân Viên',
            'email' => 'staff@gmail.com',
            'password' => Hash::make('123456'),
            'role' => 'staff',
            'phone' => '0912345678',
            'avatar' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
            'is_active' => true
        ]);

        // 4. Coupons
        $cp1 = Coupon::create([
            'code' => 'WELCOME50',
            'discount_value' => 50000,
            'discount_type' => 'fixed',
            'min_order_value' => 200000,
            'usage_limit' => 100,
            'used_count' => 5,
            'start_date' => now(),
            'end_date' => now()->addMonths(3),
            'is_active' => true
        ]);

        Coupon::create([
            'code' => 'FREESHIP',
            'discount_value' => 30000,
            'discount_type' => 'fixed',
            'min_order_value' => 500000,
            'usage_limit' => 500,
            'start_date' => now(),
            'end_date' => now()->addYear(),
            'is_active' => true
        ]);

        // 5. Sample Orders
        $order = Order::create([
            'user_id' => $dummyUser->id,
            'order_code' => 'ORD-' . strtoupper(bin2hex(random_bytes(3))),
            'total_price' => 340000,
            'final_price' => 290000,
            'discount_amount' => 50000,
            'coupon_id' => $cp1->id,
            'shipping_fee' => 0,
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'status' => 'pending',
            'receiver_name' => $dummyUser->name,
            'receiver_phone' => $dummyUser->phone,
            'shipping_address' => '123 Đường Lê Lợi, Quận 1, TP.HCM',
            'note' => 'Giao hàng giờ hành chính giúp mình.',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $prods[0]->id,
            'product_name' => $prods[0]->name,
            'price' => $prods[0]->price,
            'quantity' => 1,
            'product_img' => $prods[0]->img,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $prods[5]->id,
            'product_name' => $prods[5]->name,
            'price' => $prods[5]->price,
            'quantity' => 1,
            'product_img' => $prods[5]->img,
        ]);
        
        $order2 = Order::create([
            'user_id' => $dummyUser->id,
            'order_code' => 'ORD-' . strtoupper(bin2hex(random_bytes(3))),
            'total_price' => 850000,
            'final_price' => 850000,
            'discount_amount' => 0,
            'shipping_fee' => 0,
            'payment_method' => 'vnpay',
            'payment_status' => 'paid',
            'status' => 'completed',
            'receiver_name' => $dummyUser->name,
            'receiver_phone' => $dummyUser->phone,
            'shipping_address' => '456 Nguyễn Huệ, Quận 1, TP.HCM',
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => $prods[1]->id,
            'product_name' => $prods[1]->name,
            'price' => $prods[1]->price,
            'quantity' => 1,
            'product_img' => $prods[1]->img,
        ]);
    }
}
