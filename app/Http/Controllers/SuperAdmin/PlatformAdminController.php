<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\StorePlatformAdminRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlatformAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $admins = User::withoutGlobalScopes()
            ->whereNull('tenant_id')
            ->whereHas('roles', fn ($q) => $q->where('name', 'super_admin'))
            ->when($search, function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('super-admin/platform-admins/index', [
            'admins' => UserResource::collection($admins),
        ]);
    }

    public function store(StorePlatformAdminRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create([
            'tenant_id' => null,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $user->assignRole('super_admin');

        return redirect()->route('super-admin.platform-admins.index')
            ->with('success', 'Platform admin added.');
    }

    public function destroy(Request $request, User $platformAdmin): RedirectResponse
    {
        // Prevent self-deletion
        if ($platformAdmin->id === $request->user()->id) {
            return back()->with('error', 'You cannot remove your own account.');
        }

        $platformAdmin->delete();

        return back()->with('success', 'Platform admin removed.');
    }
}
