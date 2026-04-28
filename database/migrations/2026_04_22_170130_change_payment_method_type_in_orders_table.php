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
        // Using raw SQL because changing ENUM to string via Blueprint can be tricky
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_method VARCHAR(50) DEFAULT 'cod'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_method ENUM('cod', 'vnpay') DEFAULT 'cod'");
    }
};
