<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Tags\HasTags;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Inquiries extends Model
{
    use HasFactory;
    use HasApiTokens, HasFactory, Notifiable, HasTags; //Searchable;

    protected $fillable = [
        'type',
        'full_name',
        'email',
        'phone',
        'description',
        'status'
    ];

}
