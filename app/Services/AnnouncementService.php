<?php

namespace App\Services;

use App\Models\Announcement;

class AnnouncementService
{
    /** @param array<string, mixed> $data */
    public function create(array $data): Announcement
    {
        return Announcement::create([
            ...$data,
            'tenant_id' => app('tenant')->id,
            'created_by' => request()->user()->id,
        ]);
    }

    /** @param array<string, mixed> $data */
    public function update(Announcement $announcement, array $data): Announcement
    {
        $announcement->update($data);

        return $announcement->fresh();
    }

    public function togglePin(Announcement $announcement): Announcement
    {
        $announcement->update(['is_pinned' => ! $announcement->is_pinned]);

        return $announcement->fresh();
    }
}
