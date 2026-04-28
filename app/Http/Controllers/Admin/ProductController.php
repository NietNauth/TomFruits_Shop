<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductStoreRequest;
use App\Http\Requests\Admin\ProductUpdateRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('tag')) {
            $query->where('tag', $request->tag);
        }
        if ($request->filled('is_featured')) {
            $query->where('is_featured', $request->is_featured);
        }

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    public function store(ProductStoreRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('img')) {
            $path = $request->file('img')->store('products', 'public');
            $data['img'] = $path;
        }

        $product = Product::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo sản phẩm thành công',
            'data' => $product
        ], 201);
    }

    public function update(ProductUpdateRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('img')) {
            // Delete old image if needed
            if ($product->img && Storage::disk('public')->exists($product->img)) {
                Storage::disk('public')->delete($product->img);
            }
            $path = $request->file('img')->store('products', 'public');
            $data['img'] = $path;
        }

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'data' => $product
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        if ($product->img && Storage::disk('public')->exists($product->img)) {
            Storage::disk('public')->delete($product->img);
        }
        
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa sản phẩm thành công'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'nullable|in:in_stock,out_of_stock',
            'is_featured' => 'nullable|boolean',
        ]);

        $product = Product::findOrFail($id);
        
        if ($request->has('status')) {
            $product->status = $request->status;
        }
        if ($request->has('is_featured')) {
            $product->is_featured = $request->is_featured;
        }
        
        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái sản phẩm thành công',
            'data' => $product
        ]);
    }
}
