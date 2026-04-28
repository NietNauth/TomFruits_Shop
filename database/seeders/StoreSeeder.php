<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stores = [
            [
                'name' => 'Tôm Mart Ba Vì',
                'address' => '65 Tây Đằng, Ba Vì',
                'city' => 'Hà Nội',
                'district' => 'Ba Vì',
                'phone' => '0984068582',
                'opening_hours' => '6h30 - 19h30',
            ],
            [
                'name' => 'Tôm Fruits Giảng Võ',
                'address' => '7C11 ngõ 140 Giảng Võ',
                'city' => 'Hà Nội',
                'district' => 'Đống Đa',
                'phone' => '0386500397',
                'opening_hours' => '6h30 - 21h00',
            ],
            [
                'name' => 'Tôm Fruits Quận 1',
                'address' => '123 Lê Lợi, Phường Bến Thành',
                'city' => 'Hồ Chí Minh',
                'district' => 'Quận 1',
                'phone' => '0123456789',
                'opening_hours' => '7h00 - 22h00',
            ],
            [
                'name' => 'Tôm Fruits Quận 7',
                'address' => '456 Nguyễn Văn Linh',
                'city' => 'Hồ Chí Minh',
                'district' => 'Quận 7',
                'phone' => '0987654321',
                'opening_hours' => '8h00 - 21h00',
            ],
        ];

        foreach ($stores as $store) {
            \App\Models\Store::create($store);
        }
    }
}
