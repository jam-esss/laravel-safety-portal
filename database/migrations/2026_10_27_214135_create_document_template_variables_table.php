<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_template_variables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_template_id')->constrained()->cascadeOnDelete();
            $table->string('placeholder');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('data_type');
            $table->boolean('is_required')->default(true);
            $table->timestamps();

            $table->unique(['document_template_id', 'placeholder']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_template_variables');
    }
};
