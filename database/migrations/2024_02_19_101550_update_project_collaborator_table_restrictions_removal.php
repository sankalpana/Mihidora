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
            // Drop the existing foreign key constraints
            $table->dropForeign(['project_id']);
            $table->dropForeign(['collaborator_id']);

            // Add new foreign key constraints without restrictions
            $table
                ->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');
            $table
                ->foreign('collaborator_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('cascade')
                ->onUpdate('cascade');
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
            // Drop the new foreign key constraints
            $table->dropForeign(['project_id']);
            $table->dropForeign(['collaborator_id']);

            // Add back the original foreign key constraints if needed
            $table
                ->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('restrict');
            $table
                ->foreign('collaborator_id')
                ->references('id')
                ->on('organizations')
                ->onDelete('restrict');
        });
    }
};
