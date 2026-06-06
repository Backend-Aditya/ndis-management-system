<?php

namespace App\Services;

use App\Models\Incident;
use App\Models\IncidentFollowUp;

class IncidentService
{
    /** @param array<string, mixed> $data */
    public function create(array $data): Incident
    {
        return Incident::create([
            ...$data,
            'tenant_id' => app('tenant')->id,
            'reported_by' => request()->user()->id,
        ]);
    }

    /** @param array<string, mixed> $data */
    public function update(Incident $incident, array $data): Incident
    {
        $incident->update($data);

        return $incident->fresh();
    }

    /** @param array<string, mixed> $data */
    public function addFollowUp(Incident $incident, array $data): IncidentFollowUp
    {
        return $incident->followUps()->create($data);
    }
}
