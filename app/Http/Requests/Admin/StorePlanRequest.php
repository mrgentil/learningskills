<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user() && $this->user()->is_super_admin;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:plans,slug',
            'stripe_plan_id' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'interval' => 'required|in:month,year',
            'description' => 'nullable|string',
            'max_courses' => 'required|integer|min:0',
            'max_students' => 'required|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ];
    }
}
