<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('chat_messages')) {
            Schema::create('chat_messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained();
                $table->foreignId('admin_id')->nullable()->constrained('users');
                $table->text('message');
                $table->boolean('is_admin')->default(false);
                $table->boolean('read')->default(false);
                $table->string('chat_session_id')->index();
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('chat_messages');
    }
};