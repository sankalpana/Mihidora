<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_collaborator', function (Blueprint $table) {
            $table->dropForeign(['collaborator_id']);

            $table
                ->foreign('collaborator_id')
                ->references('id')
                ->on('organizations')
                ->onUpdate('no action')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('project_collaborator', function (Blueprint $table) {
            $table->dropForeign(['collaborator_id']);

            // original foreign key constraint
            $table
                ->foreign('collaborator_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('restrict');
        });
    }
};
