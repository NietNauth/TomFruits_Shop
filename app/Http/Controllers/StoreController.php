<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $query = Store::query();

        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        if ($request->has('district')) {
            $query->where('district', $request->district);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('address', 'like', "%$search%");
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string',
            'district' => 'required|string',
            'phone' => 'nullable|string',
            'opening_hours' => 'nullable|string',
            'image_url' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $store = Store::create($validated);
        return response()->json($store, 201);
    }

    public function show(Store $store)
    {
        return response()->json($store);
    }

    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'address' => 'string',
            'city' => 'string',
            'district' => 'string',
            'phone' => 'nullable|string',
            'opening_hours' => 'nullable|string',
            'image_url' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $store->update($validated);
        return response()->json($store);
    }

    public function destroy(Store $store)
    {
        $store->delete();
        return response()->json(null, 204);
    }
}
