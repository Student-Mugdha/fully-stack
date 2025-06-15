import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const VendorSignup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3000/register/vendor",
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success("Registration successful! Please login.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error registering vendor:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-[600px]">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </Link>

            <h3 className="font-bold text-2xl text-center mb-6">
              Vendor Signup
            </h3>

            {/* VendorID */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">VendorID</span>
              <input
                type="text"
                placeholder="Enter your unique ID"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.vendorID
                    ? "border-red-500"
                    : touchedFields.vendorID && !errors.vendorID
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("vendorID", {
                  required: {
                    value: true,
                    message: "VendorID is required",
                  },
                  validate: async (value) => {
                    try {
                      const response = await axios.get(
                        `http://localhost:3000/check-vendorid/${value}`
                      );
                      return (
                        response.data.available || "VendorID already exists!"
                      );
                    } catch (error) {
                      return "Error checking VendorID availability";
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

            {/* VendorName */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">Vendor Name</span>
              <input
                type="text"
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.vendorName
                    ? "border-red-500"
                    : touchedFields.vendorName && !errors.vendorName
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
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

            {/* Phone Number */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">Phone Number</span>
              <input
                type="text"
                placeholder="Enter your 10-digit phone number"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.vendorPhoneNumber
                    ? "border-red-500"
                    : touchedFields.vendorPhoneNumber &&
                      !errors.vendorPhoneNumber
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
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
              <span className="text-gray-700">Address</span>
              <input
                type="text"
                placeholder="Enter your full address"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.vendorAddress
                    ? "border-red-500"
                    : touchedFields.vendorAddress && !errors.vendorAddress
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
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
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.vendorEmail
                    ? "border-red-500"
                    : touchedFields.vendorEmail && !errors.vendorEmail
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
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
              <span className="text-gray-700">Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.vendorPassword
                    ? "border-red-500"
                    : touchedFields.vendorPassword && !errors.vendorPassword
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("vendorPassword", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
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
            <div className="flex flex-col items-center mt-6 space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing up..." : "Signup"}
              </button>
              <p className="text-gray-600">
                Have an account?{" "}
                <Link to="/" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
