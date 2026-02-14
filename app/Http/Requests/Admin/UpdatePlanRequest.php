<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user() && $this->user()->is_super_admin;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:plans,slug,' . $this->route('plan')->id,
            'stripe_plan_id' => 'nullable|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'interval' => 'sometimes|in:month,year',
            'description' => 'nullable|string',
            'max_courses' => 'sometimes|integer|min:0',
            'max_students' => 'sometimes|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ];
    }
}
