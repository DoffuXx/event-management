<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->dateTime('event_date');
            $table->integer('duration');
            $table->text('description')->nullable();

            $table->string('location');

            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_code')->nullable();

            $table->integer('capacity');
            $table->integer('whitelist_capacity');
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->timestamps();

            // indexes
            $table->index('event_date');
            $table->index('status');
            $table->index('city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
