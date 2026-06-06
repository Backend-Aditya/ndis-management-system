<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Http\Resources\UserResource;
use App\Models\Message;
use App\Models\User;
use App\Services\MessageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function __construct(private readonly MessageService $messageService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $messages = Message::with('sender')
            ->withCount('recipients')
            ->when($search, function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('message_type', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('communications/messages/index', [
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('communications/messages/create', [
            'users' => UserResource::collection(
                User::whereHas('roles', fn ($q) => $q->whereIn('name', ['director', 'manager', 'staff_worker']))->get()
            ),
        ]);
    }

    public function store(StoreMessageRequest $request): RedirectResponse
    {
        $this->messageService->create($request->validated());

        return redirect()->route('messages.index')->with('success', 'Message sent.');
    }

    public function show(Message $message): Response
    {
        $message->load(['sender', 'recipients.recipient']);

        return Inertia::render('communications/messages/show', [
            'message' => MessageResource::make($message)->resolve(),
        ]);
    }

    public function destroy(Message $message): RedirectResponse
    {
        $message->delete();

        return redirect()->route('messages.index')->with('success', 'Message removed.');
    }
}
