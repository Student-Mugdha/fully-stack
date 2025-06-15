import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const Signup = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/register/vendor', data, {
                withCredentials: true, // Important if you're handling cookies or sessions
            });
            console.log(response.data);
            navigate('/'); // Redirect to login page on successful signup
        } catch (error) {
            console.error('Error registering vendor:', error);
            // Show error message to vendor
        }
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="w-[600px]">
                <div className="modal-box">
                    <form onSubmit={handleSubmit(onSubmit)} method="dialog">
                        <Link
                            to="/"
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </Link>

                        <h3 className="font-bold text-lg">vendor Signup</h3>

                        {/* vendorID */}
                        <div className="mt-4 space-y-2">
                            <span>vendorID</span>
                            <input
                                type="text"
                                placeholder="Enter your unique ID"
                                className={`w-80 px-3 py-1 border rounded-md outline-none ${
                                    errors.vendorID
                                        ? 'border-red-500'
                                        : touchedFields.vendorID && !errors.vendorID
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("vendorID", {
                                    required: {
                                        value: true,
                                        message: "vendorID is required",
                                    },
                                    validate: async (value) => {
                                        try {
                                            const response = await axios.get(
                                                `http://localhost:3000/check-vendorid/${value}`
                                            );
                                            return response.data.available || "vendorID already exists!";
                                        } catch (error) {
                                            return "Please enter a new vendorId";
                                        }
                                    },
                                })}
                            />
                            {errors.vendorID && (
                                <span className="text-sm text-red-500">
                                    {errors.vendorID.message}
                                </span>
                            )}
                        </div>

                        {/* vendorName */}
                        <div className="mt-4 space-y-2">
                            <span>vendorName</span>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className={`w-80 px-3 py-1 border rounded-md outline-none ${
                                    errors.vendorName
                                        ? 'border-red-500'
                                        : touchedFields.vendorName && !errors.vendorName
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("vendorName", {
                                    required: {
                                        value: true,
                                        message: "Full name is required",
                                    },
                                })}
                            />
                            {errors.vendorName && (
                                <span className="text-sm text-red-500">
                                    {errors.vendorName.message}
                                </span>
                            )}
                        </div>

                        {/* Phone No. */}
                        <div className="mt-4 space-y-2">
                            <span>Phone No.</span>
                            <input
                                type="text"
                                placeholder="Enter your 10-digit phone number"
                                className={`w-80 px-3 py-1 border rounded-md outline-none ${
                                    errors.vendorPhoneNumber
                                        ? 'border-red-500'
                                        : touchedFields.vendorPhoneNumber && !errors.vendorPhoneNumber
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("vendorPhoneNumber", {
                                    required: {
                                        value: true,
                                        message: "Phone number is required",
                                    },
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Phone number must be exactly 10 digits",
                                    },
                                })}
                            />
                            {errors.vendorPhoneNumber && (
                                <span className="text-sm text-red-500">
                                    {errors.vendorPhoneNumber.message}
                                </span>
                            )}
                        </div>

                        {/* Address */}
                        <div className="mt-4 space-y-2">
                            <span>Address</span>
                            <input
                                type="text"
                                placeholder="Enter your full address"
                                className={`w-80 px-3 py-1 border rounded-md outline-none ${
                                    errors.vendorAddress
                                        ? 'border-red-500'
                                        : touchedFields.vendorAddress && !errors.vendorAddress
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("vendorAddress", {
                                    required: {
                                        value: true,
                                        message: "Address is required",
                                    },
                                })}
                            />
                            {errors.vendorAddress && (
                                <span className="text-sm text-red-500">
                                    {errors.vendorAddress.message}
                                </span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mt-4 space-y-2">
                            <span>Email</span>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`w-80 px-3 py-1 border rounded-md outline-none ${
                                    errors.vendorEmail
                                        ? 'border-red-500'
                                        : touchedFields.vendorEmail && !errors.vendorEmail
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("vendorEmail", {
                                    required: {
                                        value: true,
                                        message: "Email is required",
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Please enter a valid email address",
                                    },
                                })}
                            />
                            {errors.vendorEmail && (
                                <span className="text-sm text-red-500">
                                    {errors.vendorEmail.message}
                                </span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mt-4 space-y-2">
                            <span>Password</span>
                            <input
                                type="password"
                                placeholder="Enter your password (min 8 characters)"
                                className={`w-80 px-3 py-1 border rounded-md outline-none ${
                                    errors.vendorPassword
                                        ? 'border-red-500'
                                        : touchedFields.vendorPassword && !errors.vendorPassword
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("vendorPassword", {
                                    required: {
                                        value: true,
                                        message: "Password is required",
                                    },
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long",
                                    },
                                })}
                            />
                            {errors.vendorPassword && (
                                <span className="text-sm text-red-500">
                                    {errors.vendorPassword.message}
                                </span>
                            )}
                        </div>

                        {/* Button */}
                        <div className="flex justify-around mt-4">
                            <button className="bg-pink-500 text-white rounded-md ml-[10px] px-3 py-1 hover:bg-pink-700 duration-200">
                                Signup
                            </button>
                            <div className="ml-[150px]">
                                <p className="text-xl">
                                    Have an account?{' '}
                                    <Link
                                        to="/"
                                        className="underline text-blue-500 cursor-pointer"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
