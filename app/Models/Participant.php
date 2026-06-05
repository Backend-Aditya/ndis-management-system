<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\ParticipantFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Participant extends Model implements HasMedia
{
    /** @use HasFactory<ParticipantFactory> */
    use HasFactory, HasTenant, HasUuids, InteractsWithMedia;

    protected $fillable = [
        'tenant_id', 'ndis_number', 'first_name', 'last_name', 'date_of_birth',
        'gender', 'pronouns', 'address', 'suburb', 'state', 'postcode',
        'primary_language', 'interpreter_required', 'communication_needs',
        'cultural_background', 'participant_status',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'interpreter_required' => 'boolean',
        ];
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(ParticipantContact::class);
    }

    public function goals(): HasMany
    {
        return $this->hasMany(ParticipantGoal::class);
    }

    public function diagnoses(): HasMany
    {
        return $this->hasMany(ParticipantDiagnosis::class);
    }

    public function supportCoordinators(): HasMany
    {
        return $this->hasMany(SupportCoordinator::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('documents');
    }
}
