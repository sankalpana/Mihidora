<?php

namespace App\Models;

use Spatie\Tags\HasTags;
use App\Models\Level1Tag;
use App\Models\Tags;
use App\Models\Organizations;
//use Laravel\Scout\Searchable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\belongsToMany;

class Projects extends Model
{
    use HasFactory;

    use HasApiTokens, Notifiable, HasTags; //Searchable

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'project_title',
        'slug',
        'overview',
        'description',
        'locations',
        'photos',
        'uploads',
        'ongoing',
        'start_date',
        'end_date',
        'district_id',
        'city_id',
        'linked_content',
        'organization_id'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * One project belongs to one user
     *
     */
    public function user()
    {
        return $this->belongsTo(User::class)->withDefault([
            'name' => 'Guest Author',
        ]);
    }

    /**
     * Get all of the tags for the project.
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Level1Tag::class, 'level1_taggable', 'level1_taggables');
    }

    public function collaborators()
    {
        return $this->belongsToMany(Organizations::class, 'project_collaborator', 'project_id', 'collaborator_id');
    }
}
