<?php

namespace App\Services;

use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class MessageService
{
    /** @param array{subject: string, body: string, message_type: string, is_broadcast?: bool, recipient_ids?: array<int, string>} $data */
    public function create(array $data): Message
    {
        return DB::transaction(function () use ($data) {
            $message = Message::create([
                'tenant_id' => app('tenant')->id,
                'sender_id' => request()->user()->id,
                'subject' => $data['subject'],
                'body' => $data['body'],
                'message_type' => $data['message_type'],
                'is_broadcast' => $data['is_broadcast'] ?? false,
            ]);

            $recipientIds = $data['recipient_ids'] ?? [];

            if ($message->is_broadcast) {
                // Broadcast to all active users in tenant
                $recipientIds = User::where('is_active', true)
                    ->where('id', '!=', $message->sender_id)
                    ->pluck('id')
                    ->all();
            }

            foreach ($recipientIds as $recipientId) {
                $message->recipients()->create([
                    'recipient_id' => $recipientId,
                    'is_read' => false,
                ]);
            }

            return $message->load('recipients');
        });
    }

    public function markRead(Message $message, string $userId): void
    {
        $message->recipients()
            ->where('recipient_id', $userId)
            ->update(['is_read' => true, 'read_at' => now()]);
    }
}
