<?php

namespace App\Services;

use App\Models\Shift;
use App\Models\ShiftCancellation;
use App\Models\ShiftHandoverNote;

class ShiftService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Shift
    {
        return Shift::create([
            ...$data,
            'tenant_id' => app('tenant')->id,
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Shift $shift, array $data): Shift
    {
        $shift->update($data);

        return $shift->fresh();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function cancel(Shift $shift, array $data): ShiftCancellation
    {
        $shift->update(['status' => 'cancelled']);

        return $shift->cancellation()->updateOrCreate(
            ['shift_id' => $shift->id],
            $data,
        );
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function addHandoverNote(Shift $shift, array $data): ShiftHandoverNote
    {
        return $shift->handoverNotes()->create([
            ...$data,
            'submitted_at' => now(),
        ]);
    }
}
