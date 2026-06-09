<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Admin\CategoryStoreRequest;
use App\Http\Requests\Admin\CategoryUpdateRequest;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $categories = $query->orderBy('id', 'asc')->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function store(CategoryStoreRequest $request)
    {
        $data = $request->validated();

        if (isset($data['is_active']) && $data['is_active']) {
            if (Category::where('is_active', true)->count() >= 4) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ được phép hiển thị tối đa 4 danh mục trên trang chủ.'
                ], 422);
            }
        }

        if ($request->hasFile('img')) {
            $path = $request->file('img')->store('categories', 'public');
            $data['img'] = $path;
        }

        $category = Category::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo danh mục thành công',
            'data' => $category
        ], 201);
    }

    public function update(CategoryUpdateRequest $request, $id)
    {
        $category = Category::findOrFail($id);
        $data = $request->validated();

        if (isset($data['is_active']) && $data['is_active'] && !$category->is_active) {
            if (Category::where('is_active', true)->count() >= 4) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ được phép hiển thị tối đa 4 danh mục trên trang chủ.'
                ], 422);
            }
        }

        if ($request->hasFile('img')) {
            if ($category->img && Storage::disk('public')->exists($category->img)) {
                Storage::disk('public')->delete($category->img);
            }
            $path = $request->file('img')->store('categories', 'public');
            $data['img'] = $path;
        }

        $category->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật danh mục thành công',
            'data' => $category
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'is_active' => 'required|boolean'
        ]);

        $category = Category::findOrFail($id);

        if ($request->is_active && !$category->is_active) {
            if (Category::where('is_active', true)->count() >= 4) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ được phép hiển thị tối đa 4 danh mục trên trang chủ.'
                ], 422);
            }
        }

        $category->is_active = $request->is_active;
        $category->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công',
            'data' => $category
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        if ($category->img && Storage::disk('public')->exists($category->img)) {
            Storage::disk('public')->delete($category->img);
        }
        
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa danh mục thành công'
        ]);
    }
}