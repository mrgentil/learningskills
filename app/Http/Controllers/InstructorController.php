<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class InstructorController extends Controller
{
    /**
     * List all instructors for the current academy.
     */
    public function index()
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();

        if (!$tenant) {
            return response()->json(['error' => 'Academy not found'], 404);
        }

        $instructors = $tenant->users()
            ->wherePivotIn('role', ['instructor', 'owner'])
            ->get()
            ->map(function ($instructor) {
                return [
                    'id' => $instructor->id,
                    'name' => $instructor->name,
                    'email' => $instructor->email,
                    'role' => $instructor->pivot->role,
                    'joined_at' => $instructor->pivot->created_at->format('d/m/Y'),
                ];
            });

        return response()->json($instructors);
    }

    /**
     * Invite a new instructor by email.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();

        if (!$tenant) {
            return response()->json(['error' => 'Academy not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $email = $request->email;
        $name = $request->name;

        // Check if user exists
        $instructor = User::where('email', $email)->first();
        $isNewUser = false;
        $tempPassword = null;

        if (!$instructor) {
            // Create new user if not exists
            $isNewUser = true;
            $tempPassword = Str::random(10);
            $instructor = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($tempPassword),
            ]);
        }

        // Check if already in tenant
        $exists = $tenant->users()->where('users.id', $instructor->id)->exists();
        if ($exists) {
            // If already student, upgrade to instructor
             $tenant->users()->updateExistingPivot($instructor->id, ['role' => 'instructor']);
             return response()->json(['message' => 'L\'utilisateur existant a été promu Instructeur.']);
        }

        // Attach to tenant as instructor
        $tenant->users()->attach($instructor->id, ['role' => 'instructor']);

        $message = 'Instructeur ajouté avec succès.';
        if ($isNewUser) {
            $message .= " Un compte a été créé. Mot de passe temporaire : $tempPassword (Affichez-le maintenant, il ne sera plus visible).";
        }

        return response()->json([
            'message' => $message,
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
                'role' => 'instructor',
                'joined_at' => now()->format('d/m/Y'),
                'temp_password' => $tempPassword // Only sent once for display
            ]
        ]);
    }

    /**
     * Remove an instructor.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();

        if (!$tenant) {
            return response()->json(['error' => 'Academy not found'], 404);
        }

        // Prevent removing yourself (owner)
        if ($id == $user->id) {
            return response()->json(['error' => 'Vous ne pouvez pas vous supprimer vous-même.'], 403);
        }

        $tenant->users()->detach($id);

        return response()->json(['message' => 'Instructeur retiré avec succès.']);
    }
}
