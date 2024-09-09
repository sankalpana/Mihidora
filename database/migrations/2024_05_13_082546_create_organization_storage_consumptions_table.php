<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('organization_storage_consumptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->string('organization_name', 200)->fulltext();
            $table->integer('year');
            $table->integer('month');
            $table->decimal('storage_mb', 10, 2);
            $table->unique(['organization_id', 'year', 'month'], 'org_year_month_unique');
        });        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('organization_storage_consumptions');
    }
};
