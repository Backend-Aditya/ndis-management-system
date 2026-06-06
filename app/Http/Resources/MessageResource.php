<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sender_id' => $this->sender_id,
            'subject' => $this->subject,
            'body' => $this->body,
            'message_type' => $this->message_type,
            'is_broadcast' => $this->is_broadcast,
            'created_at' => $this->created_at->toISOString(),
            'sender' => $this->whenLoaded('sender', fn () => [
                'id' => $this->sender->id,
                'full_name' => $this->sender->full_name,
            ]),
            'recipient_count' => $this->whenCounted('recipients'),
        ];
    }
}
