<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('tkn')->unique();
            $table->string('make');
            $table->string('model');
            $table->string('description')->nullable();
            $table->string('asset_tag')->nullable();
            $table->string('serial_number')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_price', 10, 2)->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
