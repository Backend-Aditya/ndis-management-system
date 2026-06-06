<?php

namespace App\Models;

use App\Concerns\HasTenant;
use Database\Factories\AuditFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    /** @use HasFactory<AuditFactory> */
    use HasFactory, HasTenant, HasUuids;

    protected $fillable = [
        'tenant_id', 'audit_type', 'auditor_name', 'audit_date',
        'next_audit_date', 'outcome', 'status',
    ];

    protected function casts(): array
    {
        return [
            'audit_date' => 'date',
            'next_audit_date' => 'date',
        ];
    }
}
