<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Chuyển dữ liệu địa chỉ cũ sang bảng user_addresses
        $usersWithAddress = DB::table('users')->whereNotNull('address')->where('address', '!=', '')->get();
        foreach ($usersWithAddress as $user) {
            $exists = DB::table('user_addresses')->where('user_id', $user->id)->exists();
            if (!$exists) {
                DB::table('user_addresses')->insert([
                    'user_id' => $user->id,
                    'receiver_name' => $user->name,
                    'receiver_phone' => $user->phone ?? '',
                    'province' => 'Chưa cập nhật',
                    'district' => 'Chưa cập nhật',
                    'ward' => 'Chưa cập nhật',
                    'address_detail' => $user->address,
                    'is_default' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 2. Tối ưu hóa cấu trúc ID và Khóa ngoại
        Schema::disableForeignKeyConstraints();

        // Drop foreign keys first
        Schema::table('cart', function (Blueprint $table) { $table->dropForeign('cart_ibfk_1'); });
        Schema::table('orders', function (Blueprint $table) { $table->dropForeign('orders_ibfk_1'); });
        Schema::table('reviews', function (Blueprint $table) { $table->dropForeign('reviews_ibfk_2'); });
        Schema::table('user_addresses', function (Blueprint $table) { $table->dropForeign('user_addresses_user_id_foreign'); });

        // Thay đổi users.id sang BigInt Unsigned Auto Increment (chuẩn Laravel)
        DB::statement('ALTER TABLE users MODIFY id BIGINT UNSIGNED AUTO_INCREMENT');

        // Cập nhật kiểu dữ liệu user_id ở các bảng liên quan
        $tables = ['cart', 'orders', 'reviews', 'user_addresses'];
        foreach ($tables as $table) {
            DB::statement("ALTER TABLE $table MODIFY user_id BIGINT UNSIGNED");
        }

        // Add foreign keys back
        Schema::table('cart', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        Schema::table('user_addresses', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 3. Xóa cột address dư thừa trong bảng users
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('address');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('address')->after('phone')->nullable();
        });

        // Lưu ý: rollback ID type về Int(11) có thể phức tạp nếu dữ liệu lớn, 
        // ở đây tạm thời giữ nguyên BigInt vì nó an toàn hơn.
    }
};
