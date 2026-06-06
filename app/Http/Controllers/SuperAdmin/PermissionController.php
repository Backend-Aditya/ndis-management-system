<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\StorePermissionRequest;
use Illuminate\Http\RedirectResponse;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function store(StorePermissionRequest $request): RedirectResponse
    {
        Permission::create(['name' => $request->validated()['name'], 'guard_name' => 'web']);

        return back()->with('success', 'Permission created.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        return back()->with('success', 'Permission deleted.');
    }
}
