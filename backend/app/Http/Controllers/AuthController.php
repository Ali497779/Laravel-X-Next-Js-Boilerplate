<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request){
        $data = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required'
        ]);

        User::create($data);

        return response()->json(['message' => 'User created successfully', 'status' => true]);
    }

    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if(!Auth::attempt($request->only("email", "password"))){
            return response()->json(['message' => 'Invalid credentials', 'status' => false]);
        }

        $user = Auth::user();
        $token = $user->createToken('token')->plainTextToken;

        return response()->json(['token' => $token,'message' => 'User logged in successfully', 'status' => true]);
    }

    public function profile(){
        $user = Auth::user();

        return response()->json(['user' => $user,'message' => 'User Profile Info', 'status' => true]);
    }

    public function logout(){
        Auth::logout();

        return response()->json(['message' => 'User logged out successfully', 'status' => true]);
    }

}
