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
            const response = await axios.post('http://localhost:3000/register/user', data, {
                withCredentials: true, // Important if you're handling cookies or sessions
            });
            console.log(response.data);
            navigate('/'); // Redirect to login page on successful signup
        } catch (error) {
            console.error('Error registering user:', error);
            // Show error message to user
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

                        <h3 className="font-bold text-lg">User Signup</h3>

                        {/* UserID */}
                        <div className="mt-4 space-y-2">
                            <span>UserID</span>
                            <input
                                type="text"
                                placeholder="Enter your unique ID"
                                className={`w-80 px-3 py-1 border rounded-md outline-none ${
                                    errors.userID
                                        ? 'border-red-500'
                                        : touchedFields.userID && !errors.userID
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("userID", {
                                    required: {
                                        value: true,
                                        message: "UserID is required",
                                    },
                                    validate: async (value) => {
                                        try {
                                            const response = await axios.get(
                                                `http://localhost:3000/check-userid/${value}`
                                            );
                                            return response.data.available || "UserID already exists!";
                                        } catch (error) {
                                            return "Please enter a new UserId";
                                        }
                                    },
                                })}
                            />
                            {errors.userID && (
                                <span className="text-sm text-red-500">
                                    {errors.userID.message}
                                </span>
                            )}
                        </div>

                        {/* UserName */}
                        <div className="mt-4 space-y-2">
                            <span>UserName</span>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className={`w-80 px-3 py-1 border rounded-md outline-none ${
                                    errors.userName
                                        ? 'border-red-500'
                                        : touchedFields.userName && !errors.userName
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("userName", {
                                    required: {
                                        value: true,
                                        message: "Full name is required",
                                    },
                                })}
                            />
                            {errors.userName && (
                                <span className="text-sm text-red-500">
                                    {errors.userName.message}
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
                                    errors.userPhoneNumber
                                        ? 'border-red-500'
                                        : touchedFields.userPhoneNumber && !errors.userPhoneNumber
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("userPhoneNumber", {
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
                            {errors.userPhoneNumber && (
                                <span className="text-sm text-red-500">
                                    {errors.userPhoneNumber.message}
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
                                    errors.userAddress
                                        ? 'border-red-500'
                                        : touchedFields.userAddress && !errors.userAddress
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("userAddress", {
                                    required: {
                                        value: true,
                                        message: "Address is required",
                                    },
                                })}
                            />
                            {errors.userAddress && (
                                <span className="text-sm text-red-500">
                                    {errors.userAddress.message}
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
                                    errors.userEmail
                                        ? 'border-red-500'
                                        : touchedFields.userEmail && !errors.userEmail
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("userEmail", {
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
                            {errors.userEmail && (
                                <span className="text-sm text-red-500">
                                    {errors.userEmail.message}
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
                                    errors.userPassword
                                        ? 'border-red-500'
                                        : touchedFields.userPassword && !errors.userPassword
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                }`}
                                {...register("userPassword", {
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
                            {errors.userPassword && (
                                <span className="text-sm text-red-500">
                                    {errors.userPassword.message}
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
