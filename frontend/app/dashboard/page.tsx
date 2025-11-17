"use client";

import React, { useState, useEffect } from "react";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface ProductType{
    id?: number,
    title: string,
    description?: string,
    cost: number,
    file: string,
    banner_image?: File | null | string 
}

const Dashboard: React.FC = () => {

    const { isLoading,authToken } = myAppHook();
    const router = useRouter();
    const fileRef = React.useRef<HTMLInputElement>(null);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [formData, setFormData] = useState<ProductType>({
        title: "",
        description: "",
        cost: 0,
        file: "",
        banner_image: null
    })

    // Page Loading When Auth Token is available
    useEffect(() => {
        if(!authToken){
            router.push("/auth");
            return
        }

        fetchAllProducts()
    }, [authToken])

    // On change Form Inputs 
    const handleOnChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files){
            // File Uploaded
            setFormData({
                ...formData,
                banner_image: event.target.files[0],
                file: URL.createObjectURL(event.target.files[0])
            })
        }else{
            // File not Uploaded
            setFormData({
                ...formData,
                [event.target.name]: event.target.value
            }) 
        }
    }

    // Form Submit - Add Product
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("description", formData.description ?? "");
            fd.append("cost", String(formData.cost));

            if (formData.banner_image instanceof File) {
                fd.append("banner_image", formData.banner_image);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/products`,
                fd,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            toast.success(response.data.message);
            fetchAllProducts(); // Refresh table

            // Reset form
            setFormData({
                title: "",
                description: "",
                cost: 0,
                file: "",
                banner_image: null
            });

            if (fileRef.current) fileRef.current.value = "";

        } catch (error) {
            console.log(error);
            toast.error("Failed to add product");
        }
    };

    // Fetch Products 
    const fetchAllProducts = async() => {
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

            setProducts(response.data.products);
        }catch(error){
            console.log(error);
        }
    }

    // Edit Product
    const handleEditFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("description", formData.description ?? "");
            fd.append("cost", String(formData.cost));

            if (formData.banner_image instanceof File) {
                fd.append("banner_image", formData.banner_image);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/products/${formData.id}?_method=PUT`,
                fd,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            toast.success(response.data.message);
            setIsEdit(false);
            fetchAllProducts(); // Refresh table

            // Reset form
            setFormData({
                title: "",
                description: "",
                cost: 0,
                file: "",
                banner_image: null
            });

            if (fileRef.current) fileRef.current.value = "";

        } catch (error) {
            console.log(error);
            toast.error("Failed to update product");
        }
    };

    // Delete Product
    const handleDeleteProduct = async (productId: number) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                );
                
                toast.success('Product deleted successfully');
                fetchAllProducts(); // Refresh the list
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete product');
        }
    };

    // Cancel Edit
    const handleCancelEdit = () => {
        setIsEdit(false);
        setFormData({
            title: "",
            description: "",
            cost: 0,
            file: "",
            banner_image: null
        });
        if (fileRef.current) fileRef.current.value = "";
    }

    return <>
    <div className="container mt-4">
        <div className="row">
            <div className="col-md-6">
                <div className="card p-4">
                    <h4>{isEdit ? "Edit" : "Add"} Product</h4>
                    <form onSubmit={ 
                            isEdit ? handleEditFormSubmit : handleFormSubmit
                         }>
                        <input 
                            className="form-control mb-2" 
                            name="title" 
                            placeholder="Title" 
                            onChange={handleOnChangeEvent}
                            value={formData.title}
                            required 
                        />

                        <input 
                            className="form-control mb-2" 
                            name="description" 
                            placeholder="Description" 
                            onChange={handleOnChangeEvent}
                            value={formData.description}
                            required 
                        />

                        <input 
                            className="form-control mb-2" 
                            name="cost" 
                            placeholder="Cost" 
                            type="number" 
                            onChange={handleOnChangeEvent}
                            value={formData.cost}
                            required 
                        />

                        <div className="mb-2">
                            {
                                formData.file && ( 
                                    <img 
                                        src={formData.file} 
                                        alt="Preview" 
                                        width={100}  
                                        height={100} 
                                        className="img-thumbnail"
                                        style={{objectFit: 'cover'}}
                                    />
                                )
                            }
                        </div>
                        <input 
                            className="form-control mb-2" 
                            type="file" 
                            ref={ fileRef }
                            onChange={handleOnChangeEvent}
                            id="bannerInput" 
                            accept="image/*"
                        />
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" type="submit">
                                {isEdit ? "Update" : "Add"} Product
                            </button>
                            {isEdit && (
                                <button 
                                    className="btn btn-secondary" 
                                    type="button"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="col-md-6">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Banner</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((singleProduct,index) => (
                                <tr key={ singleProduct.id }>
                                    <td>{singleProduct.id}</td>
                                    <td>{singleProduct.title}</td>
                                    <td>
                                        {singleProduct.banner_image ? (
                                            <img 
                                                src={singleProduct.banner_image} // Direct URL use karo
                                                alt="Product"
                                                width={50}
                                                height={50}
                                                className="img-thumbnail"
                                                style={{objectFit: 'cover'}}
                                                onError={(e) => {
                                                    // Fallback agar image load na ho
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextSibling?.remove();
                                                    const fallback = document.createElement('div');
                                                    fallback.textContent = 'No Image';
                                                    e.currentTarget.parentNode?.appendChild(fallback);
                                                }}
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td>${singleProduct.cost}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => {
                                                // Direct URL use karo, koi modification nahi
                                                setFormData({
                                                    id: singleProduct.id,
                                                    title: singleProduct.title,
                                                    cost: singleProduct.cost,
                                                    description: singleProduct.description,
                                                    file: singleProduct.banner_image || "", // Direct URL
                                                    banner_image: null
                                                });
                                                setIsEdit(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteProduct(singleProduct.id!)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>;
}

export default Dashboard;