<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\MessageFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    /** @use HasFactory<MessageFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'sender_id', 'subject', 'body', 'message_type', 'is_broadcast',
    ];

    protected function casts(): array
    {
        return [
            'is_broadcast' => 'boolean',
        ];
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function recipients(): HasMany
    {
        return $this->hasMany(MessageRecipient::class);
    }
}
