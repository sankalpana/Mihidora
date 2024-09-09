<?php

namespace App\Models;

use Spatie\Tags\HasTags;
use App\Models\Districts;
use App\Models\Level1Tag;
use App\Models\Projects;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
// use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Scout\Searchable;
use App\Models\OrganizationUser;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\belongsToMany;

class Organizations extends Model
{
    use HasApiTokens, HasFactory, Notifiable, HasTags; // Searchable

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'org_name',
        'slug',
        'reg_number',
        'email',
        'org_type',
        'org_size',
        'description',
        'address',
        'social_media',
        'website',
        'contact_number',
        'contact_person',
        'linkedin',
        'instagram',
        'district_id',
        'city_id',
        'overview',
        'ongoing',
        'status',
        'uploads',
        'photos',
        'org_logo',
        'links',
        'track_record'
    ];

    // protected $attributes = [
    //     'social_media' => [], // Default value as an empty array
    // ];


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    /**
     * One project belongs to one user
     *
     */
    public function organizationUser()
    {
        return $this->hasMany(OrganizationUser::class, 'organization_id', 'id');
    }

    public function districts()
    {
        return $this->hasOne(Districts::class, 'district_id', 'id');
        // return $this->belongsTo(Districts::class)->withDefault([
        //     'name_en' => '-',
        // ]);
    }
    /**
     * Get all of the tags for the project.
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Level1Tag::class, 'level1_taggable', 'level1_taggables');
    }

    public function projects()
    {
        return $this->belongsToMany(Projects::class, 'project_collaborator', 'collaborator_id', 'project_id');
    }
}
