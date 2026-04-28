<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Schema;

class TesterSeeder extends Seeder
{
    public function run(): void
    {

        Schema::disableForeignKeyConstraints();
        DB::table('employees')->truncate();
        DB::table('users')->truncate();
        DB::table('categories')->truncate();
        DB::table('products')->truncate();
        DB::table('orders')->truncate();
        DB::table('cart')->truncate();
        Schema::enableForeignKeyConstraints();
        
        $password = Hash::make('123456');

        // Seed Employees
        Employee::create([
            'name' => 'Admin Tom Fruits',
            'email' => 'admin@tomfruits.vn',
            'password' => $password,
            'role' => 'admin',
            'is_active' => true
        ]);
        
        Employee::create([
            'name' => 'Manager Tom Fruits',
            'email' => 'manager@tomfruits.vn',
            'password' => $password,
            'role' => 'manager',
            'is_active' => true
        ]);
        
        Employee::create([
            'name' => 'Staff Tom Fruits',
            'email' => 'staff@tomfruits.vn',
            'password' => $password,
            'role' => 'staff',
            'is_active' => true
        ]);

        // Seed User
        User::create([
            'name' => 'Customer Tom Fruits',
            'email' => 'customer@tomfruits.vn',
            'password' => $password,
            'phone' => '0987654321',
            'is_active' => true
        ]);

        // Seed basic Category
        $cat = Category::create([
            'title' => 'Rau củ quả',
            'is_active' => true
        ]);

        // Seed basic Product (ID will be 1)
        \App\Models\Product::create([
            'category_id' => $cat->id,
            'name' => 'Táo đỏ Mỹ',
            'price' => 50000,
            'old_price' => 60000,
            'discount' => 17,
            'tag' => 'sale',
            'unit' => 'kg',
            'weight' => '1kg',
            'quantity' => 100,
            'description' => 'Táo đỏ nhập khẩu Mỹ, giòn ngọt.',
            'status' => 'in_stock',
        ]);
    }
}
