<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\MessageRecipient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<MessageRecipient> */
class MessageRecipientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'message_id' => Message::factory(),
            'recipient_id' => User::factory(),
            'is_read' => false,
            'read_at' => null,
        ];
    }
}
