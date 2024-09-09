<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inquiries;
use Illuminate\Support\Facades\Validator;

class InquiriesController extends Controller
{
    public function store(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'type' => 'required',
            'full_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'description' => 'required|string|max:500',
        ]);

        // If validation fails, return a JSON response with status 401
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error' => $validator->errors()
            ]);
        }

        // Create an Inquiry record
        $inquiry = Inquiries::create([
            'type' => $request->input('type', 1),
            'full_name' => $request->input('full_name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'description' => $request->input('description'),
            'status' => $request->input('status', 0),
        ]);

        // Return success message with a JSON response status 200
        return response()->json(
            [
                'status' => 200,
                'message' => 'Inquiry created successfully',
                'inquiry' => $inquiry,
            ],
            200
        );
    }
}
