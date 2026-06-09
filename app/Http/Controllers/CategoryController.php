<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        // $categories = Category::where('is_active', true)->get();
         $categories = Category::orderBy('id', 'asc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
    public function homeCategories()
{
    $categories = Category::where('is_active', true)
        ->orderBy('id', 'asc')
        ->limit(4)
        ->get();

    return response()->json([
        'success' => true,
        'data' => $categories
    ]);
}

public function allCategories()
{
    $categories = Category::orderBy('id', 'asc')->get();

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
    
}