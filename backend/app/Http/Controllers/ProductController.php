<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user_id = Auth::user()->id;

        $products = Product::where('user_id', $user_id)->get()->map(function($product){
            $product->banner_image = $product->banner_image ? asset("storage/".$product->banner_image) : null;
            return $product;
        });

        return response()->json([
            'products' => $products, 
            'message' => 'Product List', 
            'status' => true
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
        ]);

        $data['description'] = $request->description;
        $data['cost'] = $request->cost;

        $data['user_id'] = Auth::user()->id;
        if($request->hasFile('banner_image')) {
            $data['banner_image'] = $request->file('banner_image')->store('products', 'public');
        }

        Product::create($data);

        return response()->json(['message' => 'Product Created', 'status' => true]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json(['product' => $product, 'message' => 'Product Info', 'status' => true]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'title' => 'required',
        ]);

        $data['title'] = $request->title ?? $product->title;
        $data['description'] = $request->description ?? $product->description;
        $data['cost'] = $request->cost ?? $product->cost;

        $data['user_id'] = Auth::user()->id;

        if($request->hasFile('banner_image')) {
            if($product->banner_image) {
                Storage::disk('public')->delete($product->banner_image);
            }
            $data['banner_image'] = $request->file('banner_image')->store('products', 'public');
        }

        $product->update($data);

        return response()->json(['message' => 'Product Updated', 'status' => true]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Product Deleted', 'status' => true]);
    }
}
