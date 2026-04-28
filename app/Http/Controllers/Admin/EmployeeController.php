<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Http\Requests\Admin\EmployeeStoreRequest;
use App\Http\Requests\Admin\EmployeeUpdateRequest;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $employees = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $employees
        ]);
    }

    public function show($id)
    {
        $employee = Employee::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $employee
        ]);
    }

    public function store(EmployeeStoreRequest $request)
    {
        $data = $request->validated();
        
        // Remove manual Hash::make if model casts it, although leaving it here shouldn't hurt if we remove it.
        // Given Employee has password => hashed cast in Laravel 11, manual hashing is not needed if we set raw password.
        // Wait, just to be safe, we'll keep what user had or let Laravel handle it.
        // If we use $data['password'] it will be automatically hashed by Eloquent model cast!
        
        if (!isset($data['is_active'])) {
             $data['is_active'] = true;
        }

        $employee = Employee::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo nhân viên thành công',
            'data' => $employee
        ], 201);
    }

    public function update(EmployeeUpdateRequest $request, $id)
    {
        $employee = Employee::findOrFail($id);
        $data = $request->validated();

        $employee->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật nhân viên thành công',
            'data' => $employee
        ]);
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        
        // Prevent self deletion
        if ($employee->id === auth('admin')->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể tự xóa chính mình'
            ], 403);
        }

        $employee->is_active = false;
        $employee->save();

        return response()->json([
            'success' => true,
            'message' => 'Xóa nhân viên thành công'
        ]);
    }
}
