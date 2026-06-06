<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Http\Requests\Director\StoreAnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use App\Services\AnnouncementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function __construct(private readonly AnnouncementService $announcementService) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $announcements = Announcement::with('creator')
            ->when($search, function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('audience', 'like', "%{$search}%");
            })
            ->orderByDesc('is_pinned')
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('communications/announcements/index', [
            'announcements' => AnnouncementResource::collection($announcements),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('communications/announcements/create');
    }

    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        $this->announcementService->create($request->validated());

        return redirect()->route('announcements.index')->with('success', 'Announcement published.');
    }

    public function togglePin(Announcement $announcement): RedirectResponse
    {
        $this->announcementService->togglePin($announcement);

        return back()->with('success', 'Announcement updated.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $announcement->delete();

        return redirect()->route('announcements.index')->with('success', 'Announcement removed.');
    }
}
